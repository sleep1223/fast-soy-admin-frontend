import type { APIRequestContext, APIResponse } from '@playwright/test';
import { request as pwRequest } from '@playwright/test';

export const API_BASE = 'http://127.0.0.1:9999/api/v1';

export interface BizResponse<T = unknown> {
  code: string;
  msg: string;
  data: T;
}

export async function jsonOk<T>(res: APIResponse): Promise<BizResponse<T>> {
  if (!res.ok()) throw new Error(`HTTP ${res.status()} ${await res.text()}`);
  return (await res.json()) as BizResponse<T>;
}

export async function login(api: APIRequestContext, userName: string, password: string) {
  const res = await api.post(`${API_BASE}/auth/login`, { data: { userName, password } });
  return jsonOk<{ token: string; refreshToken: string }>(res);
}

export async function authedContext(userName: string, password: string): Promise<APIRequestContext> {
  const anon = await pwRequest.newContext();
  const { code, data } = await login(anon, userName, password);
  if (code !== '0000') throw new Error(`login failed for ${userName}: ${code}`);
  await anon.dispose();
  return pwRequest.newContext({
    extraHTTPHeaders: { Authorization: `Bearer ${data.token}` }
  });
}
