<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { fetchRadarDashboard, fetchRadarPurge } from '@/service/api';
import { useEcharts } from '@/hooks/common/echarts';
import { $t } from '@/locales';

const stats = ref<Api.Radar.DashboardStats | null>(null);
const loading = ref(false);
const selectedHours = ref(1);

const CODE_MAP: Record<string, { label: string; color: string }> = {
  '0000': { label: '0000 Success', color: '#22c55e' },
  '4000': { label: '4000 Fail', color: '#f59e0b' },
  '4001': { label: '4001 Invalid Token', color: '#f97316' },
  '4002': { label: '4002 Invalid Session', color: '#f97316' },
  '4003': { label: '4003 Account Disabled', color: '#fb923c' },
  '4010': { label: '4010 Token Expired', color: '#eab308' },
  '4031': { label: '4031 API Disabled', color: '#ef4444' },
  '4032': { label: '4032 Permission Denied', color: '#ef4444' },
  '4090': { label: '4090 Duplicate', color: '#a855f7' },
  '4220': { label: '4220 Validation Error', color: '#ec4899' },
  unknown: { label: 'Unknown', color: '#94a3b8' }
};

function getCodeMeta(code: string) {
  if (CODE_MAP[code]) return CODE_MAP[code];
  // Fallback: color by code prefix
  if (code.startsWith('0')) return { label: code, color: '#22c55e' };
  if (code.startsWith('40')) return { label: code, color: '#f59e0b' };
  if (code.startsWith('41')) return { label: code, color: '#f97316' };
  if (code.startsWith('42')) return { label: code, color: '#ec4899' };
  if (code.startsWith('5')) return { label: code, color: '#ef4444' };
  return { label: code, color: '#6b7280' };
}

const timeOptions = [
  { label: '1 小时', value: 1 },
  { label: '6 小时', value: 6 },
  { label: '12 小时', value: 12 },
  { label: '24 小时', value: 24 },
  { label: '3 天', value: 72 },
  { label: '7 天', value: 168 }
];

// Response Time Trend Chart
const { domRef: trendChartRef, updateOptions: updateTrendChart } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line' }
  },
  legend: { data: ['平均响应时间', '请求数'], top: '0' },
  grid: { left: '3%', right: '8%', bottom: '3%', top: '18%', containLabel: true },
  xAxis: { type: 'category' as const, boundaryGap: false, data: [] as string[] },
  yAxis: [
    { type: 'value' as const, name: 'ms', position: 'left' as const },
    { type: 'value' as const, name: '次', position: 'right' as const }
  ],
  series: [
    {
      name: '平均响应时间',
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      yAxisIndex: 0,
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(99, 102, 241, 0.3)' },
            { offset: 1, color: 'rgba(99, 102, 241, 0.02)' }
          ]
        }
      },
      itemStyle: { color: '#6366f1' },
      data: [] as number[]
    },
    {
      name: '请求数',
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      yAxisIndex: 1,
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34, 197, 94, 0.25)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.02)' }
          ]
        }
      },
      itemStyle: { color: '#22c55e' },
      data: [] as number[]
    }
  ]
}));

// Request Distribution Chart
const { domRef: distChartRef, updateOptions: updateDistChart } = useEcharts(() => ({
  tooltip: {
    trigger: 'item' as const,
    formatter: '{b}: {c} ({d}%)'
  },
  legend: { type: 'scroll' as const, bottom: '0', left: 'center' },
  series: [
    {
      name: '业务码分布',
      type: 'pie' as const,
      radius: ['35%', '65%'],
      center: ['50%', '45%'],
      avoidLabelOverlap: true,
      itemStyle: { borderRadius: 6, borderColor: '#fff', borderWidth: 2 },
      label: { show: true, formatter: '{b}\n{d}%', fontSize: 11 },
      emphasis: {
        label: { show: true, fontSize: 16, fontWeight: 'bold' as const }
      },
      labelLine: { show: false },
      data: [] as Array<{ value: number; name: string; itemStyle?: { color: string } }>
    }
  ]
}));

