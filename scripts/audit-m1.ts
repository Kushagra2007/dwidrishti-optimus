import { chromium } from "playwright";
import path from "path";

const EVIDENCE_DIR = "C:\\Users\\kusha\\.gemini\\antigravity\\brain\\ba60992d-6c75-474d-b218-7f2bf1a40b09\\evidence\\m1";

async function runMilestone1Audit() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "mobile_390px", width: 390, height: 844 },
    { name: "tablet_820px", width: 820, height: 1180 },
    { name: "desktop_1440px", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    // 1. First visit (Shows language gate modal)
    const contextGate = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "light",
    });
    const pageGate = await contextGate.newPage();
    await pageGate.goto("http://127.0.0.1:8080");
    await pageGate.waitForTimeout(400);
    await pageGate.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_language_gate.png`),
      fullPage: true,
    });
    // Click confirm to enter platform
    const confirmBtn = pageGate.locator("button", { hasText: "Confirm & Enter Platform" });
    if (await confirmBtn.isVisible()) {
      await confirmBtn.click();
      await pageGate.waitForTimeout(500);
    }
    // Screenshot Light Theme English
    await pageGate.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_light_en.png`),
      fullPage: true,
    });
    await contextGate.close();

    // 2. Hindi & Dark Theme
    const contextDark = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "dark",
    });
    const pageDark = await contextDark.newPage();
    await pageDark.goto("http://127.0.0.1:8080");
    await pageDark.waitForTimeout(300);

    // Select Hindi in the gate
    const hiTile = pageDark.locator("button", { hasText: "हिन्दी" });
    if (await hiTile.isVisible()) {
      await hiTile.click();
      const confirmDark = pageDark.locator("button", { hasText: "Confirm & Enter Platform" });
      await confirmDark.click();
      await pageDark.waitForTimeout(400);
    }

    // Toggle theme to dark via theme button
    const thBtn = pageDark.locator("header button[aria-label='Toggle theme']");
    if (await thBtn.isVisible()) {
      await thBtn.click();
      await pageDark.waitForTimeout(300);
    }

    await pageDark.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_dark_hi.png`),
      fullPage: true,
    });
    await contextDark.close();
  }

  await browser.close();
  console.log("Milestone 1 visual audit completed successfully.");
}

runMilestone1Audit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
