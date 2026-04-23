<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchGetHrShowcase } from '@/service/api';

defineOptions({ name: 'ShowcasePage' });

const loading = ref(false);
const overview = ref<Api.HrManage.ShowcaseOverview | null>(null);

const statusLabel: Record<string, string> = {
  pending: '待入职',
  onboarding: '入职中',
  active: '在职',
  resigned: '已离职'
};

const statusTagType: Record<string, 'default' | 'info' | 'success' | 'warning'> = {
  pending: 'warning',
  onboarding: 'info',
  active: 'success',
  resigned: 'default'
};

async function loadData() {
  loading.value = true;
  const res = await fetchGetHrShowcase();
  if (res.data) {
    overview.value = res.data;
  }
  loading.value = false;
}

const deptColumns = [
  { title: '部门名称', key: 'name' },
  { title: '部门编码', key: 'code' },
  { title: '员工数', key: 'employeeCount' }
];

onMounted(loadData);
</script>

<template>
  <div class="min-h-full bg-layout p-24px">
    <div class="mx-auto max-w-1200px">
      <NCard :bordered="false" class="mb-16px">
        <template #header>
          <div class="flex items-center gap-12px">
            <icon-mdi-chart-box class="text-24px text-primary" />
            <span class="text-20px font-600">HR 数据展示</span>
            <NTag size="small" type="info" :bordered="false">常量路由 · 无需登录</NTag>
          </div>
        </template>
        <p class="text-14px text-#888">
          本页由常量路由提供，未登录即可访问。数据来自 <code>GET /api/v1/business/hr/public/showcase</code>。
        </p>
      </NCard>

      <NSpin :show="loading">
        <NGrid :cols="3" :x-gap="16" :y-gap="16" responsive="screen" item-responsive>
          <NGi span="3 s:1">
            <NCard title="部门总数" hoverable>
              <div class="text-32px font-600 text-primary">
                {{ overview?.totals.department ?? '-' }}
              </div>
            </NCard>
          </NGi>
          <NGi span="3 s:1">
            <NCard title="员工总数" hoverable>
              <div class="text-32px font-600 text-success">
                {{ overview?.totals.employee ?? '-' }}
              </div>
            </NCard>
          </NGi>
          <NGi span="3 s:1">
            <NCard title="标签总数" hoverable>
              <div class="text-32px font-600 text-warning">
                {{ overview?.totals.tag ?? '-' }}
              </div>
            </NCard>
          </NGi>
        </NGrid>

        <NCard title="员工状态分布" class="mt-16px" :bordered="false">
          <NSpace v-if="overview" :size="12" wrap>
            <NTag
              v-for="(count, status) in overview.employeeStatus"
              :key="status"
              :type="statusTagType[status] ?? 'default'"
              size="large"
              round
            >
              {{ statusLabel[status] ?? status }}：{{ count }}
            </NTag>
          </NSpace>
          <NEmpty v-else description="暂无数据" />
        </NCard>

        <NCard title="部门员工分布" class="mt-16px" :bordered="false">
          <NDataTable
            :columns="deptColumns"
            :data="overview?.departments ?? []"
            :bordered="false"
            size="small"
          />
        </NCard>

        <div class="mt-16px text-center">
          <NButton type="primary" :loading="loading" @click="loadData">刷新数据</NButton>
        </div>
      </NSpin>
    </div>
  </div>
</template>
