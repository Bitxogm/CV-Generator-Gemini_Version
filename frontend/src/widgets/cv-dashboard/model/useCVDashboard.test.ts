import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act, waitFor } from '@testing-library/react';
import { useCVDashboard } from './useCVDashboard';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/entities/cv/api', () => ({
  cvService: {
    getMyCVs: vi.fn(),
    create: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
}));

const mockT = (key: string) => key;

const makeCV = (id: string, title: string) => ({
  id,
  userId: 'user-1',
  title,
  cvData: {
    personalInfo: { fullName: 'Test User', email: 'test@example.com', phone: '', location: '' },
    summary: '',
    experience: [],
    education: [],
    skills: [],
  },
  createdAt: '2024-01-01T00:00:00Z',
  updatedAt: '2024-01-01T00:00:00Z',
});

describe('useCVDashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should start with empty savedCVs and null currentCVId', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.getMyCVs).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCVDashboard(mockT));

    expect(result.current.currentCVId).toBeNull();

    await waitFor(() => {
      expect(cvService.getMyCVs).toHaveBeenCalledOnce();
    });
  });

  it('should load CVs from API on mount', async () => {
    const { cvService } = await import('@/entities/cv/api');
    const mockCVs = [makeCV('1', 'CV 1'), makeCV('2', 'CV 2')];
    vi.mocked(cvService.getMyCVs).mockResolvedValueOnce(mockCVs as any);

    const { result } = renderHook(() => useCVDashboard(mockT));

    await waitFor(() => {
      expect(result.current.savedCVs).toHaveLength(2);
    });

    expect(result.current.savedCVs[0].id).toBe('1');
    expect(result.current.savedCVs[1].id).toBe('2');
  });

  it('should handle getMyCVs error without throwing', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.getMyCVs).mockRejectedValueOnce(new Error('API error'));

    const { result } = renderHook(() => useCVDashboard(mockT));

    await waitFor(() => {
      expect(cvService.getMyCVs).toHaveBeenCalled();
    });

    expect(result.current.savedCVs).toHaveLength(0);
  });

  it('should create a CV and set currentCVId', async () => {
    const { cvService } = await import('@/entities/cv/api');
    const newCV = makeCV('new-id', 'My New CV');

    vi.mocked(cvService.getMyCVs)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([newCV] as any);
    vi.mocked(cvService.create).mockResolvedValueOnce(newCV as any);

    const { result } = renderHook(() => useCVDashboard(mockT));
    await waitFor(() => expect(cvService.getMyCVs).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.createCV('My New CV', {} as any);
    });

    expect(cvService.create).toHaveBeenCalledWith({
      title: 'My New CV',
      cvData: {},
    });
    expect(result.current.currentCVId).toBe('new-id');
  });

  it('should reload CVs after creating one', async () => {
    const { cvService } = await import('@/entities/cv/api');
    const newCV = makeCV('cv-1', 'Created CV');

    vi.mocked(cvService.getMyCVs)
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([newCV] as any);
    vi.mocked(cvService.create).mockResolvedValueOnce(newCV as any);

    const { result } = renderHook(() => useCVDashboard(mockT));
    await waitFor(() => expect(cvService.getMyCVs).toHaveBeenCalledTimes(1));

    await act(async () => {
      await result.current.createCV('Created CV', {} as any);
    });

    await waitFor(() => {
      expect(result.current.savedCVs).toHaveLength(1);
    });
  });

  it('should return null and not set currentCVId on create error', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.getMyCVs).mockResolvedValueOnce([]);
    vi.mocked(cvService.create).mockRejectedValueOnce(new Error('Create error'));

    const { result } = renderHook(() => useCVDashboard(mockT));
    await waitFor(() => expect(cvService.getMyCVs).toHaveBeenCalled());

    let returnedId: string | null | undefined = undefined;
    await act(async () => {
      returnedId = await result.current.createCV('Broken CV', {} as any);
    });

    expect(returnedId).toBeNull();
    expect(result.current.currentCVId).toBeNull();
  });

  it('should delete a CV and reload the list', async () => {
    const { cvService } = await import('@/entities/cv/api');
    const cvs = [makeCV('1', 'CV 1'), makeCV('2', 'CV 2')];

    vi.mocked(cvService.getMyCVs)
      .mockResolvedValueOnce(cvs as any)
      .mockResolvedValueOnce([cvs[1]] as any);
    vi.mocked(cvService.delete).mockResolvedValueOnce(undefined);

    const { result } = renderHook(() => useCVDashboard(mockT));
    await waitFor(() => expect(result.current.savedCVs).toHaveLength(2));

    await act(async () => {
      await result.current.deleteCV('1');
    });

    expect(cvService.delete).toHaveBeenCalledWith('1');
    await waitFor(() => {
      expect(result.current.savedCVs).toHaveLength(1);
      expect(result.current.savedCVs[0].id).toBe('2');
    });
  });

  it('should handle delete error without throwing', async () => {
    const { cvService } = await import('@/entities/cv/api');
    const cvs = [makeCV('1', 'CV 1')];

    vi.mocked(cvService.getMyCVs).mockResolvedValueOnce(cvs as any);
    vi.mocked(cvService.delete).mockRejectedValueOnce(new Error('Delete error'));

    const { result } = renderHook(() => useCVDashboard(mockT));
    await waitFor(() => expect(result.current.savedCVs).toHaveLength(1));

    await act(async () => {
      await result.current.deleteCV('1');
    });

    expect(cvService.delete).toHaveBeenCalledWith('1');
  });

  it('should allow setCurrentCVId directly', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.getMyCVs).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useCVDashboard(mockT));

    act(() => {
      result.current.setCurrentCVId('manual-id');
    });

    expect(result.current.currentCVId).toBe('manual-id');
  });
});
