<script setup lang="ts">
import { ref, watch } from 'vue';
import { useEcharts } from '@/hooks/common/echarts';
import { $t } from '@/locales';

const props = defineProps<{
  realtime: Api.Monitor.Realtime | null;
}>();

const MAX_POINTS = 60;
const uploadData = ref<number[]>([]);
const downloadData = ref<number[]>([]);
const timeLabels = ref<string[]>([]);
const lastNetSent = ref(0);
const lastNetRecv = ref(0);

function parseSpeed(speedStr: string): number {
  const match = speedStr.match(/([\d.]+)\s*(B|KB|MB|GB)\/s/);
  if (!match) return 0;
  const val = parseFloat(match[1]);
  const unit = match[2];
  const multipliers: Record<string, number> = { B: 1, KB: 1024, MB: 1048576, GB: 1073741824 };
  return val * (multipliers[unit] || 1);
}

function formatSpeed(bps: number): string {
  if (bps < 1024) return `${bps.toFixed(1)} B/s`;
  if (bps < 1048576) return `${(bps / 1024).toFixed(1)} KB/s`;
  if (bps < 1073741824) return `${(bps / 1048576).toFixed(1)} MB/s`;
  return `${(bps / 1073741824).toFixed(1)} GB/s`;
}

const { domRef: chartRef, updateOptions } = useEcharts(() => ({
  tooltip: {
    trigger: 'axis',
    axisPointer: { type: 'line' },
    formatter(params: any) {
      const items = params as Array<{ marker: string; seriesName: string; value: number }>;
      let result = `<div style="font-size:12px">${items[0] ? (params as any)[0].axisValue : ''}</div>`;
      for (const item of items) {
        result += `<div>${item.marker} ${item.seriesName}: <b>${formatSpeed(item.value)}</b></div>`;
      }
      return result;
    }
  },
  legend: { data: [$t('page.manage.radar.monitor.upload'), $t('page.manage.radar.monitor.download')], top: '0' },
  grid: { left: '3%', right: '4%', bottom: '3%', top: '15%', containLabel: true },
  xAxis: { type: 'category' as const, boundaryGap: false, data: [] as string[] },
  yAxis: {
    type: 'value' as const,
    axisLabel: {
      formatter(val: number) {
        return formatSpeed(val);
      }
    }
  },
  series: [
    {
      name: $t('page.manage.radar.monitor.upload'),
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(34, 197, 94, 0.3)' },
            { offset: 1, color: 'rgba(34, 197, 94, 0.02)' }
          ]
        }
      },
      itemStyle: { color: '#22c55e' },
      data: [] as number[]
    },
    {
      name: $t('page.manage.radar.monitor.download'),
      type: 'line' as const,
      smooth: true,
      showSymbol: false,
      areaStyle: {
        color: {
          type: 'linear' as const,
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: 'rgba(59, 130, 246, 0.3)' },
            { offset: 1, color: 'rgba(59, 130, 246, 0.02)' }
          ]
        }
      },
      itemStyle: { color: '#3b82f6' },
      data: [] as number[]
    }
  ]
}));

watch(
  () => props.realtime,
  val => {
    if (!val?.network_io) return;

    const up = parseSpeed(val.network_io.upload_speed);
    const down = parseSpeed(val.network_io.download_speed);

    uploadData.value.push(up);
    downloadData.value.push(down);
    timeLabels.value.push(val.timestamp?.split(' ')[1] || '');

    if (uploadData.value.length > MAX_POINTS) {
      uploadData.value.shift();
      downloadData.value.shift();
      timeLabels.value.shift();
    }

    lastNetSent.value = up;
    lastNetRecv.value = down;

    updateOptions(opts => {
      opts.xAxis.data = [...timeLabels.value];
      opts.series[0].data = [...uploadData.value];
      opts.series[1].data = [...downloadData.value];
      return opts;
    });
  }
);
</script>

<template>
  <NCard :title="$t('page.manage.radar.monitor.networkTrend')" :bordered="false" size="small" class="card-wrapper">
    <div ref="chartRef" class="h-300px"></div>
  </NCard>
</template>
