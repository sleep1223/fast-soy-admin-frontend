import { expect, test } from '@playwright/test';
import { expectPageOpens, loginAs } from '../utils/page';

test.describe('Manage pages (super admin)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
  });

  test('用户管理 列表渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/user');
    await expect(page.getByText('用户管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '新增', exact: true })).toBeVisible();
  });

  test('角色管理 列表渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/role');
    await expect(page.getByText('角色管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '新增', exact: true })).toBeVisible();
  });

  test('菜单管理 列表渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/menu');
    await expect(page.getByText('菜单管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '新增', exact: true })).toBeVisible();
  });

  test('API管理 列表渲染', async ({ page }) => {
    // API 列表由后端 refresh_api_list 全量对账，前端没有"新增"按钮，仅校验列表渲染。
    await expectPageOpens(page, '/manage/api');
    await expect(page.getByText('API管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '刷新', exact: true })).toBeVisible();
  });

  test('Radar 概览页渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/radar/overview');
  });

  test('Radar 监控页渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/radar/monitor');
  });

  test('Radar 请求页渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/radar/requests');
  });

  test('Radar 查询页渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/radar/queries');
  });

  test('Radar 异常页渲染', async ({ page }) => {
    await expectPageOpens(page, '/manage/radar/exceptions');
  });
});
