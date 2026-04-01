<script setup lang="tsx">
import { reactive, ref } from 'vue';
import { NButton, NSwitch, NTag } from 'naive-ui';
import { fetchRadarExceptionResolve, fetchRadarExceptions } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import AnsiTraceback from '@/components/common/ansi-traceback.vue';

const appStore = useAppStore();

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

const loading = ref(false);
const data = ref<Api.Radar.ExceptionRecord[]>([]);
const drawerVisible = ref(false);
const selectedRow = ref<Api.Radar.ExceptionRecord | null>(null);

const searchParams = reactive({
  page: 1,
  page_size: 20,
  path_filter: null as string | null,
  error_type: null as string | null,
  resolved: null as boolean | null
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
  const { error, data: result } = await fetchRadarExceptions(searchParams);
  if (!error) {
    data.value = result.records;
    pagination.itemCount = result.total;
  }
  loading.value = false;
}

function viewDetail(row: Api.Radar.ExceptionRecord) {
  selectedRow.value = row;
  drawerVisible.value = true;
}

function resetSearch() {
  searchParams.path_filter = null;
  searchParams.error_type = null;
  searchParams.resolved = null;
  searchParams.page = 1;
  pagination.page = 1;
  loadData();
}

async function toggleResolved(row: Api.Radar.ExceptionRecord) {
  const newVal = !row.resolved;
  const { error } = await fetchRadarExceptionResolve(row.xRequestId, newVal);
  if (!error) {
    row.resolved = newVal;
  }
}

const columns = [
  {
    key: 'method',
    title: $t('page.manage.radar.requests.method'),
    width: 80,
    align: 'center' as const,
    render: (row: Api.Radar.ExceptionRecord) => (
      <NTag type={getMethodTagType(row.method)} size="small">
        {row.method}
      </NTag>
    )
  },
  {
    key: 'path',
    title: $t('page.manage.radar.requests.path'),
    minWidth: 200,
    ellipsis: { tooltip: true }
  },
  {
    key: 'errorType',
    title: $t('page.manage.radar.exceptions.errorType'),
    width: 180,
    ellipsis: { tooltip: true },
    render: (row: Api.Radar.ExceptionRecord) => <NTag type="error" size="small">{row.errorType}</NTag>
  },
  {
    key: 'errorMessage',
    title: $t('page.manage.radar.exceptions.errorMessage'),
    minWidth: 200,
    ellipsis: { tooltip: true }
  },
  {
    key: 'durationMs',
    title: $t('page.manage.radar.requests.duration'),
    width: 100,
    align: 'center' as const,
    render: (row: Api.Radar.ExceptionRecord) => (row.durationMs !== null ? `${row.durationMs.toFixed(1)}ms` : '-')
  },
  {
    key: 'resolved',
    title: $t('page.manage.radar.exceptions.status'),
    width: 120,
    align: 'center' as const,
    render: (row: Api.Radar.ExceptionRecord) => (
      <NSwitch
        value={row.resolved}
        size="small"
        onUpdateValue={() => toggleResolved(row)}
      >
        {{
          checked: () => $t('page.manage.radar.exceptions.resolved'),
          unchecked: () => $t('page.manage.radar.exceptions.unresolved')
        }}
      </NSwitch>
    )
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
    render: (row: Api.Radar.ExceptionRecord) => (
      <NButton type="primary" ghost size="small" onClick={() => viewDetail(row)}>
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
        <NCollapseItem :title="$t('common.search')" name="exception-search">
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
                :label="$t('page.manage.radar.exceptions.errorType')"
                class="pr-24px"
              >
                <NInput v-model:value="searchParams.error_type" clearable />
              </NFormItemGi>
              <NFormItemGi
                span="24 s:12 m:6"
                :label="$t('page.manage.radar.exceptions.status')"
                class="pr-24px"
              >
                <NSelect
                  v-model:value="(searchParams.resolved as any)"
                  clearable
                  :options="(([
                    { label: $t('page.manage.radar.exceptions.resolved'), value: true },
                    { label: $t('page.manage.radar.exceptions.unresolved'), value: false }
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
    <NCard :title="$t('page.manage.radar.exceptions.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :row-key="(row: Api.Radar.ExceptionRecord) => row.xRequestId"
        :pagination="pagination"
        class="sm:h-full"
      />
    </NCard>

    <NDrawer v-model:show="drawerVisible" :width="600" display-directive="show">
      <NDrawerContent :title="$t('page.manage.radar.exceptions.detail')" :native-scrollbar="false" closable>
        <template v-if="selectedRow">
          <NDescriptions :column="1" label-placement="left" bordered size="small">
            <NDescriptionsItem :label="$t('page.manage.radar.requests.method')">
              {{ selectedRow.method }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.path')">
              {{ selectedRow.path }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.exceptions.errorType')">
              <NTag type="error">{{ selectedRow.errorType }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.exceptions.errorMessage')">
              {{ selectedRow.errorMessage }}
            </NDescriptionsItem>
          </NDescriptions>
          <NDivider>Traceback</NDivider>
          <AnsiTraceback v-if="selectedRow.errorTraceback" :code="selectedRow.errorTraceback" />
          <NEmpty v-else />
        </template>
      </NDrawerContent>
    </NDrawer>
  </div>
</template>
