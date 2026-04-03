<script setup lang="tsx">
import { reactive } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { statusTypeRecord } from '@/constants/business';
import { fetchBatchDeleteDepartment, fetchDeleteDepartment, fetchGetDepartmentList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import DepartmentOperateDrawer from './modules/department-operate-drawer.vue';
import DepartmentSearch from './modules/department-search.vue';

const appStore = useAppStore();

const searchParams: Api.HrManage.DepartmentSearchParams = reactive({
  current: 1,
  size: 10,
  name: null,
  code: null,
  status: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetDepartmentList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { type: 'selection', align: 'center', width: 48 },
    { key: 'index', title: $t('common.index'), width: 64, align: 'center', render: (_, index) => index + 1 },
    { key: 'name', title: $t('page.hr.department.name'), align: 'center', minWidth: 120 },
    { key: 'code', title: $t('page.hr.department.code'), align: 'center', minWidth: 100 },
    { key: 'description', title: $t('page.hr.department.description'), minWidth: 180 },
    {
      key: 'status',
      title: $t('page.hr.common.status'),
      align: 'center',
      width: 80,
      render: row => {
        if (!row.status) return null;
        const tagMap: Record<string, NaiveUI.ThemeColor> = { 1: 'success', 2: 'warning' };
        return <NTag type={tagMap[row.status]}>{$t(statusTypeRecord[row.status as Api.Common.EnableStatus])}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
            {$t('common.edit')}
          </NButton>
          <NPopconfirm onPositiveClick={() => handleDelete(row.id)}>
            {{
              default: () => $t('common.confirmDelete'),
              trigger: () => (
                <NButton type="error" ghost size="small">
                  {$t('common.delete')}
                </NButton>
              )
            }}
          </NPopconfirm>
        </div>
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteDepartment({ ids: checkedRowKeys.value as number[] });
  if (!error) onBatchDeleted();
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteDepartment({ id });
  if (!error) onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <DepartmentSearch v-model:model="searchParams" @search="getDataByPage" />
    <NCard :title="$t('page.hr.department.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        />
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="700"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <DepartmentOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
