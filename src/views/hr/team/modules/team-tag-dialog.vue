<script setup lang="ts">
import { ref, watch } from 'vue';
import { $t } from '@/locales';

defineOptions({ name: 'TeamTagDialog' });

interface Props {
  target: Api.HrManage.Employee | null;
  tagOptions: { label: string; value: string }[];
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted', tagIds: string[]): void;
}

const emit = defineEmits<Emits>();
const visible = defineModel<boolean>('visible', { default: false });

const selected = ref<string[]>([]);

watch(visible, () => {
  if (visible.value) {
    selected.value = props.target?.tagIds ? [...props.target.tagIds] : [];
  }
});

function submit() {
  emit('submitted', selected.value);
}
</script>

<template>
  <NModal
    v-model:show="visible"
    preset="dialog"
    :title="`${$t('page.hr.team.editTags')} - ${target?.name ?? ''}`"
    :show-icon="false"
  >
    <NSelect
      v-model:value="selected"
      :options="tagOptions"
      multiple
      clearable
      :placeholder="$t('page.hr.employee.form.tags')"
    />
    <template #action>
      <NButton @click="visible = false">{{ $t('common.cancel') }}</NButton>
      <NButton type="primary" @click="submit">{{ $t('common.confirm') }}</NButton>
    </template>
  </NModal>
</template>
