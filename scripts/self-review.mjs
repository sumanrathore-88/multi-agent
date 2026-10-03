import { chromium } from "playwright";
import fs from "node:fs";

const outDir = ".impeccable/review";
fs.mkdirSync(outDir, { recursive: true });
const SITE = "https://sumanrathore-88.github.io/multi-agent/";
const issues = [];

const browser = await chromium.launch();

async function withPage(fn) {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => { if (m.type() === "error") errors.push(m.text()); });
  await fn(page, errors);
  if (errors.length) issues.push(`Console/page errors: ${errors.join(" | ")}`);
  await page.close();
}

// 1. Desktop full page
await withPage(async (page) => {
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.screenshot({ path: `${outDir}/sr-desktop.png`, fullPage: true });
});

// 2. Tablet full page
await withPage(async (page) => {
  await page.setViewportSize({ width: 834, height: 1194 });
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.addStyleTag({ content: "header { position: static !important; }" });
  await page.screenshot({ path: `${outDir}/sr-tablet.png`, fullPage: true });
});

// 3. Filters: region filter to Bengaluru, check table updates
await withPage(async (page) => {
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.getByText("Region: All Regions").click();
  await page.getByText("Bengaluru", { exact: true }).click();
  await page.waitForTimeout(400);
  const count = await page.locator("table tbody tr").count();
  if (count === 0) issues.push("Region filter to Bengaluru produced 0 rows unexpectedly");
  const clientCells = await page.locator("table tbody tr td:nth-child(2)").allTextContents();
  // sanity: table should only show Bengaluru-owned deals; spot-check via owner column instead since client doesn't show region
  await page.screenshot({ path: `${outDir}/sr-region-filter.png`, fullPage: true });
});

// 4. Stage click -> filter sync, then clear
await withPage(async (page) => {
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.getByText("Qualified", { exact: true }).first().click();
  await page.waitForTimeout(400);
  const stageVal = await page.getByText(/^Stage: /).textContent();
  if (!stageVal?.includes("Qualified")) issues.push(`Stage click didn't sync filter: got "${stageVal}"`);
  await page.getByText("Clear filters").click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/sr-stage-clear.png` });
});

// 5. Full CRUD cycle against live Indian data
await withPage(async (page) => {
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const before = await page.locator("table tbody tr").count();

  await page.getByRole("button", { name: "New Deal" }).click();
  await page.waitForTimeout(300);
  await page.getByPlaceholder("e.g. Cloud Migration — Acme Corp").fill("AI Implementation — Self Review Co");
  await page.getByPlaceholder("Client company name").fill("Self Review Co");
  await page.locator('input[type="number"]').first().fill("50000");
  await page.getByRole("button", { name: "Create deal" }).click();
  await page.waitForTimeout(400);

  const afterCreate = await page.locator("table tbody tr").count();
  if (afterCreate !== before + 1) issues.push(`Create: expected ${before + 1} rows, got ${afterCreate}`);

  const row = page.locator("tr", { hasText: "Self Review Co" }).first();
  await row.scrollIntoViewIfNeeded();
  await row.click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Edit" }).click();
  await page.waitForTimeout(300);
  await page.getByRole("button", { name: "Delete deal" }).click();
  await page.getByRole("button", { name: "Confirm delete" }).click();
  await page.waitForTimeout(400);

  const afterDelete = await page.locator("table tbody tr").count();
  if (afterDelete !== before) issues.push(`Delete: expected back to ${before} rows, got ${afterDelete}`);
});

// 6. Keyboard nav: tab to a table row, press Enter, drawer should open
await withPage(async (page) => {
  await page.goto(SITE, { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const firstRow = page.locator("table tbody tr").first();
  await firstRow.focus();
  await page.keyboard.press("Enter");
  await page.waitForTimeout(300);
  const drawerVisible = await page.getByRole("dialog").isVisible().catch(() => false);
  if (!drawerVisible) issues.push("Keyboard Enter on focused table row did not open the drawer");
  await page.screenshot({ path: `${outDir}/sr-keyboard-open.png` });
});

await browser.close();

fs.writeFileSync(`${outDir}/sr-issues.json`, JSON.stringify(issues, null, 2));
console.log("ISSUES:", JSON.stringify(issues, null, 2));
