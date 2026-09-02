const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { chromium } = require('playwright');

const baseURL = process.env.PORTFOLIO_BASE_URL || 'http://127.0.0.1:4173';
const routes = ['/', '/projects.html', '/teaching.html', '/courses.html', '/contact.html', '/cc/'];
const viewports = [
  { width: 1440, height: 900 },
  { width: 390, height: 844 },
  { width: 320, height: 844 },
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
      const response = await page.goto(`${baseURL}${route}`, { waitUntil: 'load' });
      assert.ok(response, `${route} did not return a navigation response`);
      assert.equal(response.ok(), true, `${route} returned HTTP ${response.status()}`);
      assert.equal(new URL(page.url()).pathname, route, `${route} resolved to the wrong route`);
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

test('system theme applies without becoming an explicit stored choice', async () => {
  const context = await browser.newContext({ viewport: viewports[0], colorScheme: 'dark' });
  const page = await context.newPage();
  await page.goto(`${baseURL}/`, { waitUntil: 'load' });

  assert.equal(await page.evaluate(() => document.documentElement.dataset.theme), 'dark');
  assert.equal(await page.evaluate(() => localStorage.getItem('griffin-theme')), null);
  await context.close();
});

for (const controller of [
  { name: 'primary', route: '/', toggle: '[data-nav-toggle]', nav: '#site-nav' },
  { name: 'Critical Concepts', route: '/cc/', toggle: '[data-cc-nav-toggle]', nav: '#cc-nav' },
]) {
  test(`${controller.name} mobile navigation keeps disclosure state synchronized`, async () => {
    const page = await browser.newPage({ viewport: viewports[1] });
    await page.goto(`${baseURL}${controller.route}`, { waitUntil: 'load' });
    const toggle = page.locator(controller.toggle);
    const nav = page.locator(controller.nav);
    const assertState = async (open) => {
      assert.equal(await toggle.getAttribute('aria-expanded'), String(open));
      assert.equal(await nav.getAttribute('data-open'), String(open));
      assert.equal(await nav.isVisible(), open);
    };

    await assertState(false);
    await toggle.click();
    await assertState(true);
    await toggle.click();
    await assertState(false);

    await toggle.click();
    await page.keyboard.press('Escape');
    await assertState(false);

    await toggle.click();
    const link = nav.locator('a').first();
    await link.evaluate((element) => element.addEventListener('click', (event) => event.preventDefault()));
    await link.click();
    await assertState(false);
    await page.close();
  });
}

test('skip link moves keyboard focus to main content', async () => {
  const page = await browser.newPage({ viewport: viewports[0] });
  await page.goto(`${baseURL}/`, { waitUntil: 'load' });
  await page.keyboard.press('Tab');
  assert.equal(await page.locator('.skip-link').evaluate((link) => link === document.activeElement), true);

  await page.keyboard.press('Enter');
  assert.equal(await page.evaluate(() => document.activeElement.id), 'main-content');
  await page.close();
});

test('project filters expose exact categories and one synchronized pressed state', async () => {
  const page = await browser.newPage({ viewport: viewports[0] });
  await page.goto(`${baseURL}/projects.html`, { waitUntil: 'load' });
  const filters = page.locator('[data-project-filter]');
  const expected = [
    { key: 'all', count: 13 },
    { key: 'software', count: 2 },
    { key: 'academic', count: 6 },
    { key: 'early', count: 5 },
  ];

  assert.equal(await filters.count(), expected.length);
  for (const { key, count } of expected) {
    const filter = page.locator(`[data-project-filter="${key}"]`);
    await filter.click();
    const visibleProjects = page.locator('[data-project-card]:visible');
    assert.equal(await visibleProjects.count(), count, `${key} exposes the wrong number of projects`);
    assert.equal(await filter.getAttribute('aria-pressed'), 'true', `${key} is not pressed`);
    assert.equal(
      await page.locator('[data-project-filter][aria-pressed="true"]').count(),
      1,
      `${key} does not leave exactly one pressed filter`,
    );
    if (key !== 'all') {
      assert.deepEqual(
        await visibleProjects.evaluateAll((cards) => [...new Set(cards.map((card) => card.dataset.category))]),
        [key],
        `${key} exposes a project from another category`,
      );
    }
  }

  await page.close();
});
