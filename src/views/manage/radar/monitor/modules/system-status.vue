<script setup lang="ts">
import { $t } from '@/locales';

defineProps<{
  data: Api.Monitor.SystemStatus | undefined;
}>();
</script>

<template>
  <NCard :title="$t('page.manage.radar.monitor.systemStatus')" :bordered="false" size="small" class="card-wrapper">
    <NDescriptions v-if="data" label-placement="left" bordered :column="1" size="small">
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.systemLoad')">
        {{ data.load_1min }} / {{ data.load_5min }} / {{ data.load_15min }}
        <span class="ml-8px text-11px text-gray-400">
          ({{ $t('page.manage.radar.monitor.loadAvg') }})
        </span>
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.uptime')">
        {{ data.uptime }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.bootTime')">
        {{ data.boot_time }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.processes')">
        {{ $t('page.manage.radar.monitor.total') }}: {{ data.total_processes }}
        <NTag size="tiny" type="success" class="ml-8px">
          {{ $t('page.manage.radar.monitor.running') }}: {{ data.running_processes }}
        </NTag>
        <NTag size="tiny" type="info" class="ml-4px">
          {{ $t('page.manage.radar.monitor.sleeping') }}: {{ data.sleeping_processes }}
        </NTag>
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.onlineUsers')">
        {{ data.online_users }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.updateTime')">
        {{ data.update_time }}
      </NDescriptionsItem>
    </NDescriptions>
  </NCard>
</template>
