import { request } from '../request';

/** get system monitor overview */
export function fetchMonitorOverview() {
  return request<Api.Monitor.Overview>({
    url: '/monitor/overview',
    method: 'get'
  });
}

/** get system monitor realtime data */
export function fetchMonitorRealtime() {
  return request<Api.Monitor.Realtime>({
    url: '/monitor/realtime',
    method: 'get'
  });
}

/** get basic system info */
export function fetchMonitorBasicInfo() {
  return request<Api.Monitor.BasicInfo>({
    url: '/monitor/basic-info',
    method: 'get'
  });
}

/** get top processes */
export function fetchMonitorProcesses(limit?: number) {
  return request<Api.Monitor.ProcessInfo[]>({
    url: '/monitor/processes',
    method: 'get',
    params: { limit }
  });
}
