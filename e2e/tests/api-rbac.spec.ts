import { expect, test } from '@playwright/test';
import { API_BASE, authedContext } from '../utils/api';

test('common user (R_USER) is denied on system user search', async () => {
  const ctx = await authedContext('User', '123456');
  const res = await ctx.post(`${API_BASE}/system-manage/users/search`, {
    data: { current: 1, size: 10 }
  });
  const body = await res.json();
  // 2200–2207 段为权限拒绝；至少不能是 0000
  expect(body.code).not.toBe('0000');
  await ctx.dispose();
});

test('super admin can search system users', async () => {
  const ctx = await authedContext('Soybean', '123456');
  const res = await ctx.post(`${API_BASE}/system-manage/users/search`, {
    data: { current: 1, size: 10 }
  });
  const body = await res.json();
  expect(body.code).toBe('0000');
  expect(Array.isArray(body.data.records)).toBe(true);
  await ctx.dispose();
});

test('missing token returns auth error', async ({ request }) => {
  const res = await request.post(`${API_BASE}/system-manage/users/search`, {
    data: { current: 1, size: 10 }
  });
  // 无 token 应被拒绝：要么返回非 200，要么返回 21xx 业务码
  if (res.ok()) {
    const body = await res.json();
    expect(body.code).toMatch(/^21\d{2}$/);
  } else {
    expect(res.status()).toBeGreaterThanOrEqual(400);
  }
});
