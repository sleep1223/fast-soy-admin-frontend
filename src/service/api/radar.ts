import type { AxiosResponse } from 'axios';
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
    transform(response: AxiosResponse<App.Service.Response<any>>) {
      return response.data.data;
    },
    async onRequest(config) {
      return config;
    },
    isBackendSuccess(response: AxiosResponse<App.Service.Response<any>>) {
      return response.data.code === '0000';
    },
    async onBackendFail(response: AxiosResponse<App.Service.Response<any>>) {
      const message = response.data?.msg || 'Error';
      window.$message?.error(message);
    },
    onError(error) {
      window.$message?.error(error.message);
    }
  }
);

/** get radar stats overview */
export function fetchRadarStats(hours?: number) {
  return radarRequest<Api.Radar.Stats>({
    url: '/stats',
    method: 'get',
    params: cleanParams({ hours })
  });
}

/** get radar dashboard stats */
export function fetchRadarDashboard(hours?: number) {
  return radarRequest<Api.Radar.DashboardStats>({
    url: '/dashboard',
    method: 'get',
    params: { hours: hours || 1 }
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

/** get radar SQL query list */
export function fetchRadarQueries(params?: Api.Radar.QuerySearchParams) {
  return radarRequest<Api.Radar.QueryList>({
    url: '/queries',
    method: 'get',
    params: cleanParams(params)
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

/** toggle exception resolved status */
export function fetchRadarExceptionResolve(xRequestId: string, resolved: boolean) {
  return radarRequest<null>({
    url: `/exceptions/${xRequestId}/resolve`,
    method: 'put',
    data: { resolved }
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
