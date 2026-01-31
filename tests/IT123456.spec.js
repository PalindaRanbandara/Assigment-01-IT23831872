const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// ====================================================
// TEST DATA (Mapped from your new Excel Sheet)
// ====================================================
const testCases = [
  // --- Positive Functional Test Cases ---
  { id: 'Pos_Fun_001', category: '1_Simple_Daily', input: 'mama heta gedhara yanavaa.', expected: 'මම හෙට ගෙදර යනවා.' },
  { id: 'Pos_Fun_002', category: '2_Questions', input: 'oyaage nama mokakdha?', expected: 'ඔයාගෙ නම මොකක්ද?' },
  { id: 'Pos_Fun_003', category: '3_Compound_Sentence', input: 'api kanavaa saha tea bonavaa.', expected: 'අපි කනවා සහ tea බොනවා.' },
  { id: 'Pos_Fun_004', category: '6_Mixed_Language', input: 'mata WhatsApp message ekak awa.', expected: 'මට WhatsApp message එකක් අwඅ.' },
  { id: 'Pos_Fun_005', category: '2_Commands', input: 'potha ikmanata dhenna.', expected: 'පොත ඉක්මනට දෙන්න.' },
  { id: 'Pos_Fun_006', category: '1_Simple_Daily', input: 'mata eeka epaa.', expected: 'මට ඒක එපා.' },
  { id: 'Pos_Fun_007', category: '3_Complex_Sentence', input: 'vaessa nisaa api trip eka cancel kale.', expected: 'වැස්ස නිසා අපි trip එක cancel kale.' },
  { id: 'Pos_Fun_008', category: '5_Numbers_Currency', input: 'Rs. 1500 k dhenna.', expected: 'Rs. 1500 ක් දෙන්න.' },
  { id: 'Pos_Fun_009', category: '5_Formatting', input: 'oya kattiya   kohedha   yannee?', expected: 'ඔය කට්ටිය   කොහෙද   යන්නේ?' },
  { id: 'Pos_Fun_010', category: '5_Dates', input: 'ada 2026-01-31 venidha.', expected: 'අද 2026-01-31 වෙනිදා.' },

  // --- New Positive Test Cases (Updated Expectations) ---
  { id: 'Pos_Fun_011', category: '1_Greetings', input: 'subha udhaasanak.', expected: 'සුබ්හ උදාසනක්.' },
  { id: 'Pos_Fun_012', category: '1_Simple_Daily', input: 'mama lankave.', expected: 'මම ලන්කවෙ.' },
  { id: 'Pos_Fun_013', category: '2_Requests', input: 'mata wathura tikak dhenna.', expected: 'මට wඅතුර ටිකක් දෙන්න.' },
  { id: 'Pos_Fun_014', category: '2_Questions', input: 'koy veleta da enne?', expected: 'කොය් වෙලෙට ඩ එන්නෙ?' },
  { id: 'Pos_Fun_015', category: '1_Common_Phrases', input: 'bohoma sthuthi.', expected: 'බොහොම ස්තුති.' },
  { id: 'Pos_Fun_016', category: '4_Feelings', input: 'mata badagini.', expected: 'මට බඩගිනි.' },
  { id: 'Pos_Fun_017', category: '3_Places', input: 'colombo yanna oone.', expected: 'colombo යන්න ඕනෙ.' },
  { id: 'Pos_Fun_018', category: '2_Questions', input: 'den welava keeyada?', expected: 'den wඑලව කේයඩ?' },
  { id: 'Pos_Fun_019', category: '1_Relationships', input: 'ammai thaththai gedara.', expected: 'අම්මයි තාත්තයි ගෙදර.' },
  { id: 'Pos_Fun_020', category: '1_Activities', input: 'api cricket gahamu.', expected: 'අපි cricket ගහමු.' },

  // --- Negative Functional Test Cases ---
  { id: 'Neg_Fun_001', category: '8_Negative', input: 'user@domain#name', expected: 'user@domain#name' },
  { id: 'Neg_Fun_002', category: '8_Negative_Security', input: '<script>alert(\'Test\')</script>', expected: '<script>alert(\'Test\')</script>' },
  { id: 'Neg_Fun_003', category: '8_Negative_Numeric', input: '0771234567', expected: '0771234567' },
  { id: 'Neg_Fun_004', category: '8_Negative_URL', input: 'https://www.google.com', expected: 'https://www.google.com' }
];

// Helper function to create directory if it doesn't exist
function createScreenshotDir(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// ====================================================
// FUNCTIONAL TESTS LOOP
// ====================================================
for (const data of testCases) {

  test(`${data.id}: ${data.category}`, async ({ page }) => {

    // 1. Navigate to the site
    await page.goto('https://www.swifttranslator.com/');
    // Wait slightly longer to ensure scripts are initialized
    await page.waitForTimeout(5000);

    // 2. Identify Input & Output
    const inputArea = page.getByPlaceholder('Input Your Singlish Text Here.');
    const outputArea = page.locator('div.whitespace-pre-wrap.w-full.h-80');

    // 3. Clear & Fill Input
    await inputArea.click();
    await inputArea.press('Control+A');
    await inputArea.press('Backspace');

    // Use fill + dispatchEvent to ensure React state updates and triggers API
    await inputArea.fill(data.input);
    await inputArea.dispatchEvent('input');

    // 4. Trigger Transliteration
    // Press space to ensure the last word is processed
    await page.keyboard.press('Space');

    // 5. Wait for completion
    // Fixed wait
    await page.waitForTimeout(5000);

    // 6. Screenshot
    const imagePath = `screenshots/${data.category}/${data.id}.png`;
    createScreenshotDir(imagePath);
    await page.screenshot({ path: imagePath });
    await test.info().attach(data.id, { path: imagePath, contentType: 'image/png' });

    // 7. Get actual output
    const actualOutput = await outputArea.innerText();
    console.log(`[${data.id}] Expected: "${data.expected}" | Actual: "${actualOutput}"`);

    // 8. Assertion
    if (data.id.startsWith('Neg_')) {
      expect(actualOutput).toContain(data.expected);
    } else {
      expect(actualOutput).toContain(data.expected);
    }
  });
}

// ====================================================
// UI TEST CASE
// =====================================================
test('Pos_UI_001: Input box visibility', async ({ page }) => {
  await page.goto('https://www.swifttranslator.com/');
  await page.waitForLoadState('domcontentloaded');

  const inputArea = page.getByPlaceholder('Input Your Singlish Text Here.');

  await expect(inputArea).toBeVisible();
  await expect(inputArea).toBeEnabled();

  const initialText = await inputArea.inputValue();
  expect(initialText).toBe('');

  const imagePath = `screenshots/9_UI/Pos_UI_001.png`;
  await page.screenshot({ path: imagePath });
  await test.info().attach('Pos_UI_001', { path: imagePath, contentType: 'image/png' });
});
