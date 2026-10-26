import assert from "node:assert/strict";
import fs from "node:fs";
import { chromium } from "playwright";

const base = "http://127.0.0.1:8765/";
const release = "https://github.com/LORDMANUEL/LookOut-Mily/releases/download/v3.6.0/lookout-mily-3.6.0.xpi";
fs.mkdirSync("site-review", { recursive: true });
const browser = await chromium.launch({ headless: true });
let problems = [];
for (const width of [1440, 1024, 768, 390, 360]) {
  const context = await browser.newContext({viewport:{width,height:900},deviceScaleFactor:1, reducedMotion:"reduce"});
  const page = await context.newPage();
  const errors = [];
  page.on("pageerror",e=>errors.push(String(e)));
  const resp = await page.goto(base,{waitUntil:"networkidle"});
  assert.equal(resp.status(),200,"site HTTP " + width);
  assert.equal(await page.locator("h1").count(),1,"single h1 " + width);
  assert.match(await page.title(),/3\.6\.0/);
  assert.ok((await page.locator("body").innerText()).includes("3.6.0"),"3.6 visible " + width);
  assert.equal(await page.locator('a[href="'+ release +'"]').count(),2,"3.6.0 download links");
  const scroll = await page.evaluate(() => ({ width: document.documentElement.scrollWidth, viewport: innerWidth }));
  if (scroll.width > scroll.viewport + 1) problems.push("Horizontal overflow " + width + ": " + JSON.stringify(scroll));
  const broken = await page.locator('a[href^="#"]').evaluateAll(els => els.filter(a => !document.getElementById(a.getAttribute("href").slice(1))).map(a=>a.getAttribute("href")));
  assert.deepEqual(broken,[],"no broken local anchors " + width);
  for(const err of errors) problems.push("JS error " + width + ": " + err);
  await page.screenshot({path:"site-review/home-" + width + ".png",fullPage:true});
  if (width===390) {
    await page.locator(".mobile-menu summary").click();
    assert.equal(await page.getByRole("navigation",{name:"Navegación móvil"}).isVisible(),true,"mobile nav opens");
    const faq = page.locator(".faq-list details").first();
    await faq.locator("summary").click();
    assert.equal(await faq.getAttribute("open"),"","FAQ opens");
  }
  await context.close();
  console.log("PASS viewport " + width + ": status " + resp.status() + ", no broken anchors, screenshot");
}
await browser.close();
assert.deepEqual(problems,[],"Website browser issues: " + problems.join("; "));
console.log("PASS LookOut-Mily website 3.6 public cross-device smoke tests");
