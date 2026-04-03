<script setup lang="ts">
import { toRaw } from 'vue';
import { jsonClone } from '@sa/utils';
import { $t } from '@/locales';

defineOptions({ name: 'SkillSearch' });

interface Emits {
  (e: 'search'): void;
}

const emit = defineEmits<Emits>();
const model = defineModel<Api.HrManage.SkillSearchParams>('model', { required: true });
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
    <NCollapse :default-expanded-names="['skill-search']">
      <NCollapseItem :title="$t('common.search')" name="skill-search">
        <NForm :model="model" label-placement="left" :label-width="80">
          <NGrid responsive="screen" item-responsive>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.hr.skill.name')" path="name" class="pr-24px">
              <NInput v-model:value="model.name" :placeholder="$t('page.hr.skill.form.name')" />
            </NFormItemGi>
            <NFormItemGi span="24 s:12 m:6" :label="$t('page.hr.skill.category')" path="category" class="pr-24px">
              <NInput v-model:value="model.category" :placeholder="$t('page.hr.skill.form.category')" />
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
