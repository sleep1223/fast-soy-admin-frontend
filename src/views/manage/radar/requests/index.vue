<script setup lang="tsx">
import { reactive, ref } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { fetchRadarRequestDetail, fetchRadarRequests } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import RequestDetailDrawer from './modules/request-detail-drawer.vue';

const appStore = useAppStore();

const loading = ref(false);
const data = ref<Api.Radar.RequestRecord[]>([]);
const total = ref(0);
const drawerVisible = ref(false);
const detailData = ref<Api.Radar.RequestDetail | null>(null);
const detailLoading = ref(false);

const searchParams = reactive({
  page: 1,
  page_size: 20,
  path_filter: null as string | null,
  code_filter: null as string | null,
  min_duration: null as number | null,
  has_error: null as boolean | null
});

const pagination = reactive({
  page: 1,
  pageSize: 20,
  itemCount: 0,
  showSizePicker: true,
  pageSizes: [10, 20, 50],
  onChange: (page: number) => {
    searchParams.page = page;
    pagination.page = page;
    loadData();
  },
  onUpdatePageSize: (pageSize: number) => {
    searchParams.page_size = pageSize;
    searchParams.page = 1;
    pagination.page = 1;
    pagination.pageSize = pageSize;
    loadData();
  }
});

async function loadData() {
  loading.value = true;
  const { error, data: result } = await fetchRadarRequests(searchParams);
  if (!error) {
    data.value = result.records;
    total.value = result.total;
    pagination.itemCount = result.total;
  }
  loading.value = false;
}

async function viewDetail(xRequestId: string) {
  drawerVisible.value = true;
  detailLoading.value = true;
  const { error, data: result } = await fetchRadarRequestDetail(xRequestId);
  if (!error) {
    detailData.value = result;
  }
  detailLoading.value = false;
}

function resetSearch() {
  searchParams.path_filter = null;
  searchParams.code_filter = null;
  searchParams.min_duration = null;
  searchParams.has_error = null;
  searchParams.page = 1;
  pagination.page = 1;
  loadData();
}

function getMethodTagType(method: string): NaiveUI.ThemeColor {
  const map: Record<string, NaiveUI.ThemeColor> = {
    GET: 'success',
    POST: 'info',
    PUT: 'warning',
    PATCH: 'warning',
    DELETE: 'error'
  };
  return map[method.toUpperCase()] || 'default';
}

function getCodeTagType(code: string | null): NaiveUI.ThemeColor {
  if (!code) return 'default';
  if (code.startsWith('0')) return 'success';
  if (code.startsWith('40')) return 'warning';
  if (code.startsWith('5')) return 'error';
  return 'default';
}

const columns = [
  {
    key: 'method',
    title: $t('page.manage.radar.requests.method'),
    width: 80,
    align: 'center' as const,
    render: (row: Api.Radar.RequestRecord) => <NTag type={getMethodTagType(row.method)} size="small">{row.method}</NTag>
  },
  {
    key: 'path',
    title: $t('page.manage.radar.requests.path'),
    minWidth: 200,
    ellipsis: { tooltip: true }
  },
  {
    key: 'queryParams',
    title: $t('page.manage.radar.requests.queryParams'),
    width: 160,
    ellipsis: { tooltip: true },
    render: (row: Api.Radar.RequestRecord) => row.queryParams || '-'
  },
  {
    key: 'businessCode',
    title: $t('page.manage.radar.requests.businessCode'),
    width: 90,
    align: 'center' as const,
    render: (row: Api.Radar.RequestRecord) => (
      <NTag type={getCodeTagType(row.businessCode)} size="small">
        {row.businessCode ?? '-'}
      </NTag>
    )
  },
  {
    key: 'durationMs',
    title: $t('page.manage.radar.requests.duration'),
    width: 100,
    align: 'center' as const,
    render: (row: Api.Radar.RequestRecord) => (row.durationMs !== null ? `${row.durationMs.toFixed(1)}ms` : '-')
  },
  {
    key: 'clientIp',
    title: $t('page.manage.radar.requests.clientIp'),
    width: 130,
    ellipsis: { tooltip: true },
    render: (row: Api.Radar.RequestRecord) => row.clientIp || '-'
  },
  {
    key: 'errorType',
    title: $t('page.manage.radar.requests.error'),
    width: 150,
    ellipsis: { tooltip: true },
    render: (row: Api.Radar.RequestRecord) =>
      row.errorType ? <NTag type="error" size="small">{row.errorType}</NTag> : '-'
  },
  {
    key: 'fmtCreatedAt',
    title: $t('page.manage.radar.requests.createdAt'),
    width: 180,
    align: 'center' as const
  },
  {
    key: 'operate',
    title: $t('common.operate'),
    width: 80,
    align: 'center' as const,
    fixed: 'right' as const,
    render: (row: Api.Radar.RequestRecord) => (
      <NButton type="primary" ghost size="small" onClick={() => viewDetail(row.xRequestId)}>
        {$t('common.view')}
      </NButton>
    )
  }
];