// Query Activity Chart
const { domRef: queryChartRef, updateOptions: updateQueryChart } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'cross', label: { backgroundColor: '#6a7985' } }
  },
  legend: { data: ['查询数', '平均耗时'], top: '0' },
  grid: { left: '3%', right: '8%', bottom: '3%', top: '18%', containLabel: true },
  xAxis: { type: 'category' as const, boundaryGap: false, data: [] as string[] },
  yAxis: [
    { type: 'value' as const, name: '次', position: 'left' as const },
    { type: 'value' as const, name: 'ms', position: 'right' as const }
  ],
  series: [
    {
      name: '查询数',
      type: 'bar' as const,
      yAxisIndex: 0,
      itemStyle: { color: 'rgba(251, 146, 60, 0.7)', borderRadius: [2, 2, 0, 0] },
      data: [] as number[]
    },
    {
      name: '平均耗时',
      type: 'line' as const,
      smooth: true,
      yAxisIndex: 1,
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(168, 85, 247, 0.3)' },
            { offset: 1, color: 'rgba(168, 85, 247, 0.02)' }
          ]
        }
      },
      itemStyle: { color: '#a855f7' },
      data: [] as number[]
    }
  ]
}));

function updateCharts() {
  if (!stats.value) return;

  const trend = stats.value.response_time_trend;
  updateTrendChart(opts => {
    opts.xAxis.data = trend.map(t => t.time);
    opts.series[0].data = trend.map(t => t.avg_response_time);
    opts.series[1].data = trend.map(t => t.request_count);
    return opts;
  });

  const dist = stats.value.distribution;
  updateDistChart(opts => {
    opts.series[0].data = dist.map(item => {
      const meta = getCodeMeta(item.code);
      return { value: item.count, name: meta.label, itemStyle: { color: meta.color } };
    });
    return opts;
  });

  const qa = stats.value.query_activity;
  updateQueryChart(opts => {
    opts.xAxis.data = qa.map(q => q.time);
    opts.series[0].data = qa.map(q => q.query_count);
    opts.series[1].data = qa.map(q => q.avg_duration);
    return opts;
  });
}

async function loadDashboard() {
  loading.value = true;
  const { error, data } = await fetchRadarDashboard(selectedHours.value);
  if (!error) {
    stats.value = data;
    updateCharts();
  }
  loading.value = false;
}

function handleTimeChange(val: number) {
  selectedHours.value = val;
  loadDashboard();
}

async function handlePurge() {
  const { error, data } = await fetchRadarPurge(24);
  if (!error) {
    window.$message?.success(`${$t('page.manage.radar.purgeSuccess')}: ${data.deleted_count}`);
    loadDashboard();
  }
}

onMounted(() => {
  loadDashboard();
});
</script>

