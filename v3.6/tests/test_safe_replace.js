"use strict";
/* Executes the real production replace function in isolation. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const { File } = require("node:buffer");
const code=fs.readFileSync("/tmp/lookout-check/background.js","utf8");
const start=code.indexOf("async function replaceMessageWithConvertedCopy(");
const end=code.indexOf("\nbrowser.tabs.onRemoved.addListener",start);
assert.ok(start>=0 && end>start,"Conversion handler exists");
const fragment=code.slice(start,end).trim();
const helperStart=code.indexOf("async function milyGetFullCompat(");
const helperEnd=code.indexOf("\\n}",helperStart)+2;
assert.ok(helperStart>0 && helperEnd>helperStart,"TB128 compatibility helper exists");
const compatibleHelper=code.slice(helperStart,helperEnd);

function makeHarness(root,converted) {
 let imported=0,deleted=0,read=0;
 const messenger={
  messages:{
   getFull:async()=>{read++;return root;},
   import:async()=>{imported++;return {id:400}},
   delete:async()=>{deleted++;throw new Error("Deleting original is forbidden")}
  },
  mailTabs:{setSelectedMessages:async()=>{}},
  messageDisplay:{open:async()=>({id:70})}
 };
 const logs=[];
 const ctx={
  messenger,browser:{notifications:{create:()=>{}},runtime:{getURL:x=>x,getBrowserInfo:async()=>({version:"158.0.1"})}},
  File,console,Number,
  logInfo:async(event)=>logs.push(event),logWarn:async(event)=>logs.push(event),
  describeTab:x=>x,describeMessage:x=>x,suppressNextDisplay:()=>{},
  suppressedDisplayByTab:new Map(),
  markMessageConverted:async()=>{},
  performCompleteConversion:async()=>converted
 };
 const func=vm.runInNewContext(compatibleHelper+"\\n("+fragment+")",ctx);
 const header={id:11,folder:{path:"/Inbox"},read:true,tags:[]};
 return {run:()=>func({id:5,windowId:1},header,[{partName:"1.2",name:"winmail.dat"}],{showNotif:false}),
  counts:()=>({imported,deleted,read}),logs};
}
const good={convertedBytes:new Uint8Array([65,66]),extracted:[{name:"a.txt",dataBase64:"QQ=="}],tnefEntries:[]};
(async()=>{
 for(const type of ["multipart/signed","multipart/encrypted","application/pkcs7-mime","application/x-pkcs7-mime","application/pkcs7-signature","application/pgp-encrypted"]){
  const h=makeHarness({contentType:"multipart/mixed",parts:[{contentType:type}]},good);
  await assert.rejects(h.run(),/firmado o cifrado/i,type);
  assert.equal(h.counts().imported,0,"Never import protected "+type);
  assert.equal(h.counts().deleted,0,"Never delete protected "+type);
  console.log("PASS protected "+type+": original intact");
 }
 const empty=makeHarness({contentType:"multipart/mixed",parts:[]},{convertedBytes:new Uint8Array([65]),extracted:[],tnefEntries:[]});
 await assert.rejects(empty.run(),/incompleta/i);
 assert.equal(empty.counts().imported,0);
 assert.equal(empty.counts().deleted,0);
 console.log("PASS empty extraction: no import/delete");
 const plain=makeHarness({contentType:"multipart/mixed",parts:[]},good);
 const result=await plain.run();
 assert.equal(result.imported.id,400);
 assert.equal(plain.counts().imported,1);
 assert.equal(plain.counts().deleted,0);
 assert.ok(plain.logs.includes("replace-preserved-original"));
 console.log("PASS successful conversion: new copy imported, original never deleted");
 console.log("PASS 8 protected/integrity conversion scenarios");
})().catch(e=>{console.error(e);process.exitCode=1});
