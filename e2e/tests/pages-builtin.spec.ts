import { expect, test } from '@playwright/test';
import { loginAs } from '../utils/page';

test.describe('Builtin error pages', () => {
  test('未登录访问任意内部路由会跳转登录页', async ({ page }) => {
    await page.goto('/manage/user');
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    await expect(page).toHaveURL(/\/login/);
  });

  test('登录后 403 页面可直接访问', async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
    await page.goto('/403');
    await expect(page).toHaveURL(/\/403/);
    await expect(page.getByRole('button', { name: '返回首页' })).toBeVisible();
  });

  test('登录后访问不存在的路由渲染 404', async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
    await page.goto('/this-route-does-not-exist');
    // 此项目不强制把 URL 改写成 /404，但会渲染 ExceptionBase（含"返回首页"按钮）。
    await expect(page.getByRole('button', { name: '返回首页' })).toBeVisible({ timeout: 10_000 });
  });

  test('登录后 500 页面可直接访问', async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
    await page.goto('/500');
    await expect(page).toHaveURL(/\/500/);
    await expect(page.getByRole('button', { name: '返回首页' })).toBeVisible();
  });
});
