/* LookOut-Mily 3.6 - solo se consultan metadatos de la versión, nunca contenido de correos. */
"use strict";
(() => {
  const FEED = "https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/main/updates.json";
  const RELEASES = "https://github.com/LORDMANUEL/LookOut-Mily/releases";
  const EXTENSION_ID = "lookout-modern@addons.thunderbird.net";
  const KEY = "lookoutMilyUpdate";
  const ALARM = "lookoutMilyCheck";
  const PERIOD = 12 * 60 * 60 * 1000;
  const NOTICE_ID = "lookout-mily-github-update";
  let inFlight = null;
  function versionParts(v) {
    const normalized = String(v || "").trim().replace(/esr$/i, "");
    if (!/^\d+(?:\.\d+){1,3}$/.test(normalized)) return null;
    return normalized.split(".").map(Number);
  }
  function compareVersions(a,b) {
    const x = versionParts(a), y = versionParts(b);
    if (!x || !y) return 0;
    for (let i=0;i<Math.max(x.length,y.length);i++) {
      const n = (x[i] || 0) - (y[i] || 0);
      if (n) return n < 0 ? -1 : 1;
    }
    return 0;
  }
  async function getStatus() {
    const s = await browser.storage.local.get(KEY);
    return s[KEY] || {available:false, latestVersion:browser.runtime.getManifest().version, checkedAt:0};
  }
  async function getBrowserVersion() {
    try { return typeof browser.runtime.getBrowserInfo === "function"
      ? (await browser.runtime.getBrowserInfo()).version : null; }
    catch (_) { return null; }
  }
  async function openReleases() { await browser.tabs.create({url:RELEASES}); }
  async function notifyIfNew(state, previous) {
    if (!state.available || previous?.notifiedVersion === state.latestVersion) return;
    state.notifiedVersion = state.latestVersion;
    try {
      if (browser.notifications?.create) await browser.notifications.create(NOTICE_ID, {
        type:"basic", title:"LookOut-Mily " + state.latestVersion + " disponible",
        message:"Hay una nueva versión en GitHub. Abre el complemento para revisar la actualización.",
        iconUrl:browser.runtime.getURL("icons/milydat.svg")
      });
    } catch (e) { console.warn("[LookOut Updates] Notification:", e); }
  }
  async function check(force=false) {
    if (inFlight) return inFlight;
    inFlight = (async () => {
      const previous = await getStatus();
      if (!force && Date.now() - (previous.checkedAt || 0) < PERIOD) return previous;
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 12000);
      try {
        const response = await fetch(FEED, {cache:"no-store", signal:controller.signal, credentials:"omit"});
        if (!response.ok) throw new Error("GitHub HTTP " + response.status);
        const feed = await response.json();
        const versions = feed?.addons?.[EXTENSION_ID]?.updates;
        if (!Array.isArray(versions)) throw new Error("Manifiesto de actualización inválido");
        const local = browser.runtime.getManifest().version;
        const tb = await getBrowserVersion();
        const compatible = versions.filter(x =>
          versionParts(x?.version) &&
          typeof x?.update_link === "string" &&
          x.update_link.startsWith("https://raw.githubusercontent.com/LORDMANUEL/LookOut-Mily/") &&
          (!tb || !x.browser_specific_settings?.gecko?.strict_min_version ||
            compareVersions(tb, x.browser_specific_settings.gecko.strict_min_version) >= 0)
        );
        compatible.sort((a,b) => compareVersions(b.version,a.version));
        const latest = compatible[0]?.version || local;
        const state = {
          available:compareVersions(latest,local) > 0, latestVersion:latest,
          checkedAt:Date.now(), notifiedVersion:previous.notifiedVersion || "",
          error:null
        };
        await notifyIfNew(state,previous);
        await browser.storage.local.set({[KEY]:state});
        return state;
      } catch (error) {
        const state = {...previous,checkedAt:Date.now(),error:String(error.message || error).slice(0,140)};
        await browser.storage.local.set({[KEY]:state});
        return state;
      } finally { clearTimeout(timeout); }
    })();
    try { return await inFlight; } finally { inFlight = null; }
  }
  browser.runtime.onMessage.addListener(message => {
    if (message?.action === "lookoutGetUpdateStatus") return getStatus();
    if (message?.action === "lookoutCheckUpdates") return check(true);
    if (message?.action === "lookoutOpenReleases") return openReleases().then(()=>({ok:true}));
    return undefined;
  });
  if (browser.notifications?.onClicked) browser.notifications.onClicked.addListener(
    id => { if (id === NOTICE_ID) openReleases().catch(console.warn); }
  );
  if (browser.alarms?.onAlarm) {
    browser.alarms.onAlarm.addListener(a => { if (a.name === ALARM) check().catch(console.warn); });
    browser.alarms.create(ALARM,{periodInMinutes:720});
  }
  setTimeout(()=>check().catch(console.warn),3500);
})();
