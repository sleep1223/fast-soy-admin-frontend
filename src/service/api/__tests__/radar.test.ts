import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Mock @sa/axios before importing the module under test
const mockRequest = vi.fn();
vi.mock('@sa/axios', () => ({
  createFlatRequest: () => mockRequest
}));

// Mock import.meta.env
vi.stubEnv('DEV', true);

// Now import the functions (they will use the mocked createFlatRequest)
const {
  fetchRadarStats,
  fetchRadarDashboard,
  fetchRadarRequests,
  fetchRadarRequestDetail,
  fetchRadarRequestTimeline,
  fetchRadarQueries,
  fetchRadarSlowQueries,
  fetchRadarExceptions,
  fetchRadarExceptionResolve,
  fetchRadarUserLogs,
  fetchRadarPurge
} = await import('../radar');

describe('Radar API Service', () => {
  beforeEach(() => {
    mockRequest.mockReset();
    mockRequest.mockResolvedValue({ data: null, error: null });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('fetchRadarStats', () => {
    it('should call with /stats and no params when hours is undefined', async () => {
      await fetchRadarStats();
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/stats',
        method: 'get',
        params: undefined
      });
    });

    it('should pass hours param when provided', async () => {
      await fetchRadarStats(24);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/stats',
        method: 'get',
        params: { hours: 24 }
      });
    });
  });

  describe('fetchRadarDashboard', () => {
    it('should default to hours=1', async () => {
      await fetchRadarDashboard();
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/dashboard',
        method: 'get',
        params: { hours: 1 }
      });
    });

    it('should pass custom hours', async () => {
      await fetchRadarDashboard(6);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/dashboard',
        method: 'get',
        params: { hours: 6 }
      });
    });
  });

  describe('fetchRadarRequests', () => {
    it('should call with cleaned params', async () => {
      await fetchRadarRequests({ page: 1, page_size: 20, path_filter: '/api' });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/requests',
        method: 'get',
        params: { page: 1, page_size: 20, path_filter: '/api' }
      });
    });

    it('should strip null and undefined values', async () => {
      await fetchRadarRequests({ page: 1, page_size: 20, path_filter: null, code_filter: undefined });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/requests',
        method: 'get',
        params: { page: 1, page_size: 20 }
      });
    });

    it('should strip empty string values', async () => {
      await fetchRadarRequests({ page: 1, page_size: 10, path_filter: '' });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/requests',
        method: 'get',
        params: { page: 1, page_size: 10 }
      });
    });

    it('should handle no params', async () => {
      await fetchRadarRequests();
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/requests',
        method: 'get',
        params: undefined
      });
    });
  });

  describe('fetchRadarRequestDetail', () => {
    it('should call with request id in URL', async () => {
      await fetchRadarRequestDetail('abc-123');
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/requests/abc-123',
        method: 'get'
      });
    });
  });

  describe('fetchRadarRequestTimeline', () => {
    it('should call with request id in URL', async () => {
      await fetchRadarRequestTimeline('abc-123');
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/requests/abc-123/timeline',
        method: 'get'
      });
    });
  });

  describe('fetchRadarQueries', () => {
    it('should call with cleaned params', async () => {
      await fetchRadarQueries({ page: 1, page_size: 20, slow_only: true, threshold_ms: 100 });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/queries',
        method: 'get',
        params: { page: 1, page_size: 20, slow_only: true, threshold_ms: 100 }
      });
    });

    it('should strip falsy filter values', async () => {
      await fetchRadarQueries({ page: 1, page_size: 20, slow_only: undefined });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/queries',
        method: 'get',
        params: { page: 1, page_size: 20 }
      });
    });
  });

  describe('fetchRadarSlowQueries', () => {
    it('should pass limit param', async () => {
      await fetchRadarSlowQueries(10);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/queries/slow',
        method: 'get',
        params: { limit: 10 }
      });
    });
  });

  describe('fetchRadarExceptions', () => {
    it('should call with cleaned params', async () => {
      await fetchRadarExceptions({ page: 1, page_size: 10, resolved: false });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/exceptions',
        method: 'get',
        params: { page: 1, page_size: 10, resolved: false }
      });
    });

    it('should strip null values', async () => {
      await fetchRadarExceptions({ page: 1, page_size: 10, path_filter: null, error_type: null });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/exceptions',
        method: 'get',
        params: { page: 1, page_size: 10 }
      });
    });
  });

  describe('fetchRadarExceptionResolve', () => {
    it('should PUT with resolved=true', async () => {
      await fetchRadarExceptionResolve('req-001', true);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/exceptions/req-001/resolve',
        method: 'put',
        data: { resolved: true }
      });
    });

    it('should PUT with resolved=false', async () => {
      await fetchRadarExceptionResolve('req-001', false);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/exceptions/req-001/resolve',
        method: 'put',
        data: { resolved: false }
      });
    });
  });

  describe('fetchRadarUserLogs', () => {
    it('should call with level filter', async () => {
      await fetchRadarUserLogs({ page: 1, page_size: 20, level: 'ERROR' });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/user-logs',
        method: 'get',
        params: { page: 1, page_size: 20, level: 'ERROR' }
      });
    });

    it('should strip null level', async () => {
      await fetchRadarUserLogs({ page: 1, page_size: 20, level: null });
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/user-logs',
        method: 'get',
        params: { page: 1, page_size: 20 }
      });
    });
  });

  describe('fetchRadarPurge', () => {
    it('should call DELETE with retention_hours', async () => {
      await fetchRadarPurge(48);
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/purge',
        method: 'delete',
        params: { retention_hours: 48 }
      });
    });

    it('should handle undefined retention', async () => {
      await fetchRadarPurge();
      expect(mockRequest).toHaveBeenCalledWith({
        url: '/purge',
        method: 'delete',
        params: { retention_hours: undefined }
      });
    });
  });
});
