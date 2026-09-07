import { test, expect } from '@playwright/test';

const ROUTES: { path: string; heading: RegExp }[] = [
  { path: '/', heading: /Muddusar/i },
  { path: '/experience', heading: /Professional/i },
  { path: '/skills', heading: /Tools & Technologies/i },
  { path: '/project', heading: /Selected/i },
  { path: '/playground', heading: /Playground/i },
];

for (const { path, heading } of ROUTES) {
  test(`${path} loads and renders its heading`, async ({ page }) => {
    const res = await page.goto(path);
    expect(res?.status(), `${path} should not be an error response`).toBeLessThan(
      400,
    );
    await expect(
      page.getByRole('heading', { name: heading }).first(),
    ).toBeVisible();
  });
}

test('404 route renders the custom not-found page', async ({ page }) => {
  await page.goto('/this-route-does-not-exist');
  await expect(page.getByRole('heading', { name: /Not found/i })).toBeVisible();
});

test('command palette opens with the keyboard shortcut', async ({ page }) => {
  await page.goto('/');
  // Wait for hydration — the shortcut listener attaches on mount.
  await expect(
    page.getByRole('button', { name: /open command palette/i }),
  ).toBeVisible();
  const field = page.getByPlaceholder('Type a command or search…');
  await expect(async () => {
    await page.keyboard.press('Control+k');
    await expect(field).toBeVisible({ timeout: 1000 });
  }).toPass({ timeout: 15000 });
  await page.keyboard.press('Escape');
  await expect(field).toBeHidden();
});

test('playground tabs switch the active demo', async ({ page }) => {
  await page.goto('/playground');
  await page.getByRole('tab', { name: 'Motion' }).click();
  await expect(
    page.getByRole('heading', { name: /Tune the spring/i }),
  ).toBeVisible();
  await page.getByRole('tab', { name: 'Layouts' }).click();
  await expect(
    page.getByRole('heading', { name: /three layouts/i }),
  ).toBeVisible();
});

test('AI terminal opens, shows suggestions, and answers', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('button', { name: /open the ai terminal/i }).click();

  const input = page.getByPlaceholder(/type "help"/i);
  await expect(input).toBeVisible();

  await input.focus();
  await expect(page.getByText(/try one/i)).toBeVisible();

  await input.fill('Is he available for remote work?');
  await input.press('Enter');
  await expect(
    page.getByText('$ Is he available for remote work?'),
  ).toBeVisible();
  // Real answer or the offline notice — either proves the request pipe works.
  await expect(page.locator('pre').last()).not.toBeEmpty({ timeout: 15000 });
});

test('sitemap and robots are served', async ({ request }) => {
  const sitemap = await request.get('/sitemap.xml');
  expect(sitemap.ok()).toBeTruthy();
  expect(await sitemap.text()).toContain('/playground');

  const robots = await request.get('/robots.txt');
  expect(robots.ok()).toBeTruthy();
  expect(await robots.text()).toContain('Sitemap:');
});
