<script setup lang="tsx">
import { h, ref } from 'vue';
import type { Ref } from 'vue';
import { NButton, NCheckbox, NPopconfirm, NSwitch, NTag } from 'naive-ui';
import { useBoolean } from '@sa/hooks';
import { yesOrNoRecord } from '@/constants/common';
import { menuTypeRecord, statusTypeRecord } from '@/constants/business';
import { fetchBatchDeleteMenu, fetchDeleteMenu, fetchGetAllPages, fetchGetMenuList } from '@/service/api';
import { useAppStore } from '@/store/modules/app';
import { defaultTransform, useNaivePaginatedTable, useTableOperate } from '@/hooks/common/table';
import { $t } from '@/locales';
import SvgIcon from '@/components/custom/svg-icon.vue';
import MenuOperateModal, { type OperateType } from './modules/menu-operate-modal.vue';

const appStore = useAppStore();

const { bool: visible, setTrue: openModal } = useBoolean();

const wrapperRef = ref<HTMLElement | null>(null);

const SHOW_BUSINESS_WARNING_KEY = 'menu:showBusinessWarningDismissed';

const searchParams = ref<Api.SystemManage.MenuSearchParams>({
  current: 1,
  size: 10,
  includeConstant: false,
  includeHidden: false,
  includeBusiness: false
});

