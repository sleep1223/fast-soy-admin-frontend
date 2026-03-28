<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchRadarPurge, fetchRadarStats } from '@/service/api';
import { $t } from '@/locales';

const stats = ref<Api.Radar.Stats | null>(null);
const loading = ref(false);

async function loadStats() {
  loading.value = true;
  const { error, data } = await fetchRadarStats();
  if (!error) {
    stats.value = data;
  }
  loading.value = false;
}

async function handlePurge() {
  const { error, data } = await fetchRadarPurge(24);
  if (!error) {
    window.$message?.success(`${$t('page.manage.radar.purgeSuccess')}: ${data.deleted_count}`);
    loadStats();
  }
}

onMounted(() => {
  loadStats();
});
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-hidden p-16px">
    <NCard :title="$t('page.manage.radar.overview.title')" :bordered="false" size="small" class="card-wrapper">
      <template #header-extra>
        <NSpace>
          <NButton size="small" @click="loadStats">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.refresh') }}
          </NButton>
          <NPopconfirm @positive-click="handlePurge">
            <template #trigger>
              <NButton size="small" type="warning">
                {{ $t('page.manage.radar.purge') }}
              </NButton>
            </template>
            {{ $t('page.manage.radar.purgeConfirm') }}
          </NPopconfirm>
        </NSpace>
      </template>

      <NSpin :show="loading">
        <NGrid v-if="stats" :x-gap="16" :y-gap="16" cols="2 s:3 m:4" responsive="screen">
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.requestCount')" :value="stats.request_count" />
          </NGi>
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.avgDuration')">
              <NNumberAnimation :from="0" :to="stats.avg_duration_ms" :precision="2" />
              <template #suffix>ms</template>
            </NStatistic>
          </NGi>
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.errorCount')">
              <span :class="stats.error_count > 0 ? 'text-error' : ''">{{ stats.error_count }}</span>
            </NStatistic>
          </NGi>
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.errorRate')">
              <span :class="stats.error_rate > 5 ? 'text-error' : ''">{{ stats.error_rate }}%</span>
            </NStatistic>
          </NGi>
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.queryCount')" :value="stats.query_count" />
          </NGi>
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.slowQueryCount')">
              <span :class="stats.slow_query_count > 0 ? 'text-warning' : ''">{{ stats.slow_query_count }}</span>
            </NStatistic>
          </NGi>
          <NGi>
            <NStatistic :label="$t('page.manage.radar.overview.userLogCount')" :value="stats.user_log_count" />
          </NGi>
        </NGrid>
      </NSpin>
    </NCard>
  </div>
</template>
