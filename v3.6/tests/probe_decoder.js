"use strict";
const fs=require("node:fs"),vm=require("node:vm");
const content=fs.readFileSync("/tmp/lookout-check/tnef_decoder.js","utf8");
const backend=fs.readFileSync("/tmp/lookout-check/background.js","utf8");
const funcs=[...content.matchAll(/(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(/g)].map(m=>m[1]);
const classes=[...content.matchAll(/class\s+([A-Za-z_$][\w$]*)/g)].map(m=>m[1]);
const consts=[...content.matchAll(/(?:const|let)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>)/g)].map(m=>m[1]);
const invoked=[...backend.matchAll(/\b(?:tnef_[a-zA-Z_]+|Tnef\w+|TNEF\w+)\b/g)].map(m=>m[0]);
const ops=[...backend.matchAll(/browser\.(?:messages|messageDisplay)\.[a-zA-Z]+/g)].map(m=>m[0]);
console.log("Decoder functions:",JSON.stringify(funcs));
console.log("Decoder classes:",JSON.stringify(classes));
console.log("Decoder const functions:",JSON.stringify(consts));
console.log("Decoder names used by background:",JSON.stringify([...new Set(invoked)]));
console.log("Thunderbird API calls:",JSON.stringify([...new Set(ops)]));
for(const term of ["parseTnef","tnef_parse","tnef_decode","msg_header","tnef_file","messageDisplay.onMessageDisplayed","deleteMessages","messages.delete","messages.import"]){
 const i=backend.indexOf(term);if(i>=0) console.log("BACKGROUND CONTEXT "+term+": "+backend.slice(Math.max(0,i-350),i+900).replace(/\n/g," "));
}
for(const term of ["function tnef_","function parse","function decode","return attachments"]){
 const i=content.indexOf(term);if(i>=0)console.log("DECODER CONTEXT "+term+": "+content.slice(Math.max(0,i-90),i+1200).replace(/\n/g," "));
}


for(const term of ["function decodeTNEF(", "function tnef_pack_parse_stream(", "function TnefPackage(", "function tnef_pack_read_object(", "function tnef_file_notify(", "function tnef_attr_read(", "function TnefAttr(", "async function performCompleteConversion(", "async function convert", "async function process", "function build", "async function replace"]){
 for(const [label,str] of [["decoder",content],["backend",backend]]){
  const i=str.indexOf(term);if(i>=0)console.log("INSPECT "+label+" "+term+" :: "+str.slice(i,i+2900).replace(/\n/g," "));
 }
}


for(const term of ["function tnef_pack_parse_stream(", "function tnef_file_notify(", "function tnef_file_munge_fname(", "function tnef_file_add_attr("]){
 const i=content.indexOf(term);
 if(i>=0) console.log("FULL SOURCE "+term+": "+content.slice(i,i+5500).replace(/\\n/g," "));
}
