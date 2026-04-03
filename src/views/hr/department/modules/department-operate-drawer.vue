<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { jsonClone } from '@sa/utils';
import { statusTypeOptions } from '@/constants/business';
import { fetchAddDepartment, fetchUpdateDepartment } from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'DepartmentOperateDrawer' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.HrManage.Department | null;
}

const props = defineProps<Props>();

interface Emits {
  (e: 'submitted'): void;
}

const emit = defineEmits<Emits>();
const visible = defineModel<boolean>('visible', { default: false });
const { formRef, validate, restoreValidation } = useNaiveForm();
const { defaultRequiredRule } = useFormRules();

const title = computed(() => {
  const titles: Record<NaiveUI.TableOperateType, string> = {
    add: $t('page.hr.department.addDepartment'),
    edit: $t('page.hr.department.editDepartment')
  };
  return titles[props.operateType];
});

const model = ref(createDefaultModel());

function createDefaultModel(): Api.HrManage.DepartmentAddParams {
  return { name: '', code: '', description: '', managerId: null, status: '1' };
}

const rules: Record<string, App.Global.FormRule> = {
  name: defaultRequiredRule,
  code: defaultRequiredRule
};

function handleInitModel() {
  model.value = createDefaultModel();
  if (props.operateType === 'edit' && props.rowData) {
    Object.assign(model.value, jsonClone(props.rowData));
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (props.operateType === 'add') {
    const { error } = await fetchAddDepartment(model.value);
    if (error) return;
    window.$message?.success($t('common.addSuccess'));
  } else {
    const { error } = await fetchUpdateDepartment({ id: props.rowData?.id, ...model.value });
    if (error) return;
    window.$message?.success($t('common.updateSuccess'));
  }
  closeDrawer();
  emit('submitted');
}

watch(visible, () => {
  if (visible.value) {
    handleInitModel();
    restoreValidation();
  }
});
</script>

<template>
  <NDrawer v-model:show="visible" display-directive="show" :width="360">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm ref="formRef" :model="model" :rules="rules">
        <NFormItem :label="$t('page.hr.department.name')" path="name">
          <NInput v-model:value="model.name" :placeholder="$t('page.hr.department.form.name')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.department.code')" path="code">
          <NInput v-model:value="model.code" :placeholder="$t('page.hr.department.form.code')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.department.description')">
          <NInput v-model:value="model.description" type="textarea" :placeholder="$t('page.hr.department.form.description')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.common.status')" path="status">
          <NRadioGroup v-model:value="model.status">
            <NRadio v-for="item in statusTypeOptions" :key="item.value" :value="item.value" :label="$t(item.label)" />
          </NRadioGroup>
        </NFormItem>
      </NForm>
      <template #footer>
        <NSpace :size="16">
          <NButton @click="closeDrawer">{{ $t('common.cancel') }}</NButton>
          <NButton type="primary" @click="handleSubmit">{{ $t('common.confirm') }}</NButton>
        </NSpace>
      </template>
    </NDrawerContent>
  </NDrawer>
</template>
