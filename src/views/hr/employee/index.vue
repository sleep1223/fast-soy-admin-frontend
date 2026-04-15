<script setup lang="tsx">
import { onMounted, reactive, ref } from 'vue';
import { NButton, NPopconfirm, NTag } from 'naive-ui';
import { employeeNextStatus, employeeStatusRecord, employeeStatusTagType, employeeTransitionLabel } from '@/constants/business';
import {
  fetchBatchDeleteEmployee,
  fetchDeleteEmployee,
  fetchGetDepartmentList,
  fetchGetEmployeeList,
  fetchGetTagList,
  fetchTransitionEmployee
} from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import EmployeeOperateDrawer from './modules/employee-operate-drawer.vue';
import EmployeeSearch from './modules/employee-search.vue';

const appStore = useAppStore();
const { hasAuth } = useAuth();

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
      key: 'tagNames',
      title: $t('page.hr.employee.tags'),
      minWidth: 150,
      render: row => (row.tagNames || []).map((s: string) => <NTag size="small" class="mr-4px">{s}</NTag>)
    },
    {
      key: 'status',
      title: $t('page.hr.common.status'),
      align: 'center',
      width: 90,
      render: row => {
        if (!row.status) return null;
        return <NTag type={employeeStatusTagType[row.status]}>{$t(employeeStatusRecord[row.status])}</NTag>;
      }
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 220,
      render: row => {
        const next = employeeNextStatus[row.status];
        const label = next ? employeeTransitionLabel[row.status] : null;
        return (
          <div class="flex-center gap-8px">
            {next && label && hasAuth('B_HR_EMP_TRANSITION') && (
              <NPopconfirm onPositiveClick={() => handleTransition(row.id, next)}>
                {{
                  default: () => $t('page.hr.employee.transition.confirm'),
                  trigger: () => (
                    <NButton type="info" ghost size="small">
                      {$t(label)}
                    </NButton>
                  )
                }}
              </NPopconfirm>
            )}
            {hasAuth('B_HR_EMP_EDIT') && (
              <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
                {$t('common.edit')}
              </NButton>
            )}
            {hasAuth('B_HR_EMP_DELETE') && (
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
            )}
          </div>
        );
      }
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'id', getData);

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteEmployee({ ids: checkedRowKeys.value.map(k => String(k)) });
  if (!error) onBatchDeleted();
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteEmployee({ id });
  if (!error) onDeleted();
}

async function handleTransition(id: string, toState: Api.HrManage.EmployeeStatus) {
  const { error } = await fetchTransitionEmployee(id, { toState });
  if (error) return;
  window.$message?.success($t('page.hr.employee.transition.success'));
  getData();
}

function edit(id: string) {
  handleEdit(id);
}

// Load departments & tags for search filter and edit form
const departmentOptions = ref<{ label: string; value: string }[]>([]);
const tagOptions = ref<{ label: string; value: string }[]>([]);
onMounted(async () => {
  const [{ data: deptData }, { data: tagData }] = await Promise.all([
    fetchGetDepartmentList({ current: 1, size: 999 }),
    fetchGetTagList({ current: 1, size: 999 })
  ]);
  if (deptData?.records) {
    departmentOptions.value = deptData.records.map((d: Api.HrManage.Department) => ({ label: d.name, value: d.id }));
  }
  if (tagData?.records) {
    tagOptions.value = tagData.records.map((s: Api.HrManage.Tag) => ({ label: s.name, value: s.id }));
  }
});
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <EmployeeSearch v-model:model="searchParams" :department-options="departmentOptions" @search="getDataByPage" />
    <NCard :title="$t('page.hr.employee.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData">
          <NButton v-if="hasAuth('B_HR_EMP_CREATE')" size="small" ghost type="primary" @click="handleAdd">
            <template #icon><icon-ic-round-plus class="text-icon" /></template>
            {{ $t('common.add') }}
          </NButton>
          <NPopconfirm v-if="hasAuth('B_HR_EMP_DELETE')" @positive-click="handleBatchDelete">
            <template #trigger>
              <NButton size="small" ghost type="error" :disabled="checkedRowKeys.length === 0">
                <template #icon><icon-ic-round-delete class="text-icon" /></template>
                {{ $t('common.batchDelete') }}
              </NButton>
            </template>
            {{ $t('common.confirmDelete') }}
          </NPopconfirm>
        </TableHeaderOperation>
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
        :tag-options="tagOptions"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
