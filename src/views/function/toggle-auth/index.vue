<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useLoading } from '@sa/hooks';
import { fetchGetUserList } from '@/service/api';
import { useAuthStore } from '@/store/modules/auth';
import { useAuth } from '@/hooks/business/auth';
import { $t } from '@/locales';

const authStore = useAuthStore();
const { hasAuth } = useAuth();
const { loading, startLoading, endLoading } = useLoading();

const isSuperAdmin = computed(() => authStore.userInfo.roles.includes('R_SUPER'));

interface SwitchableUser {
  id: number;
  userName: string;
  nickName: string;
}

const switchableUsers = ref<SwitchableUser[]>([]);
const switchingId = ref<number | null>(null);

async function loadUsers() {
  if (!isSuperAdmin.value) return;
  const { data, error } = await fetchGetUserList({ current: 1, size: 50 });
  if (!error && data) {
    switchableUsers.value = (data.records || [])
      .filter((u: any) => String(u.id) !== authStore.userInfo.userId)
      .map((u: any) => ({ id: u.id, userName: u.userName, nickName: u.nickName }));
  }
}

async function handleImpersonate(user: SwitchableUser) {
  switchingId.value = user.id;
  startLoading();
  await authStore.impersonate(user.id);
  endLoading();
  switchingId.value = null;
  loadUsers();
}

async function handleExitImpersonate() {
  startLoading();
  await authStore.exitImpersonate();
  endLoading();
  loadUsers();
}

onMounted(loadUsers);
</script>

<template>
  <NSpace vertical :size="16">
    <!-- Impersonation status card -->
    <NCard v-if="authStore.impersonating" :bordered="false" size="small" segmented class="card-wrapper">
      <NAlert
        type="warning"
        :title="$t('page.manage.user.impersonate.actingAs', { name: authStore.userInfo.nickName || authStore.userInfo.userName })"
      >
        <NButton type="warning" size="small" :loading="loading" @click="handleExitImpersonate">
          {{ $t('page.manage.user.impersonate.exit') }}
        </NButton>
      </NAlert>
    </NCard>

    <NCard :title="$t('route.function_toggle-auth')" :bordered="false" size="small" segmented class="card-wrapper">
      <NDescriptions bordered :column="1">
        <NDescriptionsItem :label="$t('page.manage.user.userRole')">
          <NSpace>
            <NTag v-for="role in authStore.userInfo.roles" :key="role">{{ role }}</NTag>
          </NSpace>
        </NDescriptionsItem>
        <NDescriptionsItem v-if="isSuperAdmin" :label="$t('page.function.toggleAuth.toggleAccount')">
          <NSpace>
            <NButton
              v-for="user in switchableUsers"
              :key="user.id"
              :loading="loading && switchingId === user.id"
              :disabled="loading && switchingId !== user.id"
              @click="handleImpersonate(user)"
            >
              {{ user.nickName || user.userName }}
            </NButton>
          </NSpace>
          <NEmpty v-if="switchableUsers.length === 0" size="small" />
        </NDescriptionsItem>
      </NDescriptions>
    </NCard>
    <NCard
      :title="$t('page.function.toggleAuth.authHook')"
      :bordered="false"
      size="small"
      segmented
      class="card-wrapper"
    >
      <NSpace>
        <NButton v-if="hasAuth('B_CODE1')">{{ $t('page.function.toggleAuth.superAdminVisible') }}</NButton>
        <NButton v-if="hasAuth('B_CODE2')">{{ $t('page.function.toggleAuth.adminVisible') }}</NButton>
        <NButton v-if="hasAuth('B_CODE3')">
          {{ $t('page.function.toggleAuth.adminOrUserVisible') }}
        </NButton>
      </NSpace>
    </NCard>
  </NSpace>
</template>

<style scoped></style>
