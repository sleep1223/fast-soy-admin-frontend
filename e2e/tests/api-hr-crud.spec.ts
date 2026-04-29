import { expect, test } from '@playwright/test';
import { API_BASE, authedContext } from '../utils/api';

test.describe('HR Department CRUD (super admin)', () => {
  const HR = `${API_BASE}/business/hr/departments`;
  const code = `E2E_${Date.now()}`;
  // Department.name 在 DB 层 unique=True，软删除行也占用，所以 name 必须随机
  const name = `E2E临时部门_${code}`;
  let createdId: string;

  test('create → search → patch → delete', async () => {
    const ctx = await authedContext('Soybean', '123456');

    // 1. CREATE
    const createRes = await ctx.post(HR, {
      data: { name, code, status: '1', order: 0, level: 1 }
    });
    const created = await createRes.json();
    expect(created.code).toBe('0000');
    expect(typeof created.data.createdId).toBe('string'); // sqid
    createdId = created.data.createdId;

    // 2. SEARCH 能找到
    const searchRes = await ctx.post(`${HR}/search`, { data: { current: 1, size: 50, code } });
    const search = await searchRes.json();
    expect(search.code).toBe('0000');
    const hit = search.data.records.find((r: { code: string }) => r.code === code);
    expect(hit).toBeTruthy();
    expect(hit.id).toBe(createdId);

    // 3. PATCH（dept_crud 未启用单条 GET 路由，改为再次 search 校验生效）
    const patchRes = await ctx.patch(`${HR}/${createdId}`, {
      data: { description: '通过 E2E 修改' }
    });
    expect((await patchRes.json()).code).toBe('0000');

    const afterPatch = await ctx.post(`${HR}/search`, { data: { current: 1, size: 50, code } });
    const afterPatchBody = await afterPatch.json();
    const patched = afterPatchBody.data.records.find((r: { code: string }) => r.code === code);
    expect(patched?.description).toBe('通过 E2E 修改');

    // 4. DELETE（软删除：record 仍在但 deletedAt 被设置）
    const delRes = await ctx.delete(`${HR}/${createdId}`);
    expect((await delRes.json()).code).toBe('0000');

    const after = await ctx.post(`${HR}/search`, { data: { current: 1, size: 50, code } });
    const afterBody = await after.json();
    const stillThere = afterBody.data.records.find((r: { code: string }) => r.code === code);
    if (stillThere) {
      expect(stillThere.deletedAt).toBeTruthy();
    }

    await ctx.dispose();
  });

  test('duplicate code rejected', async () => {
    const ctx = await authedContext('Soybean', '123456');
    const dupCode = `E2E_DUP_${Date.now()}`;
    const first = await ctx.post(HR, {
      data: { name: `部门A_${dupCode}`, code: dupCode, status: '1', order: 0, level: 1 }
    });
    const firstBody = await first.json();
    expect(firstBody.code).toBe('0000');
    const id = firstBody.data.createdId;

    const second = await ctx.post(HR, {
      data: { name: `部门B_${dupCode}`, code: dupCode, status: '1', order: 0, level: 1 }
    });
    const secondBody = await second.json();
    expect(secondBody.code).not.toBe('0000');

    await ctx.delete(`${HR}/${id}`);
    await ctx.dispose();
  });
});
