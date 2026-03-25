<script setup lang="tsx">
import { reactive, watch } from 'vue';
import { NButton, NTag } from 'naive-ui';
import { logDetailTypeRecord, logTypeRecord } from '@/constants/business';
import { fetchBatchDeleteLog, fetchGetLogList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import LogOperateDrawer from './modules/log-operate-drawer.vue';
import LogSearch from './modules/log-search.vue';

const appStore = useAppStore();

const defaultSearchParams: Api.SystemManage.LogSearchParams = {
  current: 1,
  size: 10,
  logType: '2',
  byUser: null,
  logDetailType: null,
  requestDomain: null,
  requestPath: null,
  createTime: null,
  responseCode: null,
  xRequestId: null,
  timeRange: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 0)]
};

const searchParams: Api.SystemManage.LogSearchParams = reactive({ ...defaultSearchParams });

const { columns, columnChecks, data, getData, getDataByPage, loading, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetLogList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'index',
      title: $t('common.index'),
      align: 'center',
      width: 64,
      render: (_, index) => index + 1
    },
    {
      key: 'requestDomain',
      title: $t('page.manage.log.requestDomain'),
      align: 'center',
      width: 300
    },
    {
      key: 'requestPath',
      title: $t('page.manage.log.requestPath'),
      align: 'center',
      width: 300
    },
    {
      key: 'byUserInfo.nickName' as 'byUser',
      title: $t('page.manage.log.byUser'),
      align: 'center',
      width: 100
    },
    {
      key: 'logDetailType',
      title: $t('page.manage.log.logDetailType'),
      align: 'center',
      minWidth: 50,
      render: row => {
        if (row.logDetailType) {
          const label = $t(logDetailTypeRecord[row.logDetailType]);
          return <NTag type="default">{label}</NTag>;
        }
        return null;
      }
    },
    {
      key: 'logType',
      title: $t('page.manage.log.logType'),
      align: 'center',
      width: 100,
      render: row => {
        const tagMap: Record<Api.SystemManage.logTypes, NaiveUI.ThemeColor> = {
          1: 'default',
          2: 'error',
          3: 'primary',
          4: 'info'
        };

        const label = $t(logTypeRecord[row.logType]);

        return <NTag type={tagMap[row.logType]}>{label}</NTag>;
      }
    },
    {
      key: 'fmtCreateTime',
      title: $t('page.manage.log.createTime'),
      align: 'center',
      width: 200
    },
    {
      key: 'responseCode',
      title: $t('page.manage.log.responseCode'),
      align: 'center',
      width: 100
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.view')}
          </NButton>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, checkedRowKeys, onBatchDeleted, editingData, handleEdit } = useTableOperate(
  data,
  'id',
  getData
);
const { hasAuth } = useAuth();

function resetSearchParams() {
  Object.assign(searchParams, {
    ...defaultSearchParams,
    timeRange: [new Date().setHours(0, 0, 0, 0), new Date().setHours(23, 59, 59, 0)]
  });
  getDataByPage(1);
}

async function handleadd() {
  window.$message?.error('Not supported');
}

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteLog({ ids: checkedRowKeys.value });
  if (!error) {
    onBatchDeleted();
  }
}

function edit(id: number) {
  handleEdit(id);
}

watch(
  () => searchParams.logType,
  newValue => {
    const apiKeysToCheck = ['requestDomain', 'requestPath'];
    let checkedAction: boolean;
    if (newValue !== '1') {
      checkedAction = false;
    } else {
      checkedAction = true;
    }

    columnChecks.value.forEach(item => {
      if (apiKeysToCheck.includes(item.key)) {
        item.checked = checkedAction;
      }
    });

    const nonApiKeysToCheck = ['byUserInfo.nickName', 'logDetailType'];
    if (newValue === '1') {
      checkedAction = false;
    } else {
      checkedAction = true;
    }

    columnChecks.value.forEach(item => {
      if (nonApiKeysToCheck.includes(item.key)) {
        item.checked = checkedAction;
      }
    });
  },
  { immediate: true }
);
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <LogSearch v-model:model="searchParams" @reset="resetSearchParams" @search="getData" />
    <NCard :title="$t('page.manage.log.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          table-id="log"
          @add="handleadd"
          @delete="handleBatchDelete"
          @refresh="getData"
        >
          <template #default><span v-if="!hasAuth('B_Add_Del_Batch-del')"></span></template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="962"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <LogOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getData"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
