<script setup lang="tsx">
import { reactive, ref } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { fetchRadarQueries, fetchRadarRequestDetail } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import RequestDetailDrawer from '../requests/modules/request-detail-drawer.vue';

const appStore = useAppStore();

const loading = ref(false);
const data = ref<Api.Radar.QueryRecord[]>([]);
const drawerVisible = ref(false);
const detailData = ref<Api.Radar.RequestDetail | null>(null);
const detailLoading = ref(false);

const searchParams = reactive({
  page: 1,
  page_size: 20,
  slow_only: false,
  threshold_ms: 100
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
  const { error, data: result } = await fetchRadarQueries(searchParams);
  if (!error) {
    data.value = result.records;
    pagination.itemCount = result.total;
  }
  loading.value = false;
}

async function viewDetail(xRequestId: string | null) {
  if (!xRequestId) return;
  drawerVisible.value = true;
  detailLoading.value = true;
  const { error, data: result } = await fetchRadarRequestDetail(xRequestId);
  if (!error) {
    detailData.value = result;
  }
  detailLoading.value = false;
}

function getDurationTagType(ms: number): NaiveUI.ThemeColor {
  if (ms < 50) return 'success';
  if (ms < 100) return 'warning';
  return 'error';
}

function getOperationTagType(op: string | null): NaiveUI.ThemeColor {
  if (!op) return 'default';
  const map: Record<string, NaiveUI.ThemeColor> = {
    SELECT: 'info',
    INSERT: 'success',
    UPDATE: 'warning',
    DELETE: 'error'
  };
  return map[op.toUpperCase()] || 'default';
}

function getMethodTagType(method: string | null): NaiveUI.ThemeColor {
  if (!method) return 'default';
  const map: Record<string, NaiveUI.ThemeColor> = {
    GET: 'success',
    POST: 'info',
    PUT: 'warning',
    PATCH: 'warning',
    DELETE: 'error'
  };
  return map[method.toUpperCase()] || 'default';
}

const columns = [
  {
    key: 'operation',
    title: $t('page.manage.radar.queries.operation'),
    width: 100,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) => (
      <NTag type={getOperationTagType(row.operation)} size="small">
        {row.operation || '-'}
      </NTag>
    )
  },
  {
    key: 'sqlText',
    title: 'SQL',
    minWidth: 280,
    ellipsis: { tooltip: true }
  },
  {
    key: 'params',
    title: 'Params',
    width: 140,
    ellipsis: { tooltip: true },
    render: (row: Api.Radar.QueryRecord) => row.params || '-'
  },
  {
    key: 'durationMs',
    title: $t('page.manage.radar.requests.duration'),
    width: 110,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) => (
      <NTag type={getDurationTagType(row.durationMs)} size="small">
        {row.durationMs.toFixed(2)}ms
      </NTag>
    )
  },
  {
    key: 'requestMethod',
    title: $t('page.manage.radar.requests.method'),
    width: 80,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) =>
      row.requestMethod ? <NTag type={getMethodTagType(row.requestMethod)} size="small">{row.requestMethod}</NTag> : '-'
  },
  {
    key: 'requestPath',
    title: $t('page.manage.radar.requests.path'),
    width: 180,
    ellipsis: { tooltip: true },
    render: (row: Api.Radar.QueryRecord) => row.requestPath || '-'
  },
  {
    key: 'connectionName',
    title: $t('page.manage.radar.queries.connection'),
    width: 110,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) => row.connectionName || '-'
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
    render: (row: Api.Radar.QueryRecord) => (
      <NButton
        type="primary"
        ghost
        size="small"
        disabled={!row.xRequestId}
        onClick={() => viewDetail(row.xRequestId)}
      >
        {$t('common.view')}
      </NButton>
    )
  }
];

loadData();
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('common.search')" :bordered="false" size="small" class="card-wrapper">
      <NForm label-placement="left" :label-width="120">
        <NGrid responsive="screen" item-responsive>
          <NFormItemGi
            span="24 s:12 m:6"
            :label="$t('page.manage.radar.queries.slowOnly')"
            class="pr-24px"
          >
            <NSwitch v-model:value="searchParams.slow_only" />
          </NFormItemGi>
          <NFormItemGi
            span="24 s:12 m:6"
            :label="$t('page.manage.radar.queries.threshold')"
            class="pr-24px"
          >
            <NInputNumber v-model:value="searchParams.threshold_ms" :min="0">
              <template #suffix>ms</template>
            </NInputNumber>
          </NFormItemGi>
          <NFormItemGi span="24 m:6" class="pr-24px">
            <NSpace class="w-full" justify="end">
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
    </NCard>
    <NCard :title="$t('page.manage.radar.queries.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <NButton size="small" :loading="loading" @click="loadData">
          <template #icon>
            <icon-ic-round-refresh class="text-icon" />
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
        :row-key="(row: Api.Radar.QueryRecord) => row.id"
        :pagination="pagination"
        class="sm:h-full"
      />
    </NCard>
    <RequestDetailDrawer v-model:visible="drawerVisible" :data="detailData" :loading="detailLoading" />
  </div>
</template>
