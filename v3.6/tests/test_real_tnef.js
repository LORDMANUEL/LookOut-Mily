"use strict";
const fs=require("node:fs"),path=require("node:path"),vm=require("node:vm"),assert=require("node:assert/strict");
const root="/tmp/lookout-check";
const code=fs.readFileSync(path.join(root,"mapi_props.js"),"utf8")+"\n"+fs.readFileSync(path.join(root,"tnef_decoder.js"),"utf8");
const sandbox={Buffer,TextDecoder,TextEncoder,btoa,atob,Uint8Array,ArrayBuffer,
  console:{log:()=>{},error:console.error,warn:console.warn}};
vm.runInNewContext(code+"\n globalThis.__fn=decodeTNEF;",sandbox);
const decode=sandbox.__fn;
const samples=[
 ["one-file.tnef",["AUTHORS"]],
 ["two-files.tnef",["AUTHORS","README"]],
 ["data-before-name.tnef",["AUTOEXEC.BAT","CONFIG.SYS","boot.ini"]],
 ["long-filename.tnef",["allproductsmar2000.dat"]],
 ["umlaut.tnef",["TBZ PARIV GmbH.jpg","image003.jpg","UmlautAnhang-äüö.txt"]],
 ["unicode-mapi-attr-name.tnef",["spaconsole2.cfg","image001.png","image002.png","image003.png"]],
 ["minimal_attachment.tnef",["unknown.dat"]]
];
let tests=0;const gaps=[];
for(const [name,expected] of samples){
 const data=fs.readFileSync(path.join(__dirname,"fixtures",name));
 let actual;
 try{ actual=decode(new Uint8Array(data)).map(f=>f.name); }
 catch(e){actual=[];gaps.push({name,error:String(e)});}
 console.log("REAL TNEF",name,"expected",JSON.stringify(expected),"actual",JSON.stringify(actual));
 if(expected.length===actual.length && expected.every(x=>actual.includes(x)))tests++;
 else gaps.push({name,expected,actual});
}
console.log("REAL FIXTURE MATCH:",tests+"/"+samples.length);
if(gaps.length){console.error("REAL FIXTURE REGRESSIONS:",JSON.stringify(gaps));process.exitCode=1}
