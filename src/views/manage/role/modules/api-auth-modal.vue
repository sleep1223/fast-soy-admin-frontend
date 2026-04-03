<script setup lang="ts">
import { computed, shallowRef, watch } from 'vue';
import { fetchGetApiTree, fetchGetRoleApi, fetchUpdateRoleApi } from '@/service/api';
import { $t } from '@/locales';

defineOptions({
  name: 'ApiAuthModal'
});

interface Props {
  /** the roleId */
  roleId: number;
}

const props = defineProps<Props>();

const visible = defineModel<boolean>('visible', {
  default: false
});

function closeModal() {
  visible.value = false;
}

const title = computed(() => $t('common.edit') + $t('page.manage.role.apiAuth'));

const tree = shallowRef<Api.SystemManage.ApiTree[]>([]);

async function getTree() {
  const { error, data } = await fetchGetApiTree();
  if (!error) {
    tree.value = data;
  }
}

const byRoleApiIds = shallowRef<number[]>([]);

async function getChecks() {
  const { error, data } = await fetchGetRoleApi({ id: props.roleId });
  if (!error) {
    byRoleApiIds.value = data.byRoleApiIds || [];
  }
}

async function handleSubmit() {
  // console.log(byRoleApiIds.value, props.roleId);
  // request
  const { error } = await fetchUpdateRoleApi({
    id: props.roleId,
    byRoleApiIds: byRoleApiIds.value.filter(item => typeof item === 'number')
  });
  if (error) return;
  window.$message?.success?.($t('common.modifySuccess'));

  closeModal();
}

function init() {
  getChecks();
  getTree();
}

watch(visible, val => {
  if (val) {
    init();
  }
});
</script>

<template>
  <NModal v-model:show="visible" :title="title" preset="card" class="w-480px">
    <NTree
      v-model:checked-keys="byRoleApiIds"
      :data="tree"
      key-field="id"
      label-field="summary"
      default-expand-all
      block-line
      cascade
      checkable
      expand-on-click
      virtual-scroll
      class="h-280px"
    />
    <template #footer>
      <NSpace justify="end">
        <NButton size="small" class="mt-16px" @click="closeModal">
          {{ $t('common.cancel') }}
        </NButton>
        <NButton type="primary" size="small" class="mt-16px" @click="handleSubmit">
          {{ $t('common.confirm') }}
        </NButton>
      </NSpace>
    </template>
  </NModal>
</template>

<style scoped></style>
