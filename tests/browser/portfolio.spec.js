const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { chromium } = require('playwright');

const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173';
const routes = ['/', '/projects.html', '/teaching.html', '/courses.html', '/contact.html', '/cc/'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
];

let browser;

before(async () => {
  browser = await chromium.launch({ channel: process.env.PLAYWRIGHT_CHANNEL || 'chrome', headless: true });
});

after(async () => {
  if (browser) await browser.close();
});

for (const viewport of viewports) {
  test(`primary routes have no horizontal overflow at ${viewport.width}x${viewport.height}`, async () => {
    const page = await browser.newPage({ viewport });

    for (const route of routes) {
      await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      assert.equal(overflow, 0, `${route} overflows by ${overflow}px`);
    }

    await page.close();
  });
}

test('dark theme persists across reloads', async () => {
  const context = await browser.newContext({ viewport: viewports[0] });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await page.evaluate(() => localStorage.setItem('griffin-theme', 'light'));
  await page.reload({ waitUntil: 'load' });
  await page.locator('[data-theme-toggle]').click();
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');

  await page.reload({ waitUntil: 'load' });
  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  await context.close();
});

test('mobile navigation opens and closes', async () => {
  const page = await browser.newPage({ viewport: viewports[1] });
  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  const toggle = page.locator('[data-nav-toggle]');
  const nav = page.locator('#site-nav');

  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'true');
  assert.equal(await nav.getAttribute('data-open'), 'true');
  assert.equal(await nav.isVisible(), true);

  await toggle.click();
  assert.equal(await toggle.getAttribute('aria-expanded'), 'false');
  assert.equal(await nav.getAttribute('data-open'), 'false');
  assert.equal(await nav.isVisible(), false);
  await page.close();
});

test('skip link moves keyboard focus to main content', async () => {
  const page = await browser.newPage({ viewport: viewports[0] });
  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate((link) => link === document.activeElement), true);

  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
  await page.close();
});

test('every project filter leaves at least one project visible', async () => {
  const page = await browser.newPage({ viewport: viewports[0] });
  await page.goto(`${baseURL}/projects.html`, { waitUntil: 'load' });
  const filters = page.locator('[data-project-filter]');

  for (let index = 0; index < await filters.count(); index += 1) {
    const filter = filters.nth(index);
    const label = (await filter.textContent()).trim();
    await filter.click();
    const visibleProjects = await page.locator('[data-project-card]:visible').count();
    assert.ok(visibleProjects > 0, `${label} hides every project`);
  }

  await page.close();
});
