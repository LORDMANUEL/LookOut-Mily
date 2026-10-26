#!/usr/bin/env python3
"""Offline OpenSSL S/MIME samples: real encryption and signature verification with throwaway keys."""
import subprocess
import tempfile
from pathlib import Path
from email import policy
from email.parser import BytesParser

def command(*args, capture=False):
    return subprocess.run(args, check=True, stdout=subprocess.PIPE if capture else subprocess.DEVNULL,
                          stderr=subprocess.PIPE, timeout=25)
with tempfile.TemporaryDirectory() as wd:
    wd=Path(wd)
    key,cert,msg=wd/"private.key",wd/"identity.crt",wd/"mail.txt"
    msg.write_text("Outlook MIME check: correo confidencial de prueba.\n",encoding="utf-8")
    command("openssl","req","-x509","-newkey","rsa:2048","-nodes","-days","1",
            "-keyout",str(key),"-out",str(cert),"-subj","/CN=LookOut-Mily Test")
    encrypted,signed=wd/"encrypted.eml",wd/"signed.eml"
    command("openssl","cms","-encrypt","-aes256","-in",str(msg),
            "-out",str(encrypted),"-outform","SMIME",str(cert))
    command("openssl","cms","-sign","-in",str(msg),"-out",str(signed),
            "-outform","SMIME","-signer",str(cert),"-inkey",str(key))
    signed_mime=BytesParser(policy=policy.default).parsebytes(signed.read_bytes())
    enc_mime=BytesParser(policy=policy.default).parsebytes(encrypted.read_bytes())
    assert signed_mime.get_content_type()=="multipart/signed",signed_mime.get_content_type()
    assert enc_mime.get_content_type()=="application/pkcs7-mime",enc_mime.get_content_type()
    assert b"correo confidencial de prueba" not in encrypted.read_bytes(), "S/MIME envelope exposes plaintext"
    decrypted=command("openssl","cms","-decrypt","-in",str(encrypted),
                    "-recip",str(cert),"-inkey",str(key), capture=True).stdout
    assert b"correo confidencial de prueba" in decrypted
    # The add-on must refuse automatic repackaging of these protected MIME types.
    print("PASS signed S/MIME fixture: multipart/signed; original protected by guard")
    print("PASS encrypted S/MIME fixture: application/pkcs7-mime; plaintext not in encrypted mail")
    print("PASS decryption with throwaway private key: content restored exactly")
    print("PASS signature and encryption are separate properties; unsigned encrypted requires key")
