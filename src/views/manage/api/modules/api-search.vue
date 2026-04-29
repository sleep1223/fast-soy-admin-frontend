<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { apiMethodOptions, statusTypeOptions } from '@/constants/business';
import { fetchGetApiTagsList } from '@/service/api';
import { useNaiveForm } from '@/hooks/common/form';
import { translateOptions } from '@/utils/common';
import { $t } from '@/locales';

defineOptions({
  name: 'ApiSearch'
});

interface Emits {
  (e: 'reset'): void;
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();

const { formRef, validate, restoreValidation } = useNaiveForm();

const model = defineModel<Api.SystemManage.ApiSearchParams>('model', { required: true });

// type RuleKey = Extract<keyof Api.SystemManage.ApiSearchParams, 'apiEmail' | 'apiPhone'>;

// const rules = computed<Record<RuleKey, App.Global.FormRule>>(() => {
//   const { patternRules } = useFormRules(); // inside computed to make locale reactive

//   return {
//     path: patternRules.path
//   };
// });

async function reset() {
  await restoreValidation();
  emit('reset');
}

async function search() {
  await validate();
  emit('search');
}

const tagOptions = ref();

onMounted(async () => {
  const { error, data } = await fetchGetApiTagsList();
  if (!error) {
    tagOptions.value = data;
  }
});
</script>

<template>
  <NCard :bordered="false" size="small" class="card-wrapper">
    <NCollapse>
      <NCollapseItem :title="$t('common.search')" name="api-search">
        <NForm ref="formRef" :model="model" label-placement="left" :label-width="100">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.api.method')" path="method" class="pr-24px">
              <NSelect
                v-model:value="model.apiMethod"
                :placeholder="$t('page.manage.api.form.method')"
                :options="translateOptions(apiMethodOptions)"
                filterable
                clearable
              />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.api.path')" path="path" class="pr-24px">
              <NInput v-model:value="model.apiPath" :placeholder="$t('page.manage.api.form.path')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.api.summary')" path="summary" class="pr-24px">
              <NInput v-model:value="model.summary" :placeholder="$t('page.manage.api.form.summary')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.manage.api.tags')" path="tags" class="pr-24px">
              <NCascader
                v-model:value="model.tags"
                :options="tagOptions"
                :placeholder="$t('page.manage.api.form.tags')"
                multiple
                filterable
                clearable
                check-strategy="child"
              />
            </NFormItemGi>

            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.api.statusType')"
              path="status"
              class="pr-24px"
            >
              <NSelect
                v-model:value="model.statusType"
                :placeholder="$t('page.manage.api.form.statusType')"
                :options="translateOptions(statusTypeOptions)"
                filterable
                clearable
              />
            </NFormItemGi>
            <NFormItemGi
              span="24 s:12 m:6"
              :label="$t('page.manage.api.includeSystem')"
              path="includeSystem"
              class="pr-24px"
            >
              <NSwitch v-model:value="model.includeSystem" />
            </NFormItemGi>
            <NFormItemGi span="24 m:12" class="pr-24px">
              <NSpace class="w-full" justify="end">
                <NButton @click="reset">
                  <template #icon>
                    <icon-ic-round-refresh class="text-icon" />
                  </template>
                  {{ $t('common.reset') }}
                </NButton>
                <NButton type="primary" ghost @click="search">
                  <template #icon>
                    <icon-ic-round-search class="text-icon" />
                  </template>
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

<style scoped></style>
