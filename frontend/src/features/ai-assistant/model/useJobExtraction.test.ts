import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useJobExtraction } from './useJobExtraction';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/shared/api', () => ({
  default: { post: vi.fn() },
}));

describe('useJobExtraction', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with isExtractingUrl=false', () => {
    const { result } = renderHook(() => useJobExtraction());
    expect(result.current.isExtractingUrl).toBe(false);
  });

  it('should return null for empty URL without calling API', async () => {
    const api = await import('@/shared/api');
    const { result } = renderHook(() => useJobExtraction());

    let extracted: string | null = null;
    await act(async () => {
      extracted = await result.current.extractFromUrl('');
    });

    expect(extracted).toBeNull();
    expect(api.default.post).not.toHaveBeenCalled();
  });

  it('should return null for whitespace-only URL', async () => {
    const { result } = renderHook(() => useJobExtraction());

    let extracted: string | null = null;
    await act(async () => {
      extracted = await result.current.extractFromUrl('   ');
    });

    expect(extracted).toBeNull();
  });

  it('should extract job info and format output on success', async () => {
    const api = await import('@/shared/api');
    vi.mocked(api.default.post).mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          title: 'Senior Developer',
          company: 'Tech Corp',
          description: 'We are looking for a senior developer.',
          requirements: ['5+ years React', 'TypeScript expertise'],
        },
      },
    });

    const { result } = renderHook(() => useJobExtraction());

    let extracted: string | null = null;
    await act(async () => {
      extracted = await result.current.extractFromUrl('https://example.com/job');
    });

    expect(extracted).toContain('Título: Senior Developer');
    expect(extracted).toContain('Empresa: Tech Corp');
    expect(extracted).toContain('We are looking for a senior developer.');
    expect(extracted).toContain('- 5+ years React');
    expect(extracted).toContain('- TypeScript expertise');
    expect(api.default.post).toHaveBeenCalledWith('/jobs/extract-from-url', {
      url: 'https://example.com/job',
    });
  });

  it('should return null when API response.data.success is false', async () => {
    const api = await import('@/shared/api');
    vi.mocked(api.default.post).mockResolvedValueOnce({
      data: { success: false },
    });

    const { result } = renderHook(() => useJobExtraction());

    let extracted: string | null = null;
    await act(async () => {
      extracted = await result.current.extractFromUrl('https://example.com/job');
    });

    expect(extracted).toBeNull();
  });

  it('should return null and reset isExtractingUrl on API error', async () => {
    const api = await import('@/shared/api');
    vi.mocked(api.default.post).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useJobExtraction());

    let extracted: string | null = null;
    await act(async () => {
      extracted = await result.current.extractFromUrl('https://example.com/job');
    });

    expect(extracted).toBeNull();
    expect(result.current.isExtractingUrl).toBe(false);
  });

  it('should be isExtractingUrl=false after successful extraction', async () => {
    const api = await import('@/shared/api');
    vi.mocked(api.default.post).mockResolvedValueOnce({
      data: {
        success: true,
        data: {
          title: 'Dev',
          company: 'Co',
          description: 'Desc',
          requirements: [],
        },
      },
    });

    const { result } = renderHook(() => useJobExtraction());

    await act(async () => {
      await result.current.extractFromUrl('https://example.com');
    });

    expect(result.current.isExtractingUrl).toBe(false);
  });
});
