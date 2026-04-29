import { expect, test } from '@playwright/test';
import { expectPageOpens, loginAs } from '../utils/page';

test.describe('HR pages (super admin)', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page, 'Soybean', '123456');
  });

  test('部门管理 列表渲染', async ({ page }) => {
    await expectPageOpens(page, '/hr/department');
    await expect(page.getByText('部门管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '新增', exact: true })).toBeVisible();
  });

  test('员工管理 列表渲染', async ({ page }) => {
    await expectPageOpens(page, '/hr/employee');
    await expect(page.getByText('员工管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '新增', exact: true })).toBeVisible();
  });

  test('标签管理 列表渲染', async ({ page }) => {
    await expectPageOpens(page, '/hr/tag');
    await expect(page.getByText('标签管理').first()).toBeVisible();
    await expect(page.getByRole('button', { name: '新增', exact: true })).toBeVisible();
  });

  test('我的团队 渲染', async ({ page }) => {
    await expectPageOpens(page, '/hr/team');
    await expect(page.getByText('我的团队').first()).toBeVisible();
  });

  test('我的工作台 渲染', async ({ page }) => {
    await expectPageOpens(page, '/hr/my-workspace');
    await expect(page.getByText('我的工作台').first()).toBeVisible();
  });
});
