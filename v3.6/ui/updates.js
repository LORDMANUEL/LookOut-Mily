/* UI de actualizaciones, separada del convertidor TNEF. */
"use strict";
(() => {
  const get = id => document.getElementById(id);
  async function send(action) { return browser.runtime.sendMessage({action}); }
  function render(result) {
    const card = get("update-card");
    if (!card) return;
    const available = !!result?.available;
    card.hidden = document.body.classList.contains("lm-popup") && !available;
    card.dataset.state = available ? "available" : result?.error ? "error" : "current";
    get("update-title").textContent = available ? "Hay una actualización disponible" : "Actualizaciones desde GitHub";
    get("update-status").textContent = available
      ? "Versión " + result.latestVersion + " disponible. Tienes " + browser.runtime.getManifest().version + "."
      : result?.error ? "No se pudo comprobar: " + result.error
      : "Tu versión está al día. La comprobación se realiza en segundo plano.";
    get("btn-open-release").hidden = !available;
    get("btn-check-update").disabled = false;
  }
  async function refresh(force) {
    const button = get("btn-check-update");
    if (button) button.disabled = true;
    try {
      const r = await send(force ? "lookoutCheckUpdates" : "lookoutGetUpdateStatus");
      render(r || {error:"Servicio no disponible"});
    } catch(e) { render({error:e.message || "Error de conexión"}); }
  }
  document.addEventListener("DOMContentLoaded", () => {
    if (!get("update-card")) return;
    get("btn-check-update")?.addEventListener("click", () => refresh(true));
    get("btn-open-release")?.addEventListener("click", () => send("lookoutOpenReleases"));
    refresh(false);
  });
})();
