<script setup lang="ts">
import { computed, reactive, ref } from 'vue';
import { fetchUpdatePassword } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useFormRules, useNaiveForm } from '@/hooks/common/form';
import { $t } from '@/locales';

const authStore = useAuthStore();
const { formRef, validate, restoreValidation } = useNaiveForm();
const { formRules, createConfirmPwdRule, createRequiredRule } = useFormRules();

const model = reactive({
  oldPassword: '',
  newPassword: '',
  confirmPassword: ''
});

const submitting = ref(false);

const rules = computed(() => ({
  oldPassword: createRequiredRule($t('page.userCenter.password.oldPasswordPlaceholder')),
  newPassword: formRules.pwd,
  confirmPassword: createConfirmPwdRule(model.newPassword)
}));

async function handleSubmit() {
  await validate();
  if (submitting.value) return;
  submitting.value = true;
  try {
    const { error } = await fetchUpdatePassword({
      oldPassword: model.oldPassword,
      newPassword: model.newPassword
    });
    if (error) return;
    window.$message?.success($t('page.userCenter.password.success'));
    model.oldPassword = '';
    model.newPassword = '';
    model.confirmPassword = '';
    await restoreValidation();
    await authStore.resetStore();
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <NSpace vertical :size="16">
    <NCard :title="$t('page.userCenter.profile.title')" :bordered="false" size="small" class="card-wrapper">
      <NDescriptions label-placement="left" :column="2" bordered>
        <NDescriptionsItem :label="$t('page.userCenter.profile.userName')">
          {{ authStore.userInfo.userName }}
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.userCenter.profile.nickName')">
          {{ authStore.userInfo.nickName }}
        </NDescriptionsItem>
        <NDescriptionsItem :label="$t('page.userCenter.profile.roles')" :span="2">
          <NSpace>
            <NTag v-for="role in authStore.userInfo.roles" :key="role" type="info">
              {{ role }}
            </NTag>
          </NSpace>
        </NDescriptionsItem>
      </NDescriptions>
      <NAlert
        v-if="authStore.impersonating"
        type="warning"
        class="mt-12px"
        :title="$t('page.userCenter.profile.impersonating')"
      />
    </NCard>

    <NCard :title="$t('page.userCenter.password.title')" :bordered="false" size="small" class="card-wrapper">
      <NForm
        ref="formRef"
        :model="model"
        :rules="rules"
        label-placement="left"
        label-width="120px"
        require-mark-placement="right-hanging"
        class="max-w-480px"
      >
        <NFormItem :label="$t('page.userCenter.password.oldPassword')" path="oldPassword">
          <NInput
            v-model:value="model.oldPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('page.userCenter.password.oldPasswordPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.userCenter.password.newPassword')" path="newPassword">
          <NInput
            v-model:value="model.newPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('page.userCenter.password.newPasswordPlaceholder')"
          />
        </NFormItem>
        <NFormItem :label="$t('page.userCenter.password.confirmPassword')" path="confirmPassword">
          <NInput
            v-model:value="model.confirmPassword"
            type="password"
            show-password-on="click"
            :placeholder="$t('page.userCenter.password.confirmPasswordPlaceholder')"
          />
        </NFormItem>
        <NFormItem :show-label="false">
          <NButton type="primary" :loading="submitting" @click="handleSubmit">
            {{ $t('page.userCenter.password.submit') }}
          </NButton>
        </NFormItem>
      </NForm>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