loadData();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :bordered="false" size="small" class="card-wrapper">
      <NCollapse>
        <NCollapseItem :title="$t('common.search')" name="request-search">
          <NForm label-placement="left" :label-width="100">
            <NGrid responsive="screen" item-responsive>
              <NFormItemGi
                span="24 s:12 m:6"
                :label="$t('page.manage.radar.requests.path')"
                class="pr-24px"
              >
                <NInput v-model:value="searchParams.path_filter" clearable />
              </NFormItemGi>
              <NFormItemGi
                span="24 s:12 m:6"
                :label="$t('page.manage.radar.requests.businessCode')"
                class="pr-24px"
              >
                <NInput v-model:value="searchParams.code_filter" clearable />
              </NFormItemGi>
              <NFormItemGi
                span="24 s:12 m:6"
                :label="$t('page.manage.radar.requests.minDuration')"
                class="pr-24px"
              >
                <NInputNumber v-model:value="searchParams.min_duration" clearable :min="0">
                  <template #suffix>ms</template>
                </NInputNumber>
              </NFormItemGi>
              <NFormItemGi
                span="24 s:12 m:6"
                :label="$t('page.manage.radar.requests.hasError')"
                class="pr-24px"
              >
                <NSelect
                  v-model:value="(searchParams.has_error as any)"
                  clearable
                  :options="(([
                    { label: $t('common.yesOrNo.yes'), value: true },
                    { label: $t('common.yesOrNo.no'), value: false }
                  ]) as any)"
                />
              </NFormItemGi>
              <NFormItemGi span="24 m:6" class="pr-24px">
                <NSpace class="w-full" justify="end">
                  <NButton @click="resetSearch">
                    <template #icon>
                      <icon-ic-round-refresh class="text-icon" />
                    </template>
                    {{ $t('common.reset') }}
                  </NButton>
                  <NButton type="primary" ghost @click="loadData">
                    <template #icon>
                      <icon-ic-round-search class="text-icon" />
                    </template>
                    {{ $t('common.search') }}
                  </NButton>
                </NSpace>
              </NFormItemGi>
            </NGrid>
          </NForm>
        </NCollapseItem>
      </NCollapse>
    </NCard>
    <NCard :title="$t('page.manage.radar.requests.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <NButton size="small" :disabled="loading" @click="loadData">
          <template #icon>
            <icon-ic-round-refresh class="text-icon" :class="{ 'animate-spin animate-duration-750': loading }" />
          </template>
        </NButton>
      </template>
      <NDataTable
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1200"
        :loading="loading"
        remote
        :row-key="(row: Api.Radar.RequestRecord) => row.xRequestId"
        :pagination="pagination"
        class="sm:h-full"
      />
    </NCard>
    <RequestDetailDrawer v-model:visible="drawerVisible" :data="detailData" :loading="detailLoading" />
  </div>
</template>
