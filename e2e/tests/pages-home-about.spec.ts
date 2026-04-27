import { expect, test } from '@playwright/test';
import { expectPageOpens, loginAs } from '../utils/page';

test.describe('Home & About', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
  });

  test('首页 渲染', async ({ page }) => {
    await expectPageOpens(page, '/home');
  });

  test('关于 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/about');
    await expect(page.getByText(/关于|About/).first()).toBeVisible();
  });
});
