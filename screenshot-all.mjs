import { chromium } from "playwright";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dir = path.join(__dirname, "debug-screenshots");

const API = "http://localhost:5000";
const APP = "http://localhost:3000";

async function login(context, email, password) {
    const res = await context.request.post(`${API}/api/auth/login`, {
        data: { email, password }
    });
    const data = await res.json();
    return data;
}

const publicPages = [
    { name: "user-login", url: `${APP}/user-panel/login` },
    { name: "user-register", url: `${APP}/user-panel/register` },
    { name: "admin-login", url: `${APP}/admin/login` },
    { name: "forgot-password", url: `${APP}/forgot-password` },
    { name: "consultation-request", url: `${APP}/consultation-request` },
    { name: "preview-invalid", url: `${APP}/preview/invalid-token-test` },
];

const adminPages = [
    { name: "admin-dashboard", url: `${APP}/dashboard` },
    { name: "admin-room-setup", url: `${APP}/admin/room-setup` },
    { name: "admin-catalogue", url: `${APP}/admin/catalogue` },
    { name: "admin-catalogue-management", url: `${APP}/admin/catalogue-management` },
    { name: "admin-compare-designs", url: `${APP}/admin/compare-designs` },
    { name: "admin-cost-summary", url: `${APP}/admin/cost-summary` },
    { name: "admin-consultations", url: `${APP}/admin/consultations` },
    { name: "admin-settings", url: `${APP}/admin/settings` },
];

const userPages = [
    { name: "user-furniture-catalogue", url: `${APP}/user-panel/furniture-catalogue` },
    { name: "user-review-ratings", url: `${APP}/user-panel/review-and-ratings` },
    { name: "user-wishlist", url: `${APP}/user-panel/wishlist` },
    { name: "user-my-account", url: `${APP}/user-panel/my-account` },
];

async function screenshotPages(context, pages, label) {
    for (const p of pages) {
        const page = await context.newPage();
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        page.on("console", (msg) => {
            if (msg.type() === "error") errors.push(msg.text());
        });
        try {
            await page.goto(p.url, { waitUntil: "networkidle", timeout: 20000 });
            await page.waitForTimeout(2500);
        } catch (e) {
            console.log(`TIMEOUT: ${p.name} - ${e.message.substring(0, 80)}`);
        }
        await page.screenshot({ path: path.join(dir, `${p.name}.png`), fullPage: true });
        if (errors.length) {
            console.log(`ERRORS [${label}] ${p.name}:`, errors.slice(0, 2).join(" | ").substring(0, 120));
        } else {
            console.log(`OK [${label}] ${p.name}`);
        }
        await page.close();
    }
}

(async () => {
    const browser = await chromium.launch();

    console.log("--- PUBLIC PAGES ---");
    const pubCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await screenshotPages(pubCtx, publicPages, "public");
    await pubCtx.close();

    console.log("\n--- ADMIN PAGES ---");
    const adminCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const adminData = await login(adminCtx, "admin@livora.com", "Admin@123");
    console.log(`Admin login: ${adminData.name} (${adminData.role})`);
    for (const p of adminPages) {
        const page = await adminCtx.newPage();
        await page.goto(`${APP}/admin/login`, { waitUntil: "networkidle", timeout: 10000 }).catch(() => {});
        await page.evaluate((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ id: data._id, name: data.name, email: data.email, role: data.role }));
        }, adminData);
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        try {
            await page.goto(p.url, { waitUntil: "networkidle", timeout: 20000 });
            await page.waitForTimeout(2500);
        } catch (e) {
            console.log(`TIMEOUT: ${p.name}`);
        }
        await page.screenshot({ path: path.join(dir, `${p.name}.png`), fullPage: true });
        if (errors.length) {
            console.log(`ERRORS [admin] ${p.name}:`, errors.slice(0, 2).join(" | ").substring(0, 120));
        } else {
            console.log(`OK [admin] ${p.name}`);
        }
        await page.close();
    }
    await adminCtx.close();

    console.log("\n--- USER PAGES ---");
    const userCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const userData = await login(userCtx, "roshan@example.com", "User@123");
    console.log(`User login: ${userData.name} (${userData.role})`);
    for (const p of userPages) {
        const page = await userCtx.newPage();
        await page.goto(`${APP}/user-panel/login`, { waitUntil: "networkidle", timeout: 10000 }).catch(() => {});
        await page.evaluate((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ id: data._id, name: data.name, email: data.email, role: data.role }));
        }, userData);
        const errors = [];
        page.on("pageerror", (e) => errors.push(e.message));
        try {
            await page.goto(p.url, { waitUntil: "networkidle", timeout: 20000 });
            await page.waitForTimeout(2500);
        } catch (e) {
            console.log(`TIMEOUT: ${p.name}`);
        }
        await page.screenshot({ path: path.join(dir, `${p.name}.png`), fullPage: true });
        if (errors.length) {
            console.log(`ERRORS [user] ${p.name}:`, errors.slice(0, 2).join(" | ").substring(0, 120));
        } else {
            console.log(`OK [user] ${p.name}`);
        }
        await page.close();
    }

    // Also screenshot a product details page
    const productRes = await userCtx.request.get(`${API}/api/products?limit=1`);
    const productData = await productRes.json();
    if (productData.products && productData.products.length > 0) {
        const pid = productData.products[0]._id;
        const page = await userCtx.newPage();
        await page.goto(`${APP}/user-panel/login`, { waitUntil: "networkidle", timeout: 10000 }).catch(() => {});
        await page.evaluate((data) => {
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify({ id: data._id, name: data.name, email: data.email, role: data.role }));
        }, userData);
        try {
            await page.goto(`${APP}/user-panel/furniture-details/${pid}`, { waitUntil: "networkidle", timeout: 20000 });
            await page.waitForTimeout(2500);
        } catch (e) {
            console.log(`TIMEOUT: product-details`);
        }
        await page.screenshot({ path: path.join(dir, `user-product-details.png`), fullPage: true });
        console.log(`OK [user] product-details (${productData.products[0].name})`);
        await page.close();
    }

    await userCtx.close();

    // Screenshot the public preview page using a design with a share token
    console.log("\n--- PUBLIC PREVIEW ---");
    const previewCtx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    try {
        const designsRes = await previewCtx.request.get(`${API}/api/designs`);
        const designsData = await designsRes.json();
        const sharedDesign = designsData.data?.find(d => d.shareToken);
        if (sharedDesign) {
            const previewPage = await previewCtx.newPage();
            try {
                await previewPage.goto(`${APP}/preview/${sharedDesign.shareToken}`, { waitUntil: "networkidle", timeout: 20000 });
                await previewPage.waitForTimeout(3000);
            } catch (e) {
                console.log(`TIMEOUT: preview-page`);
            }
            await previewPage.screenshot({ path: path.join(dir, `preview-shared-design.png`), fullPage: true });
            console.log(`OK [public] preview-shared-design (${sharedDesign.name})`);
            await previewPage.close();
        } else {
            console.log("SKIP: No design with shareToken found");
        }
    } catch (e) {
        console.log(`ERROR: preview - ${e.message.substring(0, 80)}`);
    }
    await previewCtx.close();

    await browser.close();
    console.log("\nDone!");
})();
