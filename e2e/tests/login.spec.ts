import { expect, test } from '@playwright/test';

test('quick-login as super admin redirects away from /login', async ({ page }) => {
  await page.goto('/login');

  await page.getByRole('button', { name: '超级管理员', exact: true }).click();

  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 15_000 });
  await expect(page.locator('body')).toContainText('登录成功');
});

test('wrong password keeps user on /login', async ({ page }) => {
  await page.goto('/login');

  const [userInput, pwdInput] = [page.locator('input').nth(0), page.locator('input[type="password"]')];
  await userInput.fill('Soybean');
  await pwdInput.fill('wrongpw99');

  await page.getByRole('button', { name: '确认', exact: true }).click();

  await page.waitForTimeout(2000);
  await expect(page).toHaveURL(/\/login/);
  await expect(page.locator('body')).not.toContainText('登录成功');
});
