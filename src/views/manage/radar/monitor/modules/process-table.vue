<script setup lang="tsx">
import { computed } from 'vue';
import { NTag } from 'naive-ui';
import type { DataTableColumns } from 'naive-ui';
import { $t } from '@/locales';

defineProps<{
  processes: Api.Monitor.ProcessInfo[];
}>();

function getUsageType(val: number): 'success' | 'warning' | 'error' {
  if (val >= 90) return 'error';
  if (val >= 70) return 'warning';
  return 'success';
}

function getStatusType(status: string): 'success' | 'info' | 'warning' | 'error' | 'default' {
  if (status === 'running') return 'success';
  if (status === 'sleeping') return 'info';
  if (status === 'stopped') return 'warning';
  if (status === 'zombie') return 'error';
  return 'default';
}

const columns = computed<DataTableColumns<Api.Monitor.ProcessInfo>>(() => [
  {
    title: 'PID',
    key: 'pid',
    width: 80,
    render(row) {
      return <span class="font-mono">{row.pid}</span>;
    }
  },
  {
    title: $t('page.manage.radar.monitor.processName'),
    key: 'name',
    minWidth: 150,
    ellipsis: { tooltip: true }
  },
  {
    title: 'CPU%',
    key: 'cpu_percent',
    width: 100,
    sorter: (a, b) => a.cpu_percent - b.cpu_percent,
    render(row) {
      return <NTag size="small" type={getUsageType(row.cpu_percent)}>{row.cpu_percent}%</NTag>;
    }
  },
  {
    title: $t('page.manage.radar.monitor.memPercent'),
    key: 'memory_percent',
    width: 100,
    sorter: (a, b) => a.memory_percent - b.memory_percent,
    render(row) {
      return <NTag size="small" type={getUsageType(row.memory_percent)}>{row.memory_percent}%</NTag>;
    }
  },
  {
    title: $t('page.manage.radar.monitor.status'),
    key: 'status',
    width: 100,
    render(row) {
      return <NTag size="small" type={getStatusType(row.status)}>{row.status}</NTag>;
    }
  },
  {
    title: $t('page.manage.radar.monitor.createTime'),
    key: 'create_time',
    width: 170
  }
]);
</script>

<template>
  <NCard :title="$t('page.manage.radar.monitor.topProcesses')" :bordered="false" size="small" class="card-wrapper">
    <NDataTable :columns="columns" :data="processes" :row-key="(row: Api.Monitor.ProcessInfo) => row.pid" size="small" :scroll-x="700" />
  </NCard>
</template>
