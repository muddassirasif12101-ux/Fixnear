import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  // start from home to ensure Vite index is served
  await page.goto('/');
  // clear any persisted auth
  await page.evaluate(() => localStorage.removeItem('fixnear_token'));
});

test('registration -> dashboard', async ({ page }) => {
  await page.goto('/register');
  await page.waitForSelector('form', { timeout: 20000 });
  await page.locator('input[type="text"]').fill('Playwright UI');
  const ts = Date.now();
  const email = `pw+${ts}@fixnear.local`;
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill('Playwright@123');
  await page.locator('select').selectOption('CUSTOMER');
  await page.getByRole('button', { name: /Create account/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Customer dashboard')).toBeVisible();
});

test('login -> dashboard (seeded customer)', async ({ page }) => {
  await page.goto('/login');
  await page.waitForSelector('form', { timeout: 20000 });
  await page.locator('input[type="email"]').fill('customer@fixnear.local');
  await page.locator('input[type="password"]').fill('Customer@123');
  await page.getByRole('button', { name: /Sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Customer dashboard')).toBeVisible();
  await expect(page.getByText('Role: CUSTOMER')).toBeVisible();
});

test('protected route redirects when not authenticated', async ({ page }) => {
  await page.goto('/dashboard');
  // ensure client had a chance to redirect
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/login/);
});

test('logout clears token and redirects to login', async ({ page }) => {
  // login first
  await page.goto('/login');
  await page.waitForSelector('form', { timeout: 20000 });
  await page.locator('input[type="email"]').fill('customer@fixnear.local');
  await page.locator('input[type="password"]').fill('Customer@123');
  await page.getByRole('button', { name: /Sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  // click logout
  await page.getByRole('button', { name: /Logout/i }).click();
  await expect(page).toHaveURL(/login/);
});

test('provider user can login and see PROVIDER role', async ({ page }) => {
  await page.goto('/login');
  await page.waitForSelector('form', { timeout: 20000 });
  await page.locator('input[type="email"]').fill('provider@fixnear.local');
  await page.locator('input[type="password"]').fill('Provider@123');
  await page.getByRole('button', { name: /Sign in/i }).click();
  await expect(page).toHaveURL(/dashboard/);
  await expect(page.getByText('Role: PROVIDER')).toBeVisible();
});
