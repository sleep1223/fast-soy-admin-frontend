import { expect, test } from '@playwright/test';
import { expectPageOpens, loginAs } from '../utils/page';

test.describe('Function pages (super admin)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
  });

  test('切换权限 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/toggle-auth');
    await expect(page.getByText('切换权限').first()).toBeVisible();
  });

  test('超级管理员可见 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/super-page');
  });

  test('请求 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/request');
    await expect(page.getByRole('button').first()).toBeVisible();
  });

  test('标签页 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/tab');
    await expect(page.getByText(/标签页操作|标签页/).first()).toBeVisible();
  });

  test('多标签页 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/multi-tab');
  });

  test('隐藏子菜单 一 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/hide-child/one');
  });

  test('隐藏子菜单 二 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/hide-child/two');
  });

  test('隐藏子菜单 三 页面渲染', async ({ page }) => {
    await expectPageOpens(page, '/function/hide-child/three');
  });
});
