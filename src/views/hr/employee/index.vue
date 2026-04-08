<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { statusTypeRecord } from '@/constants/business';
import { fetchBatchDeleteEmployee, fetchDeleteEmployee, fetchGetDepartmentList, fetchGetEmployeeList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import EmployeeOperateDrawer from './modules/employee-operate-drawer.vue';
import EmployeeSearch from './modules/employee-search.vue';

const appStore = useAppStore();

const searchParams: Api.HrManage.EmployeeSearchParams = reactive({
  current: 1,
  size: 10,
  name: null,
  status: null,
  departmentId: null
});

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  api: () => fetchGetEmployeeList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { type: 'selection', align: 'center', width: 48 },
    { key: 'index', title: $t('common.index'), width: 64, align: 'center', render: (_, index) => index + 1 },
    { key: 'name', title: $t('page.hr.employee.name'), align: 'center', minWidth: 100 },
    { key: 'employeeNo', title: $t('page.hr.employee.employeeNo'), align: 'center', minWidth: 100 },
    { key: 'email', title: $t('page.hr.employee.email'), minWidth: 160 },
    { key: 'position', title: $t('page.hr.employee.position'), minWidth: 100 },
    { key: 'departmentName', title: $t('page.hr.employee.department'), align: 'center', minWidth: 100 },
    {
      key: 'skillNames',
      title: $t('page.hr.employee.skills'),
      minWidth: 150,
      render: row => (row.skillNames || []).map((s: string) => <NTag size="small" class="mr-4px">{s}</NTag>)
    },
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
  const { error } = await fetchBatchDeleteEmployee({ ids: checkedRowKeys.value.map(k => Number(k)) });
  if (!error) onBatchDeleted();
}

async function handleDelete(id: number) {
  const { error } = await fetchDeleteEmployee({ id });
  if (!error) onDeleted();
}

function edit(id: number) {
  handleEdit(id);
}

// Load departments for search filter
const departmentOptions = ref<{ label: string; value: number }[]>([]);
onMounted(async () => {
  const { data: deptData } = await fetchGetDepartmentList({ current: 1, size: 999 });
  if (deptData?.records) {
    departmentOptions.value = deptData.records.map((d: Api.HrManage.Department) => ({ label: d.name, value: d.id }));
  }
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <EmployeeSearch v-model:model="searchParams" :department-options="departmentOptions" @search="getDataByPage" />
    <NCard :title="$t('page.hr.employee.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
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
        :scroll-x="1000"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <EmployeeOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :department-options="departmentOptions"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
