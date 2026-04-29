<script setup lang="ts">
import { $t } from '@/locales';

defineProps<{
  realtime: Api.Monitor.Realtime | null;
  overview: Api.Monitor.Overview | null;
}>();

function getProgressColor(percent: number) {
  if (percent >= 90) return '#ef4444';
  if (percent >= 70) return '#f59e0b';
  return '#22c55e';
}
</script>

<template>
  <div class="grid grid-cols-1 gap-16px sm:grid-cols-2 xl:grid-cols-4">
    <!-- CPU -->
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center gap-12px">
        <div class="flex-center h-48px w-48px shrink-0 rounded-8px bg-primary/10">
          <icon-mdi-chip class="text-24px text-primary" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="mb-4px flex items-center justify-between">
            <span class="truncate text-12px text-gray-500">{{ $t('page.manage.radar.monitor.cpuUsage') }}</span>
            <span class="ml-8px shrink-0 text-16px font-bold">{{ (realtime?.cpu || overview?.cpu)?.usage || 0 }}%</span>
          </div>
          <NProgress
            type="line"
            :percentage="(realtime?.cpu || overview?.cpu)?.usage || 0"
            :color="getProgressColor((realtime?.cpu || overview?.cpu)?.usage || 0)"
            :show-indicator="false"
            :height="6"
          />
          <div class="mt-4px flex gap-8px text-11px text-gray-400">
            <span>{{ $t('page.manage.radar.monitor.cores') }}: {{ (realtime?.cpu || overview?.cpu)?.cores || 0 }}</span>
            <span>{{ $t('page.manage.radar.monitor.threads') }}: {{ (realtime?.cpu || overview?.cpu)?.threads || 0 }}</span>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Memory -->
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center gap-12px">
        <div class="flex-center h-48px w-48px shrink-0 rounded-8px bg-success/10">
          <icon-mdi-memory class="text-24px text-success" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="mb-4px flex items-center justify-between">
            <span class="truncate text-12px text-gray-500">{{ $t('page.manage.radar.monitor.memoryUsage') }}</span>
            <span class="ml-8px shrink-0 text-16px font-bold">{{ (realtime?.memory || overview?.memory)?.usage || 0 }}%</span>
          </div>
          <NProgress
            type="line"
            :percentage="(realtime?.memory || overview?.memory)?.usage || 0"
            :color="getProgressColor((realtime?.memory || overview?.memory)?.usage || 0)"
            :show-indicator="false"
            :height="6"
          />
          <div class="mt-4px flex gap-8px text-11px text-gray-400">
            <span>{{ $t('page.manage.radar.monitor.used') }}: {{ (realtime?.memory || overview?.memory)?.used || 0 }}GB</span>
            <span>{{ $t('page.manage.radar.monitor.total') }}: {{ (realtime?.memory || overview?.memory)?.total || 0 }}GB</span>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Disk -->
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center gap-12px">
        <div class="flex-center h-48px w-48px shrink-0 rounded-8px bg-warning/10">
          <icon-mdi-harddisk class="text-24px text-warning" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="mb-4px flex items-center justify-between">
            <span class="truncate text-12px text-gray-500">{{ $t('page.manage.radar.monitor.diskUsage') }}</span>
            <span class="ml-8px shrink-0 text-16px font-bold">{{ (realtime?.disk_io || overview?.disk_io)?.usage || 0 }}%</span>
          </div>
          <NProgress
            type="line"
            :percentage="(realtime?.disk_io || overview?.disk_io)?.usage || 0"
            :color="getProgressColor((realtime?.disk_io || overview?.disk_io)?.usage || 0)"
            :show-indicator="false"
            :height="6"
          />
          <div class="mt-4px flex gap-8px text-11px text-gray-400">
            <span>{{ $t('page.manage.radar.monitor.used') }}: {{ (realtime?.disk_io || overview?.disk_io)?.used || 0 }}GB</span>
            <span>{{ $t('page.manage.radar.monitor.total') }}: {{ (realtime?.disk_io || overview?.disk_io)?.total || 0 }}GB</span>
          </div>
        </div>
      </div>
    </NCard>

    <!-- Network -->
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center gap-12px">
        <div class="flex-center h-48px w-48px shrink-0 rounded-8px bg-info/10">
          <icon-mdi-access-point-network class="text-24px text-info" />
        </div>
        <div class="min-w-0 flex-1">
          <div class="mb-4px flex items-center justify-between">
            <span class="truncate text-12px text-gray-500">{{ $t('page.manage.radar.monitor.networkIO') }}</span>
            <span class="ml-8px shrink-0 text-16px font-bold">{{ (realtime?.network_io || overview?.network_io)?.active_connections || 0 }}</span>
          </div>
          <div class="flex flex-col gap-2px text-12px">
            <div class="flex justify-between">
              <span class="text-gray-400">{{ $t('page.manage.radar.monitor.upload') }}</span>
              <span class="font-medium">{{ (realtime?.network_io || overview?.network_io)?.upload_speed || '0 B/s' }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-400">{{ $t('page.manage.radar.monitor.download') }}</span>
              <span class="font-medium">{{ (realtime?.network_io || overview?.network_io)?.download_speed || '0 B/s' }}</span>
            </div>
          </div>
        </div>
      </div>
    </NCard>
  </div>
</template>
