import { chromium } from "playwright";
import fs from "node:fs";

const outDir = ".impeccable/review";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
page.on("console", (msg) => {
  if (msg.type() === "error") console.log("[console error]", msg.text());
});
page.on("pageerror", (err) => console.log("[page error]", err.message));

await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
await page.waitForTimeout(900);

// --- Create ---
await page.getByRole("button", { name: "New Deal" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/crud-create-empty.png` });

await page.getByPlaceholder("e.g. Cloud Migration — Acme Corp").fill("Managed Services — Test Co");
await page.getByPlaceholder("Client company name").fill("Test Co Pvt Ltd");
const valueInput = page.locator('input[type="number"]').first();
await valueInput.fill("125000");
await page.getByPlaceholder("e.g. Schedule discovery call").fill("Kick off onboarding call");
await page.screenshot({ path: `${outDir}/crud-create-filled.png` });

await page.getByRole("button", { name: "Create deal" }).click();
await page.waitForTimeout(500);
await page.screenshot({ path: `${outDir}/crud-after-create.png`, fullPage: true });

// Find the new row and open it
const newRow = page.locator("tr", { hasText: "Test Co Pvt Ltd" }).first();
await newRow.scrollIntoViewIfNeeded();
await page.waitForTimeout(200);
await page.screenshot({ path: `${outDir}/crud-new-row.png` });
await newRow.click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/crud-view-new.png` });

// --- Edit ---
await page.getByRole("button", { name: "Edit" }).click();
await page.waitForTimeout(300);
const nameInput = page.getByPlaceholder("e.g. Cloud Migration — Acme Corp");
await nameInput.fill("Managed Services — Test Co (Renewed)");
await page.getByRole("button", { name: "Save changes" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/crud-after-edit.png` });

// --- Delete ---
await page.getByRole("button", { name: "Edit" }).click();
await page.waitForTimeout(300);
await page.getByRole("button", { name: "Delete deal" }).click();
await page.waitForTimeout(200);
await page.screenshot({ path: `${outDir}/crud-delete-confirm.png` });
await page.getByRole("button", { name: "Confirm delete" }).click();
await page.waitForTimeout(400);
await page.screenshot({ path: `${outDir}/crud-after-delete.png`, fullPage: true });

await page.close();
await browser.close();
console.log("done: crud test");
