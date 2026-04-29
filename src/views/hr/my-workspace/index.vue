<script setup lang="tsx">
import { computed, onMounted, ref } from 'vue';
import type { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui';
import { NTag } from 'naive-ui';
import {
  fetchGetTagList,
  fetchMyDepartment,
  fetchMyProfile,
  fetchUpdateMyProfile,
  fetchUpdateMyTags,
  fetchUploadMyAvatar
} from '@/service/api';
import { employeeStatusRecord, employeeStatusTagType } from '@/constants/business';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';

const { hasAuth } = useAuth();

const profile = ref<Api.HrPersonal.MyProfile | null>(null);
const colleagues = ref<Api.HrPersonal.Colleague[]>([]);
const tagOptions = ref<{ label: string; value: string }[]>([]);

const profileEditing = ref(false);
const profileForm = ref<Api.HrPersonal.MyProfileUpdateParams>({ phone: '', email: '' });

const tagEditing = ref(false);
const selectedTagIds = ref<string[]>([]);

const avatarFileList = ref<UploadFileInfo[]>([]);

const myTagIds = computed(() => profile.value?.tags.map(t => t.id) ?? []);

async function loadProfile() {
  const { data } = await fetchMyProfile();
  if (data) {
    profile.value = data;
    avatarFileList.value = data.avatar ? [{ id: 'current', name: 'avatar', status: 'finished', url: data.avatar }] : [];
  }
}

async function loadColleagues() {
  const { data } = await fetchMyDepartment();
  colleagues.value = data ?? [];
}

async function loadTagOptions() {
  const { data } = await fetchGetTagList({ current: 1, size: 999 });
  tagOptions.value = (data?.records ?? []).map(t => ({ label: t.name, value: t.id }));
}

function openProfileEdit() {
  profileForm.value = { phone: profile.value?.phone ?? '', email: profile.value?.email ?? '' };
  profileEditing.value = true;
}

async function submitProfileEdit() {
  const { error } = await fetchUpdateMyProfile(profileForm.value);
  if (error) return;
  window.$message?.success($t('common.updateSuccess'));
  profileEditing.value = false;
  await loadProfile();
}

function openTagEdit() {
  selectedTagIds.value = [...myTagIds.value];
  tagEditing.value = true;
}

async function submitTagEdit() {
  const { error } = await fetchUpdateMyTags(selectedTagIds.value);
  if (error) return;
  window.$message?.success($t('common.updateSuccess'));
  tagEditing.value = false;
  await loadProfile();
}

async function handleAvatarUpload({ file, onFinish, onError }: UploadCustomRequestOptions) {
  if (!file.file) {
    onError();
    return;
  }
  const { data, error } = await fetchUploadMyAvatar(file.file);
  if (error || !data) {
    onError();
    return;
  }
  avatarFileList.value = [{ id: file.id, name: file.name, status: 'finished', url: data.avatarUrl }];
  if (profile.value) profile.value.avatar = data.avatarUrl;
  window.$message?.success($t('page.hr.my.avatarUploadSuccess'));
  onFinish();
}

onMounted(async () => {
  await Promise.all([loadProfile(), loadColleagues(), loadTagOptions()]);
});
</script>

<template>
  <div class="flex-col-stretch gap-16px">
    <NCard :title="$t('page.hr.my.profileTitle')" :bordered="false" size="small" class="card-wrapper">
      <template #header-extra>
        <NButton size="small" type="primary" ghost @click="openProfileEdit">
          {{ $t('common.edit') }}
        </NButton>
      </template>
      <div v-if="profile" class="flex gap-24px lt-sm:flex-col">
        <div class="flex-col-center gap-8px">
          <NUpload
            v-if="hasAuth('B_HR_MY_AVATAR_EDIT')"
            v-model:file-list="avatarFileList"
            list-type="image-card"
            :max="1"
            accept="image/jpeg,image/png,image/gif,image/webp"
            :custom-request="handleAvatarUpload"
          />
          <NAvatar v-else :size="96" :src="profile.avatar ?? undefined" />
        </div>
        <NDescriptions :column="2" label-placement="left" size="small" bordered class="flex-1">
          <NDescriptionsItem :label="$t('page.hr.employee.name')">{{ profile.name }}</NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.hr.employee.employeeNo')">{{ profile.employeeNo }}</NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.hr.employee.department')">{{ profile.departmentName }}</NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.hr.employee.position')">
            {{ profile.position || '-' }}
          </NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.hr.employee.email')">{{ profile.email || '-' }}</NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.hr.employee.phone')">{{ profile.phone || '-' }}</NDescriptionsItem>
          <NDescriptionsItem :label="$t('page.hr.common.status')">
            <NTag :type="employeeStatusTagType[profile.status]">
              {{ $t(employeeStatusRecord[profile.status]) }}
            </NTag>
          </NDescriptionsItem>
        </NDescriptions>
      </div>
    </NCard>

    <NCard :title="$t('page.hr.my.tagTitle')" :bordered="false" size="small" class="card-wrapper">
      <template #header-extra>
        <NButton v-if="hasAuth('B_HR_MY_TAG_EDIT')" size="small" type="primary" ghost @click="openTagEdit">
          {{ $t('common.edit') }}
        </NButton>
      </template>
      <NSpace v-if="profile && profile.tags.length">
        <NTag v-for="t in profile.tags" :key="t.id" type="info">{{ t.name }}</NTag>
      </NSpace>
      <NEmpty v-else :description="$t('common.noData')" />
    </NCard>

    <NCard :title="$t('page.hr.my.colleaguesTitle')" :bordered="false" size="small" class="card-wrapper">
      <NEmpty v-if="!colleagues.length" :description="$t('common.noData')" />
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-12px">
        <NCard v-for="c in colleagues" :key="c.id" size="small" :bordered="true" embedded>
          <div class="flex items-center gap-12px">
            <NAvatar :size="48" :src="c.avatar ?? undefined">{{ c.name.charAt(0) }}</NAvatar>
            <div class="min-w-0 flex-1">
              <div class="truncate font-medium">{{ c.name }}</div>
              <div class="truncate text-12px text-gray-500">{{ c.position || '-' }}</div>
            </div>
            <NTag size="small" :type="employeeStatusTagType[c.status]">
              {{ $t(employeeStatusRecord[c.status]) }}
            </NTag>
          </div>
          <div v-if="c.tagNames?.length" class="mt-8px">
            <NTag v-for="n in c.tagNames" :key="n" size="small" class="mr-4px">{{ n }}</NTag>
          </div>
        </NCard>
      </div>
    </NCard>

    <NModal v-model:show="profileEditing" preset="dialog" :title="$t('page.hr.my.editProfile')" :show-icon="false">
      <NForm :model="profileForm" label-placement="top">
        <NFormItem :label="$t('page.hr.employee.phone')">
          <NInput v-model:value="profileForm.phone" :placeholder="$t('page.hr.employee.form.phone')" />
        </NFormItem>
        <NFormItem :label="$t('page.hr.employee.email')">
          <NInput v-model:value="profileForm.email" :placeholder="$t('page.hr.employee.form.email')" />
        </NFormItem>
      </NForm>
      <template #action>
        <NButton @click="profileEditing = false">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="submitProfileEdit">{{ $t('common.confirm') }}</NButton>
      </template>
    </NModal>

    <NModal v-model:show="tagEditing" preset="dialog" :title="$t('page.hr.my.editTags')" :show-icon="false">
      <NSelect
        v-model:value="selectedTagIds"
        :options="tagOptions"
        multiple
        clearable
        :placeholder="$t('page.hr.employee.form.tags')"
      />
      <template #action>
        <NButton @click="tagEditing = false">{{ $t('common.cancel') }}</NButton>
        <NButton type="primary" @click="submitTagEdit">{{ $t('common.confirm') }}</NButton>
      </template>
    </NModal>
  </div>
</template>
