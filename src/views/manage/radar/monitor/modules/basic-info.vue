<script setup lang="ts">
import { $t } from '@/locales';

defineProps<{
  data: Api.Monitor.BasicInfo | undefined;
}>();
</script>

<template>
  <NCard :title="$t('page.manage.radar.monitor.basicInfo')" :bordered="false" size="small" class="card-wrapper">
    <NDescriptions v-if="data" label-placement="left" bordered :column="1" size="small">
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.hostname')">
        {{ data.hostname }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.ipAddress')">
        {{ data.ip_address }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.os')">
        {{ data.system }} ({{ data.platform }})
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.architecture')">
        {{ data.architecture }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.processor')">
        {{ data.processor }}
      </NDescriptionsItem>
      <NDescriptionsItem :label="$t('page.manage.radar.monitor.pythonVersion')">
        {{ data.python_version }}
      </NDescriptionsItem>
    </NDescriptions>
  </NCard>
</template>
