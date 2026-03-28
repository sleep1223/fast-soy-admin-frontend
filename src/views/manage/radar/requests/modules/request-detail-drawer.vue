<script setup lang="ts">
import { $t } from '@/locales';

interface Props {
  data: Api.Radar.RequestDetail | null;
  loading?: boolean;
}

defineProps<Props>();

const visible = defineModel<boolean>('visible', { default: false });
</script>

<template>
  <NDrawer v-model:show="visible" :width="640" display-directive="show">
    <NDrawerContent :title="$t('page.manage.radar.requests.detail')" :native-scrollbar="false" closable>
      <NSpin :show="loading">
        <template v-if="data">
          <NDescriptions :column="2" label-placement="left" bordered size="small">
            <NDescriptionsItem :label="$t('page.manage.radar.requests.method')">
              <NTag size="small">{{ data.method }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.status')">
              <NTag :type="data.responseStatus && data.responseStatus < 400 ? 'success' : 'error'" size="small">
                {{ data.responseStatus ?? '-' }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.path')" :span="2">
              {{ data.path }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.duration')">
              {{ data.durationMs?.toFixed(1) ?? '-' }}ms
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.createdAt')">
              {{ data.fmtCreatedAt }}
            </NDescriptionsItem>
            <NDescriptionsItem v-if="data.queryParams" :label="$t('page.manage.radar.requests.queryParams')" :span="2">
              <NCode :code="data.queryParams" language="text" word-wrap />
            </NDescriptionsItem>
          </NDescriptions>

          <!-- Error -->
          <template v-if="data.errorType">
            <NDivider>{{ $t('page.manage.radar.requests.error') }}</NDivider>
            <NAlert type="error" :title="data.errorType">
              {{ data.errorMessage }}
            </NAlert>
            <NCode v-if="data.errorTraceback" :code="data.errorTraceback" language="python" word-wrap class="mt-8px" />
          </template>

          <!-- Queries -->
          <template v-if="data.queries && data.queries.length > 0">
            <NDivider>SQL ({{ data.queries.length }})</NDivider>
            <NCollapse>
              <NCollapseItem
                v-for="(q, idx) in data.queries"
                :key="q.id"
                :title="`${q.operation || 'SQL'} - ${q.durationMs.toFixed(1)}ms`"
                :name="idx"
              >
                <NCode :code="q.sqlText" language="sql" word-wrap />
                <div v-if="q.params" class="mt-4px text-12px text-gray">
                  Params: {{ q.params }}
                </div>
              </NCollapseItem>
            </NCollapse>
          </template>

          <!-- User Logs -->
          <template v-if="data.user_logs && data.user_logs.length > 0">
            <NDivider>{{ $t('page.manage.radar.userLogs.title') }} ({{ data.user_logs.length }})</NDivider>
            <NTimeline>
              <NTimelineItem
                v-for="log in data.user_logs"
                :key="log.id"
                :type="log.level === 'ERROR' ? 'error' : log.level === 'WARNING' ? 'warning' : 'info'"
                :title="`[${log.level}] ${log.message}`"
                :time="log.offsetMs != null ? `+${log.offsetMs.toFixed(1)}ms` : ''"
              />
            </NTimeline>
          </template>
        </template>
      </NSpin>
    </NDrawerContent>
  </NDrawer>
</template>
