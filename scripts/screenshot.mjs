import { chromium } from "playwright";
import fs from "node:fs";

const outDir = ".impeccable/review";
fs.mkdirSync(outDir, { recursive: true });

const browser = await chromium.launch();

async function shot(name, width, height, fullPage = true) {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  if (fullPage) {
    await page.addStyleTag({ content: "header { position: static !important; }" });
  }
  await page.screenshot({ path: `${outDir}/${name}.png`, fullPage });
  await page.close();
}

const mode = process.argv[2] || "full";

if (mode === "full") {
  await shot("desktop", 1440, 900, true);
  await shot("tablet", 834, 1194, true);
} else if (mode === "first") {
  await shot("desktop-first", 1440, 900, false);
} else if (mode === "profile") {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  await page.getByText("KS", { exact: true }).click();
  await page.waitForTimeout(300);
  await page.screenshot({ path: `${outDir}/profile-menu.png` });
  await page.close();
} else if (mode === "interact") {
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
  await page.waitForTimeout(900);
  const freezeHeader = () => page.addStyleTag({ content: "header { position: static !important; }" });

  await page.getByLabel("Notifications").click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/notif-error.png` });
  await page.getByText("Try again").click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: `${outDir}/notif-success.png` });
  await page.keyboard.press("Escape");

  await page.getByText("Negotiation", { exact: true }).first().click();
  await page.waitForTimeout(500);
  await freezeHeader();
  await page.screenshot({ path: `${outDir}/stage-selected.png`, fullPage: true });

  const firstRow = page.locator("table tbody tr").first();
  await firstRow.click();
  await page.waitForTimeout(500);
  await page.screenshot({ path: `${outDir}/deal-drawer.png` });

  await page.keyboard.press("Escape");
  await page.getByPlaceholder("Search deals or clients…").fill("zzzznomatch");
  await page.waitForTimeout(400);
  await page.screenshot({ path: `${outDir}/empty-state.png`, fullPage: true });

  await page.close();
}

await browser.close();
console.log("done:", mode);
