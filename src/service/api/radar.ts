import { createFlatRequest } from '@sa/axios';

/** Remove null, undefined, and empty string values from params to avoid FastAPI 422 errors */
function cleanParams<T extends Record<string, any>>(params?: T): Partial<T> | undefined {
  if (!params) return undefined;
  const cleaned: Record<string, any> = {};
  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      cleaned[key] = value;
    }
  }
  return Object.keys(cleaned).length > 0 ? (cleaned as Partial<T>) : undefined;
}

/** radar uses a separate base URL since it's not under /api/v1 */
const radarRequest = createFlatRequest(
  {
    baseURL: import.meta.env.DEV ? 'http://127.0.0.1:9999/__radar/api' : '/__radar/api'
  },
  {
    transform(response) {
      return response.data.data;
    },
    async onRequest(config) {
      return config;
    },
    isBackendSuccess(response) {
      return response.data.code === '0000';
    },
    async onBackendFail(response) {
      const message = response.data?.msg || 'Error';
      window.$message?.error(message);
    },
    onError(error) {
      window.$message?.error(error.message);
    }
  }
);

/** get radar stats overview */
export function fetchRadarStats() {
  return radarRequest<Api.Radar.Stats>({
    url: '/stats',
    method: 'get'
  });
}

/** get radar request list */
export function fetchRadarRequests(params?: Api.Radar.RequestSearchParams) {
  return radarRequest<Api.Radar.RequestList>({
    url: '/requests',
    method: 'get',
    params: cleanParams(params)
  });
}

/** get radar request detail */
export function fetchRadarRequestDetail(xRequestId: string) {
  return radarRequest<Api.Radar.RequestDetail>({
    url: `/requests/${xRequestId}`,
    method: 'get'
  });
}

/** get radar request timeline */
export function fetchRadarRequestTimeline(xRequestId: string) {
  return radarRequest<Api.Radar.TimelineItem[]>({
    url: `/requests/${xRequestId}/timeline`,
    method: 'get'
  });
}

/** get radar SQL query list */
export function fetchRadarQueries(params?: Api.Radar.QuerySearchParams) {
  return radarRequest<Api.Radar.QueryList>({
    url: '/queries',
    method: 'get',
    params: cleanParams(params)
  });
}

/** get radar slow queries */
export function fetchRadarSlowQueries(limit?: number) {
  return radarRequest<Api.Radar.QueryRecord[]>({
    url: '/queries/slow',
    method: 'get',
    params: { limit }
  });
}

/** get radar exception list */
export function fetchRadarExceptions(params?: Api.Radar.ExceptionSearchParams) {
  return radarRequest<Api.Radar.ExceptionList>({
    url: '/exceptions',
    method: 'get',
    params: cleanParams(params)
  });
}

/** get radar user logs */
export function fetchRadarUserLogs(params?: Api.Radar.UserLogSearchParams) {
  return radarRequest<Api.Radar.UserLogList>({
    url: '/user-logs',
    method: 'get',
    params: cleanParams(params)
  });
}

/** purge old radar data */
export function fetchRadarPurge(retentionHours?: number) {
  return radarRequest<{ deleted_count: number }>({
    url: '/purge',
    method: 'delete',
    params: { retention_hours: retentionHours }
  });
}
