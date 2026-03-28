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
      queryParams: string | null;
      responseStatus: number | null;
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
      status_filter?: number | null;
      min_duration?: number | null;
      has_error?: boolean | null;
    }

    /** request list */
    type RequestList = PaginatedData<RequestRecord>;

    /** SQL query record (camelCase from backend to_dict) */
    interface QueryRecord {
      id: number;
      requestId: number;
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
      createdAt: number;
      fmtCreatedAt: string;
    }

    /** exception search params */
    interface ExceptionSearchParams {
      page?: number;
      page_size?: number;
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
  }
}
