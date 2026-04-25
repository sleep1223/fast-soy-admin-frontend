import { expect, test } from '@playwright/test';
import { API_BASE, jsonOk, login } from '../utils/api';

test('login with super admin returns token + 0000', async ({ request }) => {
  const { code, data } = await login(request, 'Soybean', '123456');
  expect(code).toBe('0000');
  expect(data.token).toBeTruthy();
  expect(data.refreshToken).toBeTruthy();
});

test('login with wrong password returns non-zero biz code', async ({ request }) => {
  const res = await request.post(`${API_BASE}/auth/login`, {
    data: { userName: 'Soybean', password: 'definitely-wrong' }
  });
  const body = await jsonOk(res);
  expect(body.code).not.toBe('0000');
});

test('user-info requires auth and returns user identity', async ({ request }) => {
  const anon = await request.get(`${API_BASE}/auth/user-info`);
  expect((await anon.json()).code).not.toBe('0000');

  const { data } = await login(request, 'Soybean', '123456');
  const me = await request.get(`${API_BASE}/auth/user-info`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });
  const body = await jsonOk<{ userName: string }>(me);
  expect(body.code).toBe('0000');
  expect(body.data.userName).toBe('Soybean');
});

test('response uses camelCase, never snake_case', async ({ request }) => {
  const { data } = await login(request, 'Soybean', '123456');
  const me = await request.get(`${API_BASE}/auth/user-info`, {
    headers: { Authorization: `Bearer ${data.token}` }
  });
  const text = await me.text();
  // 关键 camelCase 字段存在
  expect(text).toMatch(/"userName"/);
  // 同名 snake_case 不应出现在响应里
  expect(text).not.toMatch(/"user_name"/);
});
