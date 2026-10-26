"use strict";
/* Generated synthetic TNEF fixtures: no real customer mail or passwords. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const dir = "/tmp/lookout-check";
const mapi = fs.readFileSync(path.join(dir,"mapi_props.js"),"utf8");
const tnef = fs.readFileSync(path.join(dir,"tnef_decoder.js"),"utf8");
const sandbox = {console,Buffer,TextDecoder,TextEncoder,btoa,atob,Uint8Array,ArrayBuffer};
vm.runInNewContext(mapi+"\n"+tnef+"\n globalThis.__decodeTNEF=decodeTNEF;",sandbox);
const decode = sandbox.__decodeTNEF;
function attribute(level,name,type,value) {
 const data = Buffer.from(value);
 const header = Buffer.alloc(9);
 header[0]=level;header.writeUInt16LE(name,1);header.writeUInt16LE(type,3);
 header.writeUInt32LE(data.length,5);
 const ck=Buffer.alloc(2);
 ck.writeUInt16LE([...data].reduce((sum,x)=>(sum+x)&65535,0));
 return Buffer.concat([header,data,ck]);
}
const sig = Buffer.from([0x78,0x9f,0x3e,0x22,0,0]);
function specimen(files) {
 const parts = [sig];
 for (const {name,data} of files) {
  parts.push(attribute(2,0x9002,0x0006,Buffer.alloc(14))); // ATTACH_REND_DATA
  parts.push(attribute(2,0x8010,0x0001,Buffer.from(name+"\0","latin1"))); // ATTACH_TITLE
  parts.push(attribute(2,0x800f,0x0006,Buffer.from(data))); // ATTACH_DATA
 }
 return Buffer.concat(parts);
}
const fixtures = [
 {name:"plain-text",attachments:[{name:"notes.txt",data:Buffer.from("Hello Outlook TNEF!")}]},
 {name:"binary",attachments:[{name:"document.pdf",data:Buffer.from("%PDF-1.5\nsynthetic\n%%EOF\n")}]},
 {name:"multiple",attachments:[{name:"first.txt",data:Buffer.from("one")},{name:"second.txt",data:Buffer.from("two")}]},
 {name:"zero-length",attachments:[{name:"empty.txt",data:Buffer.alloc(0)}]},
 {name:"long-name",attachments:[{name:"x".repeat(140)+".txt",data:Buffer.from("filename")}]}
];
let ok = 0;
for (const fixture of fixtures) {
 const encoded = specimen(fixture.attachments);
 const decoded = decode(new Uint8Array(encoded));
 assert.ok(Array.isArray(decoded),"decoder must return an array");
 const expected = fixture.attachments;
 assert.equal(decoded.length,expected.length,fixture.name+": number of attachments");
 for (let i=0;i<expected.length;i++) {
  assert.equal(decoded[i].name,expected[i].name,fixture.name+": filename");
  assert.deepEqual(Buffer.from(decoded[i].dataBase64,"base64"),expected[i].data,fixture.name+": bytes");
 }
 console.log("PASS "+fixture.name+": "+decoded.length+" attachment(s)");
 ok++;
}
for (const [label,data] of [
 ["not-tnef",Buffer.from("this is not TNEF")],
 ["empty",Buffer.alloc(0)],
 ["truncated",sig.subarray(0,3)]
]) {
 const files=decode(new Uint8Array(data));
 assert.equal(files.length,0,label+": must not emit attachments");
 console.log("PASS "+label+": reject non-TNEF");
 ok++;
}

const valid=specimen([{name:"safe.txt",data:Buffer.from("CHECKSUM") }]);
const corrupt=Buffer.from(valid);corrupt[corrupt.length-1]^=0x40;
assert.equal(decode(new Uint8Array(corrupt)).length,0,"Wrong TNEF checksum must never produce a partial attachment");
console.log("PASS checksum-corrupt: no attachments emitted");ok++;
const truncated=valid.subarray(0,valid.length-1);
assert.equal(decode(new Uint8Array(truncated)).length,0,"Truncated TNEF data must never produce an attachment");
console.log("PASS truncation: no attachments emitted");ok++;
const cmsEnvelope=Buffer.from("MIME-Version: 1.0\r\nContent-Type: application/pkcs7-mime; smime-type=enveloped-data\r\n\r\nfake-encrypted-mail");
assert.equal(decode(new Uint8Array(cmsEnvelope)).length,0,"S/MIME is not TNEF");
console.log("PASS smime-envelope-is-not-TNEF");ok++;
console.log("PASS "+ok+" fixture categories");

