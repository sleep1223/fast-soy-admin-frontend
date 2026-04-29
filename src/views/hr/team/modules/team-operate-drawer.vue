<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import {
  fetchAddTeamEmployee,
  fetchGetEmployee,
  fetchUpdateTeamEmployee
} from '@/service/api';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

defineOptions({ name: 'TeamOperateDrawer' });

interface Props {
  operateType: NaiveUI.TableOperateType;
  rowData?: Api.HrManage.Employee | null;
  tagOptions: { label: string; value: string }[];
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
    add: $t('page.hr.team.addSubordinate'),
    edit: $t('page.hr.team.editSubordinate')
  };
  return titles[props.operateType];
});

const isAdd = computed(() => props.operateType === 'add');

const addModel = ref(createAddModel());
const editModel = ref(createEditModel());

function createAddModel(): Api.HrManage.EmployeeAddParams {
  return { userName: '', name: '', email: '', userGender: null, tagIds: [] };
}
function createEditModel(): Api.HrManage.EmployeeUpdateParams {
  return { id: undefined, name: '', email: '', phone: '', position: '', tagIds: [] };
}

const addRules: Record<string, App.Global.FormRule> = {
  userName: defaultRequiredRule,
  name: defaultRequiredRule,
  email: defaultRequiredRule
};
const editRules: Record<string, App.Global.FormRule> = {
  name: defaultRequiredRule
};

async function handleInitModel() {
  addModel.value = createAddModel();
  editModel.value = createEditModel();
  if (props.operateType === 'edit' && props.rowData) {
    const { data } = await fetchGetEmployee(props.rowData.id);
    if (data) {
      Object.assign(editModel.value, data);
    }
  }
}

function closeDrawer() {
  visible.value = false;
}

async function handleSubmit() {
  await validate();
  if (isAdd.value) {
    const { error } = await fetchAddTeamEmployee(addModel.value);
    if (error) return;
    window.$message?.success($t('common.addSuccess'));
  } else {
    const { error } = await fetchUpdateTeamEmployee(editModel.value);
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
  <NDrawer v-model:show="visible" display-directive="show" :width="400">
    <NDrawerContent :title="title" :native-scrollbar="false" closable>
      <NForm v-if="isAdd" ref="formRef" :model="addModel" :rules="addRules">
        <NFormItem :label="$t('page.hr.employee.userName')" path="userName">
          <NInput v-model:value="addModel.userName" :placeholder="$t('page.hr.employee.form.userName')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.name')" path="name">
          <NInput v-model:value="addModel.name" :placeholder="$t('page.hr.employee.form.name')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.email')" path="email">
          <NInput v-model:value="addModel.email" :placeholder="$t('page.hr.employee.form.email')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.tags')">
          <NSelect
            v-model:value="addModel.tagIds"
            :options="props.tagOptions"
            multiple
            clearable
            :placeholder="$t('page.hr.employee.form.tags')"
          />
        </NFormItem>
      </NForm>
      <NForm v-else ref="formRef" :model="editModel" :rules="editRules">
        <NFormItem :label="$t('page.hr.employee.name')" path="name">
          <NInput v-model:value="editModel.name" :placeholder="$t('page.hr.employee.form.name')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.email')">
          <NInput v-model:value="editModel.email" :placeholder="$t('page.hr.employee.form.email')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.phone')">
          <NInput v-model:value="editModel.phone" :placeholder="$t('page.hr.employee.form.phone')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.position')">
          <NInput v-model:value="editModel.position" :placeholder="$t('page.hr.employee.form.position')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.tags')">
          <NSelect
            v-model:value="editModel.tagIds"
            :options="props.tagOptions"
            multiple
            clearable
            :placeholder="$t('page.hr.employee.form.tags')"
          />
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
