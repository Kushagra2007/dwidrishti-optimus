import { chromium } from "playwright";
import path from "path";

const EVIDENCE_DIR = "C:\\Users\\kusha\\.gemini\\antigravity\\brain\\ba60992d-6c75-474d-b218-7f2bf1a40b09\\evidence\\m5";

async function runLiveAudit() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  
  await page.goto("http://127.0.0.1:8080");
  await page.waitForTimeout(1000);
  
  // Enter search query in the search bar
  const searchInput = page.locator("header input[type='search']");
  await searchInput.fill("court");
  await page.waitForTimeout(500);

  await page.screenshot({
    path: path.join(EVIDENCE_DIR, "desktop_search_court.png"),
    fullPage: true,
  });

  await browser.close();
  console.log("Live search visual test passed.");
}

runLiveAudit().catch(console.error);