<template>
  <div class="flex-col-stretch gap-16px overflow-hidden p-16px">
    <!-- Header -->
    <NCard :bordered="false" size="small" class="card-wrapper">
      <div class="flex items-center justify-between">
        <span class="text-lg font-bold">{{ $t('page.manage.radar.overview.title') }}</span>
        <NSpace>
          <NSelect
            :value="selectedHours"
            :options="timeOptions"
            size="small"
            class="w-120px"
            @update:value="handleTimeChange"
          />
          <NButton size="small" @click="loadDashboard">
            <template #icon>
              <icon-ic-round-refresh class="text-icon" />
            </template>
            {{ $t('common.refresh') }}
          </NButton>
          <NPopconfirm @positive-click="handlePurge">
            <template #trigger>
              <NButton size="small" type="warning">{{ $t('page.manage.radar.purge') }}</NButton>
            </template>
            {{ $t('page.manage.radar.purgeConfirm') }}
          </NPopconfirm>
        </NSpace>
      </div>
    </NCard>

    <NSpin :show="loading">
      <div v-if="stats" class="flex-col-stretch gap-16px">
        <!-- Top 4 Stat Cards -->
        <NGrid :x-gap="16" :y-gap="16" cols="2 s:4" responsive="screen">
          <NGi>
            <NCard :bordered="false" size="small" class="card-wrapper">
              <div class="flex items-center gap-12px">
                <div class="flex-center h-48px w-48px rounded-8px bg-primary/10">
                  <icon-mdi-swap-horizontal class="text-24px text-primary" />
                </div>
                <div>
                  <div class="text-12px text-gray-500">{{ $t('page.manage.radar.dashboard.totalRequests') }}</div>
                  <div class="text-24px font-bold">{{ stats.total_requests.toLocaleString() }}</div>
                </div>
              </div>
            </NCard>
          </NGi>
          <NGi>
            <NCard :bordered="false" size="small" class="card-wrapper">
              <div class="flex items-center gap-12px">
                <div class="flex-center h-48px w-48px rounded-8px bg-warning/10">
                  <icon-mdi-timer-outline class="text-24px text-warning" />
                </div>
                <div>
                  <div class="text-12px text-gray-500">{{ $t('page.manage.radar.dashboard.avgResponseTime') }}</div>
                  <div class="text-24px font-bold">{{ stats.avg_response_time }}ms</div>
                </div>
              </div>
            </NCard>
          </NGi>
          <NGi>
            <NCard :bordered="false" size="small" class="card-wrapper">
              <div class="flex items-center gap-12px">
                <div class="flex-center h-48px w-48px rounded-8px bg-success/10">
                  <icon-mdi-database-search class="text-24px text-success" />
                </div>
                <div>
                  <div class="text-12px text-gray-500">{{ $t('page.manage.radar.dashboard.dbQueries') }}</div>
                  <div class="text-24px font-bold">{{ stats.total_queries.toLocaleString() }}</div>
                </div>
              </div>
            </NCard>
          </NGi>
          <NGi>
            <NCard :bordered="false" size="small" class="card-wrapper">
              <div class="flex items-center gap-12px">
                <div class="flex-center h-48px w-48px rounded-8px bg-error/10">
                  <icon-mdi-bug-outline class="text-24px text-error" />
                </div>
                <div>
                  <div class="text-12px text-gray-500">{{ $t('page.manage.radar.dashboard.exceptions') }}</div>
                  <div class="text-24px font-bold" :class="stats.total_exceptions > 0 ? 'text-error' : ''">
                    {{ stats.total_exceptions }}
                  </div>
                </div>
              </div>
            </NCard>
          </NGi>
        </NGrid>

        <!-- Performance Overview + Response Time -->
        <NGrid :x-gap="16" :y-gap="16" cols="1 m:2" responsive="screen">
          <NGi>
            <NCard :title="$t('page.manage.radar.dashboard.perfOverview')" :bordered="false" size="small" class="card-wrapper">
              <NGrid :x-gap="16" :y-gap="16" cols="2" responsive="screen">
                <NGi>
                  <NStatistic :label="$t('page.manage.radar.dashboard.successRate')">
                    <span class="text-success font-bold">{{ stats.success_rate }}%</span>
                  </NStatistic>
                </NGi>
                <NGi>
                  <NStatistic :label="$t('page.manage.radar.dashboard.totalRequests')" :value="stats.total_requests" />
                </NGi>
                <NGi>
                  <NStatistic :label="$t('page.manage.radar.dashboard.errors')">
                    <span :class="stats.error_count > 0 ? 'text-error' : ''">{{ stats.error_count }}</span>
                  </NStatistic>
                </NGi>
                <NGi>
                  <NStatistic :label="$t('page.manage.radar.dashboard.errorRate')">
                    <span :class="stats.error_rate > 5 ? 'text-error' : ''">{{ stats.error_rate }}%</span>
                  </NStatistic>
                </NGi>
              </NGrid>
            </NCard>
          </NGi>
          <NGi>
            <NCard :title="$t('page.manage.radar.dashboard.responseTime')" :bordered="false" size="small" class="card-wrapper">
              <NGrid :x-gap="16" :y-gap="16" cols="2" responsive="screen">
                <NGi>
                  <NStatistic label="P50 (Median)">
                    <span>{{ stats.p50 }}ms</span>
                  </NStatistic>
                </NGi>
                <NGi>
                  <NStatistic label="P95">
                    <span :class="stats.p95 > 500 ? 'text-warning' : ''">{{ stats.p95 }}ms</span>
                  </NStatistic>
                </NGi>
                <NGi>
                  <NStatistic label="P99">
                    <span :class="stats.p99 > 1000 ? 'text-error' : ''">{{ stats.p99 }}ms</span>
                  </NStatistic>
                </NGi>
                <NGi>
                  <NStatistic :label="$t('page.manage.radar.dashboard.queryPerf')">
                    <span>{{ stats.avg_query_time }}ms</span>
                  </NStatistic>
                </NGi>
              </NGrid>
            </NCard>
          </NGi>
        </NGrid>

        <!-- Request Distribution + Response Time Trend -->
        <NGrid :x-gap="16" :y-gap="16" cols="1 m:3" responsive="screen">
          <NGi>
            <NCard :title="$t('page.manage.radar.dashboard.requestDist')" :bordered="false" size="small" class="card-wrapper">
              <div ref="distChartRef" class="h-300px"></div>
            </NCard>
          </NGi>
          <NGi :span="2">
            <NCard :title="$t('page.manage.radar.dashboard.responseTimeTrend')" :bordered="false" size="small" class="card-wrapper">
              <div ref="trendChartRef" class="h-300px"></div>
            </NCard>
          </NGi>
        </NGrid>

        <!-- Query Activity -->
        <NCard :title="$t('page.manage.radar.dashboard.queryActivity')" :bordered="false" size="small" class="card-wrapper">
          <div ref="queryChartRef" class="h-300px"></div>
        </NCard>
      </div>
    </NSpin>
  </div>
</template>
