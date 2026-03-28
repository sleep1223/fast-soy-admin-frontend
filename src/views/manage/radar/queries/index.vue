<script setup lang="tsx">
import { reactive, ref } from 'vue';
import { NTag } from 'naive-ui';
import { fetchRadarQueries } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';

const appStore = useAppStore();

const loading = ref(false);
const data = ref<Api.Radar.QueryRecord[]>([]);

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

function getDurationTagType(ms: number): NaiveUI.ThemeColor {
  if (ms < 50) return 'success';
  if (ms < 100) return 'warning';
  return 'error';
}

const columns = [
  {
    key: 'index',
    title: $t('common.index'),
    width: 64,
    align: 'center' as const,
    render: (_: Api.Radar.QueryRecord, index: number) => index + 1
  },
  {
    key: 'operation',
    title: $t('page.manage.radar.queries.operation'),
    width: 100,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) => <NTag size="small">{row.operation || '-'}</NTag>
  },
  {
    key: 'sqlText',
    title: 'SQL',
    minWidth: 300,
    ellipsis: { tooltip: true }
  },
  {
    key: 'durationMs',
    title: $t('page.manage.radar.requests.duration'),
    width: 120,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) => (
      <NTag type={getDurationTagType(row.durationMs)} size="small">
        {row.durationMs.toFixed(2)}ms
      </NTag>
    )
  },
  {
    key: 'connectionName',
    title: $t('page.manage.radar.queries.connection'),
    width: 120,
    align: 'center' as const,
    render: (row: Api.Radar.QueryRecord) => row.connectionName || '-'
  },
  {
    key: 'fmtCreatedAt',
    title: $t('page.manage.radar.requests.createdAt'),
    width: 180,
    align: 'center' as const
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
        :scroll-x="800"
        :loading="loading"
        remote
        :row-key="(row: Api.Radar.QueryRecord) => row.id"
        :pagination="pagination"
        class="sm:h-full"
      />
    </NCard>
  </div>
</template>
