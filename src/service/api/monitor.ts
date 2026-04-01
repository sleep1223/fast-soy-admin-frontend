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

