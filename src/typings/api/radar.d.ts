declare namespace Api {
  namespace Radar {
    /** paginated list common fields */
    interface PaginatedData<T> {
      total: number;
      current: number;
      size: number;
      records: T[];
    }

    /** stats overview */
    interface Stats {
      request_count: number;
      avg_duration_ms: number;
      error_count: number;
      error_rate: number;
      query_count: number;
      slow_query_count: number;
      user_log_count: number;
    }

    /** request record (camelCase from backend to_dict) */
    interface RequestRecord {
      id: number;
      xRequestId: string;
      method: string;
      path: string;
      clientIp: string | null;
      queryParams: string | null;
      responseStatus: number | null;
      businessCode: string | null;
      durationMs: number | null;
      errorType: string | null;
      errorMessage: string | null;
      createdAt: number;
      fmtCreatedAt: string;
    }

    /** request detail */
    interface RequestDetail extends RequestRecord {
      requestHeaders: Record<string, string> | null;
      requestBody: string | null;
      responseHeaders: Record<string, string> | null;
      responseBody: string | null;
      errorTraceback: string | null;
      /** snake_case key from backend db.py */
      queries: QueryRecord[];
      /** snake_case key from backend db.py */
      user_logs: UserLogRecord[];
    }

    /** request search params (snake_case for FastAPI query params) */
    interface RequestSearchParams {
      page?: number;
      page_size?: number;
      path_filter?: string | null;
      code_filter?: string | null;
      min_duration?: number | null;
      has_error?: boolean | null;
    }

    /** request list */
    type RequestList = PaginatedData<RequestRecord>;

    /** SQL query record (camelCase from backend to_dict) */
    interface QueryRecord {
      id: number;
      requestId: number;
      xRequestId: string | null;
      requestPath: string | null;
      requestMethod: string | null;
      sqlText: string;
      params: string | null;
      operation: string | null;
      durationMs: number;
      connectionName: string | null;
      startOffsetMs: number | null;
      createdAt: number;
      fmtCreatedAt: string;
    }

    /** query search params (snake_case for FastAPI query params) */
    interface QuerySearchParams {
      page?: number;
      page_size?: number;
      slow_only?: boolean;
      threshold_ms?: number;
    }

    /** query list */
    type QueryList = PaginatedData<QueryRecord>;

    /** exception record (camelCase from backend to_dict) */
    interface ExceptionRecord {
      xRequestId: string;
      method: string;
      path: string;
      errorType: string;
      errorMessage: string;
      errorTraceback: string | null;
      durationMs: number | null;
      resolved: boolean;
      createdAt: number;
      fmtCreatedAt: string;
    }

    /** exception search params */
    interface ExceptionSearchParams {
      page?: number;
      page_size?: number;
      path_filter?: string | null;
      error_type?: string | null;
      resolved?: boolean | null;
    }

    /** exception list */
    type ExceptionList = PaginatedData<ExceptionRecord>;

    /** user log record (camelCase from backend to_dict) */
    interface UserLogRecord {
      id: number;
      requestId: number | null;
      level: string;
      message: string;
      data: string | null;
      source: string | null;
      offsetMs: number | null;
      createdAt: number;
      fmtCreatedAt: string;
    }

    /** user log search params */
    interface UserLogSearchParams {
      page?: number;
      page_size?: number;
      level?: string | null;
    }

    /** user log list */
    type UserLogList = PaginatedData<UserLogRecord>;

    /** timeline item */
    interface TimelineItem {
      type: 'query' | 'user_log' | 'exception';
      name: string;
      sql?: string;
      start_offset_ms: number | null;
      duration_ms: number;
    }

    /** dashboard stats */
    interface DashboardStats {
      total_requests: number;
      avg_response_time: number;
      total_queries: number;
      total_exceptions: number;
      success_rate: number;
      error_rate: number;
      rps: number;
      p50: number;
      p95: number;
      p99: number;
      avg_query_time: number;
      distribution: Array<{
        code: string;
        count: number;
      }>;
      response_time_trend: Array<{
        time: string;
        avg_response_time: number;
        request_count: number;
      }>;
      query_activity: Array<{
        time: string;
        query_count: number;
        avg_duration: number;
      }>;
    }
  }

  namespace Monitor {
    interface CpuInfo {
      usage: number;
      cores: number;
      threads: number;
    }

    interface MemoryInfo {
      usage: number;
      used: number;
      total: number;
      available: number;
    }

    interface DiskIO {
      usage: number;
      used: number;
      total: number;
      read_speed: string;
      write_speed: string;
      total_read: string;
      total_write: string;
    }

    interface NetworkIO {
      active_connections: number;
      total_connections: number;
      upload_speed: string;
      download_speed: string;
      total_sent: string;
      total_recv: string;
    }

    interface SystemStatus {
      load_1min: number;
      load_5min: number;
      load_15min: number;
      uptime: string;
      uptime_seconds: number;
      boot_time: string;
      total_processes: number;
      running_processes: number;
      sleeping_processes: number;
      online_users: number;
      update_time: string;
    }

    interface BasicInfo {
      hostname: string;
      ip_address: string;
      system: string;
      platform: string;
      architecture: string;
      processor: string;
      python_version: string;
    }

    interface ProcessInfo {
      pid: number;
      name: string;
      cpu_percent: number;
      memory_percent: number;
      status: string;
      create_time: string;
    }

    interface Overview {
      basic_info: BasicInfo;
      cpu: CpuInfo;
      memory: MemoryInfo;
      disk_io: DiskIO;
      network_io: NetworkIO;
      system_status: SystemStatus;
      top_processes: ProcessInfo[];
    }

    interface Realtime {
      cpu: CpuInfo;
      memory: MemoryInfo;
      disk_io: DiskIO;
      network_io: NetworkIO;
      system_status: SystemStatus;
      top_processes: ProcessInfo[];
      timestamp: string;
    }
  }
}
