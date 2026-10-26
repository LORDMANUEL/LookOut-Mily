"use strict";
const fs=require("node:fs"),vm=require("node:vm"),assert=require("node:assert/strict");
const code=fs.readFileSync("/tmp/lookout-check/background.js","utf8");
const start=code.indexOf("async function milyGetFullCompat(");
const end=code.indexOf("\n}",start)+2;
assert.ok(start>0&&end>start);
const fragment=code.slice(start,end);
async function check(version,expected){
 let calls=[];
 const ctx={browser:{runtime:{getBrowserInfo:async()=>({version})}},
    messenger:{messages:{getFull:async(id,opts)=>{calls.push({id,opts});return {id}}}},
    console};
 const fn=vm.runInNewContext(fragment+"\n milyGetFullCompat",ctx);
 await fn(12,false);assert.equal(calls.length,1);assert.equal(calls[0].id,12);
 assert.equal(calls[0].opts.decrypt,false);
 assert.equal(Object.hasOwn(calls[0].opts,"decodeContent"),expected,version+": support decodeContent");
 assert.equal(Object.hasOwn(calls[0].opts,"decodeHeaders"),expected,version+": support decodeHeaders");
 console.log("PASS Thunderbird "+version+" message API options");
}
(async()=>{await check("128.14.0esr",false);
 await check("140.7.0esr",true);
 await check("153.5.1esr",true);
 await check("158.0.1",true);
 console.log("PASS four Thunderbird API compatibility profiles");
})().catch(e=>{console.error(e);process.exitCode=1});
