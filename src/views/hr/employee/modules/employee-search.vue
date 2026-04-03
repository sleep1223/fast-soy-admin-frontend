<script setup lang="ts">
import { toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { statusTypeOptions } from '@/constants/business';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({ name: 'EmployeeSearch' });

interface Props {
  departmentOptions: { label: string; value: number }[];
}

defineProps<Props>();

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const model = defineModel<Api.HrManage.EmployeeSearchParams>('model', { required: true });
const defaultModel = jsonClone(toRaw(model.value));

function resetModel() {
  Object.assign(model.value, defaultModel);
}

function search() {
  emit('search');
}
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse :default-expanded-names="['employee-search']">
      <NCollapseItem :title="$t('common.search')" name="employee-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.hr.employee.name')" path="name" class="pr-24px">
              <NInput v-model:value="model.name" :placeholder="$t('page.hr.employee.form.name')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.hr.employee.department')" path="departmentId" class="pr-24px">
              <NSelect v-model:value="model.departmentId" :options="departmentOptions" clearable :placeholder="$t('page.hr.employee.form.department')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.hr.common.status')" path="status" class="pr-24px">
              <NSelect v-model:value="model.status" :options="translateOptions(statusTypeOptions)" clearable :placeholder="$t('page.hr.common.form.status')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6">
              <NSpace class="w-full" justify="end">
                <NButton @click="resetModel">
                  <template #icon><icon-ic-round-refresh class="text-icon" /></template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon><icon-ic-round-search class="text-icon" /></template>
                  {{ $t('common.search') }}
                </NButton>
              </NSpace>
            </NFormItemGi>
          </NGrid>
        </NForm>
      </NCollapseItem>
    </NCollapse>
  </NCard>
</template>
