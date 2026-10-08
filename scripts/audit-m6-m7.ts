import { chromium } from "playwright";
import path from "path";

const EVIDENCE_DIR = "C:\\Users\\kusha\\.gemini\\antigravity\\brain\\ba60992d-6c75-474d-b218-7f2bf1a40b09\\evidence\\m6_m7";

async function runMilestone6And7Audit() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "mobile_390px", width: 390, height: 844 },
    { name: "tablet_820px", width: 820, height: 1180 },
    { name: "desktop_1440px", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    // 1. Perspective Prep (/prep)
    const ctxPrep = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const pagePrep = await ctxPrep.newPage();
    await pagePrep.goto("http://127.0.0.1:8080/prep");
    await pagePrep.waitForTimeout(300);
    await pagePrep.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_prep.png`),
      fullPage: true,
    });
    await ctxPrep.close();

    // 2. Methodology (/methodology)
    const ctxMeth = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const pageMeth = await ctxMeth.newPage();
    await pageMeth.goto("http://127.0.0.1:8080/methodology");
    await pageMeth.waitForTimeout(300);
    await pageMeth.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_methodology.png`),
      fullPage: true,
    });
    await ctxMeth.close();

    // 3. Takedown & Right of Reply (/takedown)
    const ctxTake = await browser.newContext({ viewport: { width: vp.width, height: vp.height } });
    const pageTake = await ctxTake.newPage();
    await pageTake.goto("http://127.0.0.1:8080/takedown");
    await pageTake.waitForTimeout(300);
    await pageTake.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_takedown.png`),
      fullPage: true,
    });
    await ctxTake.close();
  }

  await browser.close();
  console.log("Milestone 6 and 7 visual audit completed successfully.");
}

runMilestone6And7Audit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
