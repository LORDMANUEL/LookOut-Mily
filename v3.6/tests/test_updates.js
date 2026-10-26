/* Pruebas unitarias sin acceso a red, no envían datos del correo. */
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");
const code = fs.readFileSync(path.resolve(__dirname,"../updates/background.js"),"utf8");
function feed(version, min="128.0", link="https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/lookout-mily-"+version+".xpi"){
  return {addons:{"lookout-modern@addons.thunderbird.net":{updates:[{
    version,update_link:link,browser_specific_settings:{gecko:{strict_min_version:min}}
  }]}}};
}
function harness({current="3.6.0",tb="158.0.1",body=feed("3.6.1"),fail=false}={}){
 let messageHandler, notices=[],tabs=[],calls=0, storage={}, alarm;
 const browser={
  runtime:{getManifest:()=>({version:current}),getBrowserInfo:async()=>({version:tb}),
    getURL:p=>"moz-extension://local/"+p,onMessage:{addListener:f=>messageHandler=f}},
  storage:{local:{get:async k=>({[k]:storage[k]}),set:async obj=>Object.assign(storage,obj)}},
  tabs:{create:async o=>tabs.push(o)},
  notifications:{create:async(id,payload)=>notices.push({id,payload}),onClicked:{addListener:()=>{}}},
  alarms:{create:()=>{},onAlarm:{addListener:f=>alarm=f}}
 };
 const context={browser,fetch:async()=>{calls++;if(fail)throw new Error("offline");return {ok:true,json:async()=>body}},
  AbortController,console,Date,setTimeout:()=>0,clearTimeout:()=>{}};
 vm.runInNewContext(code,context,{filename:"background.js"});
 return {send:action=>messageHandler({action}),notices,tabs,get calls(){return calls},storage};
}
(async()=>{
 let s=harness();
 let r=await s.send("lookoutCheckUpdates");
 assert.equal(r.available,true);assert.equal(r.latestVersion,"3.6.1");
 assert.equal(s.notices.length,1,"Notificar la nueva versión solo una vez");
 await s.send("lookoutCheckUpdates");
 assert.equal(s.notices.length,1,"No repetir notificación");
 await s.send("lookoutOpenReleases");
 assert.equal(s.tabs[0].url,"https://github.com/LORDMANUEL/LookOut-Mily/releases");

 s=harness({body:feed("3.6.0")});r=await s.send("lookoutCheckUpdates");
 assert.equal(r.available,false,"No avisar por la misma versión");

 s=harness({body:feed("3.6.10"),current:"3.6.9"});r=await s.send("lookoutCheckUpdates");
 assert.equal(r.available,true,"Ordenamiento semántico 3.6.10 > 3.6.9");

 s=harness({body:feed("3.6.1","159.0"),tb:"153.5.1esr"});r=await s.send("lookoutCheckUpdates");
 assert.equal(r.available,false,"No ofrecer actualización incompatible");

 s=harness({body:feed("9.0","128.0","https://evil.example/xpi")});r=await s.send("lookoutCheckUpdates");
 assert.equal(r.available,false,"Descartar origen no confiable");

 s=harness({fail:true});r=await s.send("lookoutCheckUpdates");
 assert.ok(r.error.includes("offline"),"Red fuera de línea no debe romper complemento");

 console.log("OK: 7 grupos de pruebas de actualización");
})().catch(e=>{console.error(e);process.exitCode=1});