const { columns, columnChecks, data, loading, pagination, getData, getDataByPage } = useNaivePaginatedTable({
  api: () => fetchGetMenuList(searchParams.value),
  transform: response => defaultTransform(response),
  onPaginationParamsChange: params => {
    searchParams.value.current = params.page ?? 1;
    searchParams.value.size = params.pageSize ?? 10;
  },
  columns: () => [
    {
      type: 'selection',
      align: 'center',
      width: 48
    },
    {
      key: 'id',
      title: $t('page.manage.menu.id'),
      align: 'center'
    },
    {
      key: 'menuType',
      title: $t('page.manage.menu.menuType'),
      align: 'center',
      width: 80,
      render: row => {
        const tagMap: Record<Api.SystemManage.MenuType, NaiveUI.ThemeColor> = {
          1: 'default',
          2: 'primary'
        };

        const label = $t(menuTypeRecord[row.menuType]);

        return <NTag type={tagMap[row.menuType]}>{label}</NTag>;
      }
    },
    {
      key: 'menuName',
      title: $t('page.manage.menu.menuName'),
      align: 'center',
      minWidth: 120,
      render: row => {
        const { i18nKey, menuName } = row;

        const label = i18nKey ? $t(i18nKey) : menuName;

        return <span>{label}</span>;
      }
    },
    {
      key: 'icon',
      title: $t('page.manage.menu.icon'),
      align: 'center',
      width: 60,
      render: row => {
        const icon = row.iconType === '1' ? row.icon : undefined;

        const localIcon = row.iconType === '2' ? row.icon : undefined;

        return (
          <div class="flex-center">
            <SvgIcon icon={icon} localIcon={localIcon} class="text-icon" />
          </div>
        );
      }
    },
    {
      key: 'routeName',
      title: $t('page.manage.menu.routeName'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'routePath',
      title: $t('page.manage.menu.routePath'),
      align: 'center',
      minWidth: 120
    },
    {
      key: 'statusType',
      title: $t('page.manage.menu.menuStatusType'),
      align: 'center',
      width: 80,
      render: row => {
        if (row.statusType === null) {
          return null;
        }

        const tagMap: Record<Api.Common.EnableStatus, NaiveUI.ThemeColor> = {
          1: 'success',
          2: 'warning'
        };

        const label = $t(statusTypeRecord[row.statusType]);

        return <NTag type={tagMap[row.statusType]}>{label}</NTag>;
      }
    },
    {
      key: 'hideInMenu',
      title: $t('page.manage.menu.hideInMenu'),
      align: 'center',
      width: 80,
      render: row => {
        const hide: CommonType.YesOrNo = row.hideInMenu ? 'Y' : 'N';

        const tagMap: Record<CommonType.YesOrNo, NaiveUI.ThemeColor> = {
          Y: 'error',
          N: 'default'
        };

        const label = $t(yesOrNoRecord[hide]);

        return <NTag type={tagMap[hide]}>{label}</NTag>;
      }
    },
    {
      key: 'parentId',
      title: $t('page.manage.menu.parentId'),
      width: 90,
      align: 'center'
    },
    {
      key: 'order',
      title: $t('page.manage.menu.order'),
      align: 'center',
      width: 60
    },
    {
      key: 'operate',
      title: $t('common.operate'),
      align: 'center',
      width: 230,
      render: row => (
        <div class="flex-center justify-end gap-8px">
          {row.menuType === '1' && (
            <NButton type="primary" ghost size="small" onClick={() => handleAddChildMenu(row)}>
              {$t('page.manage.menu.addChildMenu')}
            </NButton>
          )}
          <NButton type="primary" ghost size="small" onClick={() => handleEdit(row)}>
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

const { checkedRowKeys, onBatchDeleted, onDeleted } = useTableOperate(data, 'id', getData);

const operateType = ref<OperateType>('add');

function handleAdd() {
  operateType.value = 'add';
  openModal();
}

async function handleBatchDelete() {
  const { error } = await fetchBatchDeleteMenu({ ids: checkedRowKeys.value as string[] });
  if (!error) {
    onBatchDeleted();
  }
}

async function handleDelete(id: string) {
  const { error } = await fetchDeleteMenu({ id });
  if (!error) {
    onDeleted();
  }
}

/** the edit menu data or the parent menu data when adding a child menu */
const editingData: Ref<Api.SystemManage.Menu | null> = ref(null);

function handleEdit(item: Api.SystemManage.Menu) {
  operateType.value = 'edit';
  editingData.value = { ...item };

  openModal();
}

function handleAddChildMenu(item: Api.SystemManage.Menu) {
  operateType.value = 'addChild';

  editingData.value = { ...item };

  openModal();
}

const allPages = ref<string[]>([]);

async function getAllPages() {
  const { data: pages } = await fetchGetAllPages();
  allPages.value = pages?.map(item => item.value) || [];
}

function init() {
  getAllPages();
}

// init
init();

function handleIncludeBusinessUpdate(val: boolean) {
  if (!val) {
    searchParams.value.includeBusiness = false;
    getDataByPage();
    return;
  }

  if (localStorage.getItem(SHOW_BUSINESS_WARNING_KEY) === '1') {
    searchParams.value.includeBusiness = true;
    getDataByPage();
    return;
  }

  let dontShowAgain = false;

  window.$dialog?.warning({
    title: $t('page.manage.menu.includeBusinessWarningTitle'),
    content: () =>
      h('div', { class: 'flex-col gap-12px' }, [
        h('div', $t('page.manage.menu.includeBusinessWarning')),
        h(
          NCheckbox,
          {
            checked: dontShowAgain,
            'onUpdate:checked': (v: boolean) => {
              dontShowAgain = v;
            }
          },
          { default: () => $t('page.manage.menu.dontShowAgain') }
        )
      ]),
    positiveText: $t('common.confirm'),
    negativeText: $t('common.cancel'),
    onPositiveClick: () => {
      if (dontShowAgain) {
        localStorage.setItem(SHOW_BUSINESS_WARNING_KEY, '1');
      }
      searchParams.value.includeBusiness = true;
      getDataByPage();
    }
  });
}

function handleIncludeConstantUpdate(val: boolean) {
  searchParams.value.includeConstant = val;
  getDataByPage();
}

function handleIncludeHiddenUpdate(val: boolean) {
  searchParams.value.includeHidden = val;
  getDataByPage();
}
</script>

<template>
  <div ref="wrapperRef" class="flex-col-stretch gap-16px overflow-hidden lt-sm:overflow-auto">
    <NCard :title="$t('page.manage.menu.title')" :bordered="false" size="small" class="card-wrapper sm:flex-1-hidden">
      <template #header-extra>
        <TableHeaderOperation
          v-model:columns="columnChecks"
          :disabled-delete="checkedRowKeys.length === 0"
          :loading="loading"
          @add="handleAdd"
          @delete="handleBatchDelete"
          @refresh="getData"
        >
          <template #prefix>
            <NSpace align="center" :size="16" class="mr-8px">
              <NSpace align="center" :size="6">
                <span class="text-12px">{{ $t('page.manage.menu.constant') }}</span>
                <NSwitch
                  size="small"
                  :value="searchParams.includeConstant"
                  @update:value="handleIncludeConstantUpdate"
                />
              </NSpace>
              <NSpace align="center" :size="6">
                <span class="text-12px">{{ $t('page.manage.menu.hideInMenu') }}</span>
                <NSwitch size="small" :value="searchParams.includeHidden" @update:value="handleIncludeHiddenUpdate" />
              </NSpace>
              <NSpace align="center" :size="6">
                <span class="text-12px">{{ $t('page.manage.menu.includeBusiness') }}</span>
                <NSwitch
                  size="small"
                  :value="searchParams.includeBusiness"
                  @update:value="handleIncludeBusinessUpdate"
                />
              </NSpace>
            </NSpace>
          </template>
        </TableHeaderOperation>
      </template>
      <NDataTable
        v-model:checked-row-keys="checkedRowKeys"
        :columns="columns"
        :data="data"
        size="small"
        :flex-height="!appStore.isMobile"
        :scroll-x="1088"
        :loading="loading"
        :row-key="row => row.id"
        remote
        :pagination="pagination"
        class="sm:h-full"
      />
      <MenuOperateModal
        v-model:visible="visible"
        :operate-type="operateType"
        :row-data="editingData"
        :all-pages="allPages"
        @submitted="getDataByPage"
      />
    </NCard>
  </div>
</template>

<style scoped></style>
