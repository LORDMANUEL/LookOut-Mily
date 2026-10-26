"""Parches acotados sobre la versión original 3.5.10 sin modificar el motor de decodificación más allá de validaciones seguras."""
from __future__ import annotations

def replacement(source: str, original: str, modified: str, label: str) -> str:
    occurrences = source.count(original)
    if occurrences != 1:
        raise ValueError(f"Expected one occurrence for {label}, found {occurrences}")
    return source.replace(original, modified, 1)

def patch_decoder(source: str) -> str:
    source = replacement(
        source,
        'name:        name        || "adjunto",',
        'name:        String(name || "unknown.dat").replace(/\\0+$/g, "").replace(/[\\\\/]/g, "_"),',
        "remove null byte in filename"
    )
    source = replacement(
        source,
        'if (!tnef_attr_check_checksum(attr, checksum))\n        tnef_log_msg("LookOut: TNEF attribute invalid checksum", 3);',
        'if (!tnef_attr_check_checksum(attr, checksum))\n        throw new Error("TNEF attribute checksum mismatch");',
        "abort on corrupted attribute checksum"
    )
    source = replacement(
        source,
        'console.error("[LookOut] Error decoding TNEF:", err);\n  }\n\n  return files;',
        'console.error("[LookOut] Error decoding TNEF:", err);\n    return []; // Reject any partial results after an error.\n  }\n\n  return files;',
        "don't leak partial decoded files after parser errors"
    )
    # A zero-length TNEF attribute is complete even when attr.buf == "".
    # The legacy truthiness test abandoned the stream, dropping attachments
    # whose DATA appeared before TITLE and 0-byte objects.
    source = replacement(
        source,
        'return attr.len >= 0 && !(attr.buf && attr.buf.length === attr.len);',
        'return attr.len >= 0 && (attr.buf == null || attr.buf.length !== attr.len);',
        "accept complete zero-length attributes"
    )
    # Read the current complete attribute even if the following attribute is
    # only 11 bytes (a valid zero-length attribute). The previous loop
    # incorrectly lost the filename in empty attachments.
    source = replacement(
        source,
        'while (pkg.cur_attr && tnef_pack_data_left(instrm)) {',
        'while (pkg.cur_attr) {',
        "finish current attribute even when stream has a short final attribute"
    )
    return source

def patch_backend(source: str) -> str:
    start = 'async function replaceMessageWithConvertedCopy(tab, messageHeader, allAttachments, settings) {\n'
    guard = r'''async function replaceMessageWithConvertedCopy(tab, messageHeader, allAttachments, settings) {
  // The decrypted MIME tree cannot be safely repackaged as the original
  // signed/encrypted message. Fail closed; keep encrypted/signed mail intact.
  const opaque = await messenger.messages.getFull(messageHeader.id, {
    decodeContent: false, decodeHeaders: false, decrypt: false
  });
  const isProtected = (part, depth = 0) => {
    if (!part || depth > 24) return false;
    const mime = String(part.contentType || "").toLowerCase();
    if (/(?:multipart\/(?:signed|encrypted)|application\/(?:x-)?pkcs7-(?:mime|signature)|application\/pgp-encrypted)/i.test(mime))
      return true;
    return Array.isArray(part.parts) && part.parts.some(p => isProtected(p, depth + 1));
  };
  if (isProtected(opaque)) {
    await logWarn("replace-protected-message-preserved", {messageId: messageHeader.id});
    throw new Error("Mensaje firmado o cifrado: se conserva el original. Descifre primero en Thunderbird.");
  }
'''
    source=replacement(source,start,guard,"don't rewrite signed/encrypted MIME")
    source=replacement(source,
        'const { convertedBytes, extracted, tnefEntries } = await performCompleteConversion(messageHeader, allAttachments);\n  const convertedFile',
        'const { convertedBytes, extracted, tnefEntries } = await performCompleteConversion(messageHeader, allAttachments);\n  if (extracted.length === 0 || !convertedBytes.length) {\n    throw new Error("Conversión incompleta: ningún archivo TNEF recuperado; original conservado");\n  }\n  const convertedFile',
        "require nonempty converted TNEF extraction")
    source=replacement(source,
        '  await messenger.messages.delete([messageHeader.id], false);\n  await logInfo("replace-deleted-original", {',
        '  // Keep the original in the folder even after a successful import.\n  // This avoids destructive behavior with proprietary Outlook metadata.\n  await logInfo("replace-preserved-original", {',
        "original must never be deleted automatically")
    return source

def patch_options(source: str) -> str:
    source=replacement(source,'replaceOriginal: true,','replaceOriginal: false,',
                       "safe default for new installations")
    source=replacement(source,
      'document.getElementById("replaceOriginal").checked = s.replaceOriginal !== false;',
      'document.getElementById("replaceOriginal").checked = !!s.replaceOriginal;',
      "read safe default for replaceOriginal")
    return source
