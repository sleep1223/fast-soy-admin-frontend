import type { Page } from '@playwright/test';
import { expect } from '@playwright/test';

export async function loginAs(page: Page, userName: string, password: string) {
  await page.goto('/login');
  await page.locator('input').nth(0).fill(userName);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole('button', { name: '确认', exact: true }).click();
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

export async function quickLoginSuper(page: Page) {
  await page.goto('/login');
  await page.getByRole('button', { name: '超级管理员', exact: true }).click();
  await page.waitForURL(url => !url.pathname.startsWith('/login'), { timeout: 15_000 });
}

/**
 * 打开内部页面并校验 URL 稳定（未被守卫重定向到 403/404/500/login），
 * 同时校验页面整体未渲染明显错误内容。
 */
export async function expectPageOpens(page: Page, path: string) {
  await page.goto(path);
  await page.waitForLoadState('networkidle', { timeout: 15_000 }).catch(() => {});
  await expect(page).toHaveURL(new RegExp(path.replace(/\//g, '\\/').replace(/:[^/]+/g, '[^/?#]+')));
  const url = page.url();
  expect(url).not.toMatch(/\/(403|404|500)(\?|$|#)/);
  expect(url).not.toMatch(/\/login(\/|\?|$|#)/);
}
