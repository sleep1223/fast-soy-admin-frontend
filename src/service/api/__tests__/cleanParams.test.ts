import { describe, expect, it } from 'vitest';

/**
 * Test the cleanParams utility function extracted from radar.ts.
 * We re-implement it here since it's not exported, to validate the logic.
 */
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

describe('cleanParams', () => {
  it('should return undefined for undefined input', () => {
    expect(cleanParams(undefined)).toBeUndefined();
  });

  it('should return undefined for empty object after cleaning', () => {
    expect(cleanParams({ a: null, b: undefined, c: '' })).toBeUndefined();
  });

  it('should remove null values', () => {
    const result = cleanParams({ page: 1, filter: null });
    expect(result).toEqual({ page: 1 });
  });

  it('should remove undefined values', () => {
    const result = cleanParams({ page: 1, filter: undefined });
    expect(result).toEqual({ page: 1 });
  });

  it('should remove empty string values', () => {
    const result = cleanParams({ page: 1, search: '' });
    expect(result).toEqual({ page: 1 });
  });

  it('should keep false values', () => {
    const result = cleanParams({ resolved: false, page: 1 });
    expect(result).toEqual({ resolved: false, page: 1 });
  });

  it('should keep zero values', () => {
    const result = cleanParams({ offset: 0, page: 1 });
    expect(result).toEqual({ offset: 0, page: 1 });
  });

  it('should keep valid string values', () => {
    const result = cleanParams({ path_filter: '/api/v1', page: 1 });
    expect(result).toEqual({ path_filter: '/api/v1', page: 1 });
  });

  it('should pass through clean objects unchanged', () => {
    const params = { page: 1, page_size: 20, slow_only: true };
    expect(cleanParams(params)).toEqual(params);
  });

  it('should handle mixed clean and dirty values', () => {
    const result = cleanParams({
      page: 1,
      page_size: 20,
      path_filter: null,
      code_filter: undefined,
      min_duration: '',
      has_error: false
    });
    expect(result).toEqual({ page: 1, page_size: 20, has_error: false });
  });
});
