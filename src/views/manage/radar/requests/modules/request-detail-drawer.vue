<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '@/store/modules/app';
import { $t } from '@/locales';
import AnsiTraceback from '@/components/common/ansi-traceback.vue';

interface Props {
  data: Api.Radar.RequestDetail | null;
  loading?: boolean;
}

defineProps<Props>();

const visible = defineModel<boolean>('visible', { default: false });

const appStore = useAppStore();
const drawerWidth = computed(() => (appStore.isMobile ? '100%' : 640));

function formatJson(obj: unknown): string {
  try {
    if (typeof obj === 'string') {
      return JSON.stringify(JSON.parse(obj), null, 2);
    }
    return JSON.stringify(obj, null, 2);
  } catch {
    return String(obj || '');
  }
}

function copyText(text: string) {
  navigator.clipboard.writeText(text).then(() => {
    window.$message?.success('Copied');
  });
}

function buildFullSql(sql: string, params: string | null): string {
  if (!params) return sql;
  try {
    const values: unknown[] = JSON.parse(params);
    let result = sql;
    for (const val of values) {
      if (typeof val === 'string') {
        result = result.replace('?', `'${val.replace(/'/g, "''")}'`);
      } else if (val === null) {
        result = result.replace('?', 'NULL');
      } else {
        result = result.replace('?', String(val));
      }
    }
    return result;
  } catch {
    return `${sql}\n-- Params: ${params}`;
  }
}
</script>

<template>
  <NDrawer v-model:show="visible" :width="drawerWidth" display-directive="show">
    <NDrawerContent :title="$t('page.manage.radar.requests.detail')" :native-scrollbar="false" closable>
      <NSpin :show="loading">
        <template v-if="data">
          <!-- Basic Info -->
          <NDescriptions :column="appStore.isMobile ? 1 : 2" label-placement="left" bordered size="small">
            <NDescriptionsItem :label="$t('page.manage.radar.requests.method')">
              <NTag size="small">{{ data.method }}</NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.status')">
              <NTag :type="data.responseStatus && data.responseStatus < 400 ? 'success' : 'error'" size="small">
                {{ data.responseStatus ?? '-' }}
              </NTag>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.path')" :span="appStore.isMobile ? 1 : 2">
              <span class="break-all">{{ data.path }}</span>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.xRequestId')" :span="appStore.isMobile ? 1 : 2">
              <div class="flex items-center gap-6px">
                <NTooltip>
                  <template #trigger>
                    <span class="break-all text-12px font-mono">
                      {{ appStore.isMobile ? `${data.xRequestId.slice(0, 12)}...` : data.xRequestId }}
                    </span>
                  </template>
                  {{ data.xRequestId }}
                </NTooltip>
                <NButton quaternary size="tiny" class="shrink-0" @click="copyText(data.xRequestId)">
                  <template #icon>
                    <icon-ic-round-content-copy class="text-14px" />
                  </template>
                </NButton>
              </div>
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.clientIp')">
              {{ data.clientIp || '-' }}
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.duration')">
              {{ data.durationMs?.toFixed(1) ?? '-' }}ms
            </NDescriptionsItem>
            <NDescriptionsItem :label="$t('page.manage.radar.requests.createdAt')" :span="appStore.isMobile ? 1 : 2">
              {{ data.fmtCreatedAt }}
            </NDescriptionsItem>
            <NDescriptionsItem v-if="data.queryParams" :label="$t('page.manage.radar.requests.queryParams')" :span="appStore.isMobile ? 1 : 2">
              <NCode :code="data.queryParams" language="text" word-wrap />
            </NDescriptionsItem>
          </NDescriptions>

          <!-- Request Headers / Body / Response Body -->
          <NCollapse class="mt-12px" :default-expanded-names="[]">
            <NCollapseItem
              v-if="data.requestHeaders"
              :title="$t('page.manage.radar.requests.requestHeaders')"
              name="reqHeaders"
            >
              <template #header-extra>
                <NButton quaternary size="tiny" @click.stop="copyText(formatJson(data.requestHeaders))">
                  <template #icon>
                    <icon-ic-round-content-copy class="text-14px" />
                  </template>
                </NButton>
              </template>
              <NCode :code="formatJson(data.requestHeaders)" language="json" word-wrap />
            </NCollapseItem>
            <NCollapseItem
              v-if="data.requestBody"
              :title="$t('page.manage.radar.requests.requestBody')"
              name="reqBody"
            >
              <template #header-extra>
                <NButton quaternary size="tiny" @click.stop="copyText(formatJson(data.requestBody))">
                  <template #icon>
                    <icon-ic-round-content-copy class="text-14px" />
                  </template>
                </NButton>
              </template>
              <NCode :code="formatJson(data.requestBody)" language="json" word-wrap />
            </NCollapseItem>
            <NCollapseItem
              v-if="data.responseBody"
              :title="$t('page.manage.radar.requests.responseBody')"
              name="respBody"
            >
              <template #header-extra>
                <NButton quaternary size="tiny" @click.stop="copyText(formatJson(data.responseBody))">
                  <template #icon>
                    <icon-ic-round-content-copy class="text-14px" />
                  </template>
                </NButton>
              </template>
              <NCode :code="formatJson(data.responseBody)" language="json" word-wrap />
            </NCollapseItem>
          </NCollapse>

          <!-- Error -->
          <template v-if="data.errorType">
            <NDivider>{{ $t('page.manage.radar.requests.error') }}</NDivider>
            <NAlert type="error" :title="data.errorType">
              {{ data.errorMessage }}
            </NAlert>
            <AnsiTraceback v-if="data.errorTraceback" :code="data.errorTraceback" class="mt-8px" />
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
                <template #header-extra>
                  <NButton quaternary size="tiny" @click.stop="copyText(buildFullSql(q.sqlText, q.params))">
                    <template #icon>
                      <icon-ic-round-content-copy class="text-14px" />
                    </template>
                  </NButton>
                </template>
                <NCode :code="buildFullSql(q.sqlText, q.params)" language="sql" word-wrap />
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
