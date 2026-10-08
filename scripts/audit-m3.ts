import { chromium } from "playwright";
import path from "path";

const EVIDENCE_DIR = "C:\\Users\\kusha\\.gemini\\antigravity\\brain\\ba60992d-6c75-474d-b218-7f2bf1a40b09\\evidence\\m3";

async function runMilestone3Audit() {
  const browser = await chromium.launch({ headless: true });

  const viewports = [
    { name: "mobile_390px", width: 390, height: 844 },
    { name: "tablet_820px", width: 820, height: 1180 },
    { name: "desktop_1440px", width: 1440, height: 900 },
  ];

  for (const vp of viewports) {
    // 1. Light Theme English on /admin/clusters
    const contextLight = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "light",
    });
    const pageLight = await contextLight.newPage();
    await pageLight.goto("http://127.0.0.1:8080/admin/clusters");
    await pageLight.waitForTimeout(400);
    await pageLight.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_light_en_clusters.png`),
      fullPage: true,
    });
    await contextLight.close();

    // 2. Dark Theme Hindi on /admin/clusters
    const contextDark = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      colorScheme: "dark",
    });
    const pageDark = await contextDark.newPage();
    await pageDark.goto("http://127.0.0.1:8080/admin/clusters");
    await pageDark.waitForTimeout(400);
    await pageDark.screenshot({
      path: path.join(EVIDENCE_DIR, `${vp.name}_dark_hi_clusters.png`),
      fullPage: true,
    });
    await contextDark.close();
  }

  await browser.close();
  console.log("Milestone 3 visual audit completed successfully.");
}

runMilestone3Audit().catch((err) => {
  console.error("Audit error:", err);
  process.exit(1);
});
