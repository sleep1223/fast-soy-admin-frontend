<script setup lang="tsx">
import { computed, onMounted, reactive, ref } from 'vue';
import { NButton, NPopconfirm } from 'naive-ui';
import { fetchBatchDeleteTag, fetchDeleteTag, fetchGetDictOptions, fetchGetTagList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';
import TagOperateDrawer from './modules/tag-operate-drawer.vue';
import TagSearch from './modules/tag-search.vue';

const appStore = useAppStore();
const { hasAuth } = useAuth();

const searchParams: Api.HrManage.TagSearchParams = reactive({
  current: 1,
  size: 10,
  name: null,
  category: null
});

const categoryOptions = ref<Api.SystemManage.DictionaryOption[]>([]);
const categoryLabelMap = computed(() =>
  Object.fromEntries(categoryOptions.value.map(o => [o.value, o.label]))
);

const { columns, columnChecks, data, loading, getData, getDataByPage, mobilePagination } = useNaivePaginatedTable({
  immediate: false,
  api: () => fetchGetTagList(searchParams),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.current = params.page;
    searchParams.size = params.pageSize;
  },
  columns: () => [
    { type: 'selection', align: 'center', width: 48 },
    { key: 'index', title: $t('common.index'), width: 64, align: 'center', render: (_, index) => index + 1 },
    { key: 'name', title: $t('page.hr.tag.name'), align: 'center', minWidth: 120 },
    {
      key: 'category',
      title: $t('page.hr.tag.category'),
      align: 'center',
      minWidth: 100,
      render: row => categoryLabelMap.value[row.category] ?? row.category
    },
    { key: 'description', title: $t('page.hr.tag.description'), minWidth: 200 },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 130,
      render: row => (
        <div class="flex-center gap-8px">
          {hasAuth('B_HR_TAG_EDIT') && (
            <NButton type="primary" ghost size="small" onClick={() => edit(row.id)}>
              {$t('common.edit')}
            </NButton>
          )}
          {hasAuth('B_HR_TAG_DELETE') && (
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
      )
    }
  ]
});

const { drawerVisible, operateType, editingData, handleAdd, handleEdit, checkedRowKeys, onBatchDeleted, onDeleted } =
  useTableOperate(data, 'id', getData);

onMounted(async () => {
  const { data: dictData } = await fetchGetDictOptions('tag_category');
  if (dictData) categoryOptions.value = dictData;
  await getData();
});

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteTag({ ids: checkedRowKeys.value.map(k => String(k)) });
  if (!error) onBatchDeleted();
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteTag({ id });
  if (!error) onDeleted();
}

function edit(id: string) {
  handleEdit(id);
}
</script>

<template>
  <div class="min-h-500px flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <TagSearch v-model:model="searchParams" :category-options="categoryOptions" @search="getDataByPage" />
    <NCard :title="$t('page.hr.tag.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation v-model:columns="columnChecks" :loading="loading" @refresh="getData">
          <NButton v-if="hasAuth('B_HR_TAG_CREATE')" size="small" ghost type="primary" @click="handleAdd">
            <template #icon><icon-ic-round-plus class="text-icon" /></template>
            {{ $t('common.add') }}
          </NButton>
          <NPopconfirm v-if="hasAuth('B_HR_TAG_DELETE')" @positive-click="handleBatchDelete">
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
        :scroll-x="600"
        :loading="loading"
        remote
        :row-key="row => row.id"
        :pagination="mobilePagination"
        class="sm:h-full"
      />
      <TagOperateDrawer
        v-model:visible="drawerVisible"
        :operate-type="operateType"
        :row-data="editingData"
        :category-options="categoryOptions"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>
