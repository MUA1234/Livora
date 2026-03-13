import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "debug-screenshots");

const pages = [
  { name: "admin-dashboard", url: "http://localhost:3000/dashboard" },
  { name: "admin-room-setup", url: "http://localhost:3000/admin/room-setup" },
  { name: "admin-catalogue", url: "http://localhost:3000/admin/catalogue" },
  { name: "admin-catalogue-management", url: "http://localhost:3000/admin/catalogue-management" },
  { name: "admin-compare-designs", url: "http://localhost:3000/admin/compare-designs" },
  { name: "admin-cost-summary", url: "http://localhost:3000/admin/cost-summary" },
  { name: "admin-consultations", url: "http://localhost:3000/admin/consultations" },
  { name: "admin-design-history", url: "http://localhost:3000/admin/design-history" },
  { name: "admin-settings", url: "http://localhost:3000/admin/settings" },
  { name: "admin-2d-layout", url: "http://localhost:3000/admin/2d-layout" },
  { name: "admin-3d-view", url: "http://localhost:3000/admin/3d-view" },
  { name: "admin-3d-visualization", url: "http://localhost:3000/admin/3d-visualization" },
  { name: "admin-login", url: "http://localhost:3000/admin/login" },
];

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

  for (const p of pages) {
    const page = await context.newPage();
    const errors = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text());
    });

    try {
      await page.goto(p.url, { waitUntil: "networkidle", timeout: 15000 });
      await page.waitForTimeout(2000);
    } catch (e) {
      console.log(`TIMEOUT: ${p.name} - ${e.message}`);
    }

    await page.screenshot({ path: path.join(dir, `${p.name}.png`), fullPage: true });
    if (errors.length) {
      console.log(`ERRORS on ${p.name}:`, errors.slice(0, 2).join(" | "));
    } else {
      console.log(`OK: ${p.name}`);
    }
    await page.close();
  }

  await browser.close();
  console.log("Done!");
})();
