<script setup lang="ts">
import { onActivated, onBeforeUnmount, onDeactivated, onMounted, ref } from 'vue';
import { fetchMonitorOverview, fetchMonitorRealtime } from '@/service/api';
import { $t } from '@/locales';
import SystemCards from './modules/system-cards.vue';
import BasicInfo from './modules/basic-info.vue';
import SystemStatus from './modules/system-status.vue';
import NetworkTrend from './modules/network-trend.vue';
import ProcessTable from './modules/process-table.vue';

const overviewData = ref<Api.Monitor.Overview | null>(null);
const realtimeData = ref<Api.Monitor.Realtime | null>(null);
const loading = ref(false);
const autoRefresh = ref(true);
let timer: ReturnType<typeof setInterval> | null = null;

async function loadOverview() {
  loading.value = true;
  const { error, data } = await fetchMonitorOverview();
  if (!error) {
    overviewData.value = data;
  }
  loading.value = false;
}

async function loadRealtime() {
  const { error, data } = await fetchMonitorRealtime();
  if (!error) {
    realtimeData.value = data;
  }
}

function startAutoRefresh() {
  stopAutoRefresh();
  if (autoRefresh.value) {
    timer = setInterval(loadRealtime, 3000);
  }
}

function stopAutoRefresh() {
  if (timer) {
    clearInterval(timer);
    timer = null;
  }
}

function toggleAutoRefresh(val: boolean) {
  autoRefresh.value = val;
  if (val) {
    startAutoRefresh();
  } else {
    stopAutoRefresh();
  }
}

onMounted(async () => {
  await loadOverview();
  await loadRealtime();
  startAutoRefresh();
});

onActivated(() => {
  if (!overviewData.value) {
    loadOverview();
    loadRealtime();
  }
  startAutoRefresh();
});

onDeactivated(() => {
  stopAutoRefresh();
});

onBeforeUnmount(() => {
  stopAutoRefresh();
});
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-y-auto p-16px">
    <!-- Header -->
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold">{{ $t('page.manage.radar.monitor.title') }}</span>
        <NSpace align="center">
          <NSwitch :value="autoRefresh" size="small" @update:value="toggleAutoRefresh">
            <template #checked>{{ $t('page.manage.radar.monitor.autoRefresh') }}</template>
            <template #unchecked>{{ $t('page.manage.radar.monitor.paused') }}</template>
          </NSwitch>
          <NTag :type="autoRefresh ? 'success' : 'default'" size="small">
            {{ autoRefresh ? $t('page.manage.radar.monitor.autoRefresh') : $t('page.manage.radar.monitor.paused') }}
          </NTag>
          <NButton size="small" @click="loadRealtime">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.refresh') }}
          </NButton>
        </NSpace>
      </div>
    </NCard>

    <NSpin :show="loading">
      <div v-if="overviewData || realtimeData" class="flex-col-stretch gap-16px">
        <!-- System Info Cards (CPU, Memory, Disk IO, Network IO) -->
        <SystemCards :realtime="realtimeData" :overview="overviewData" />

        <!-- Basic Info + System Status -->
        <NGrid :x-gap="16" :y-gap="16" cols="1 m:2" responsive="screen">
          <NGi>
            <BasicInfo :data="overviewData?.basic_info" />
          </NGi>
          <NGi>
            <SystemStatus :data="realtimeData?.system_status || overviewData?.system_status" />
          </NGi>
        </NGrid>

        <!-- Network Usage Trend -->
        <NetworkTrend :realtime="realtimeData" />

        <!-- Top 10 Processes -->
        <ProcessTable :processes="realtimeData?.top_processes || overviewData?.top_processes || []" />
      </div>
    </NSpin>
  </div>
</template>
