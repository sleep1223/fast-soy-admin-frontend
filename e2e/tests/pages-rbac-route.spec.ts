import { expect, test } from '@playwright/test';
import { loginAs } from '../utils/page';

test.describe('RBAC route access (common user)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'User', '123456');
  });

  test('普通用户访问 /manage/user 不应进入用户管理页面', async ({ page }) => {
    await page.goto('/manage/user');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    // 普通用户应被重定向（404 / 403 / 首页），路径不应保留在 /manage/user
    await expect(page).not.toHaveURL(/\/manage\/user(\?|$|#)/);
  });

  test('普通用户访问 /manage/role 不应进入角色管理页面', async ({ page }) => {
    await page.goto('/manage/role');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await expect(page).not.toHaveURL(/\/manage\/role(\?|$|#)/);
  });

  test('普通用户访问 /function/super-page 不可达', async ({ page }) => {
    await page.goto('/function/super-page');
    await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
    await expect(page).not.toHaveURL(/\/function\/super-page(\?|$|#)/);
  });
});
