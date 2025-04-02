// e2e/popup.test.ts
import puppeteer from 'puppeteer';
import * as path from 'path';
// Skip the entire test suite for regular test runs - these should only be run explicitly
// using yarn test:e2e in a proper environment with the extension built
describe.skip('Extension Popup E2E Tests', () => {
    let browser;
    let page;
    const extensionPath = path.join(__dirname, '../dist');
    beforeAll(async () => {
        // Launch browser with extension loaded
        browser = await puppeteer.launch({
            headless: false, // Extensions require a head
            args: [
                `--disable-extensions-except=${extensionPath}`,
                `--load-extension=${extensionPath}`
            ]
        });
    });
    beforeEach(async () => {
        // Create a new page
        page = await browser.newPage();
        // Get the extension popup URL
        const targets = await browser.targets();
        const extensionTarget = targets.find(target => target.type() === 'background_page' &&
            target.url().includes('vocalearn'));
        if (!extensionTarget) {
            throw new Error('Extension background page not found');
        }
        // Open the popup
        await page.goto(`chrome-extension://${extensionTarget.url().split('/')[2]}/popup/popup.html`);
    });
    afterAll(async () => {
        await browser.close();
    });
    test('Popup should load and display tabs', async () => {
        // Check that the popup has loaded
        await page.waitForSelector('.tab-button');
        // Check that the vocabulary tab is active by default
        const activeTab = await page.$eval('.tab-button.active', el => el.textContent);
        expect(activeTab).toContain('Vocabulary');
        // Check that the vocabulary content is visible
        const vocabularyContent = await page.$eval('#vocabulary-section', el => window.getComputedStyle(el).display);
        expect(vocabularyContent).not.toBe('none');
    });
    test('Switching tabs should work', async () => {
        // Click on the settings tab
        await page.click('#tab-settings');
        // Check that the settings tab is now active
        const activeTab = await page.$eval('.tab-button.active', el => el.textContent);
        expect(activeTab).toContain('Settings');
        // Check that the settings content is visible
        const settingsContent = await page.$eval('#settings-section', el => window.getComputedStyle(el).display);
        expect(settingsContent).not.toBe('none');
    });
});
