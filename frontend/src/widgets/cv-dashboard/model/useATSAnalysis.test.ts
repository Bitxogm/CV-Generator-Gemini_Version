import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useATSAnalysis } from './useATSAnalysis';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/entities/cv/api', () => ({
  cvService: {
    generateSuggestions: vi.fn(),
  },
}));

const mockT = (key: string) => key;

const makeSuggestion = (
  id: string,
  text: string,
  priority: 'high' | 'medium' | 'low' = 'medium',
) => ({
  id,
  type: 'improve' as const,
  section: 'skills',
  text,
  priority,
});

describe('useATSAnalysis', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with null atsAnalysis and isAnalyzing=false', () => {
    const { result } = renderHook(() => useATSAnalysis(mockT));

    expect(result.current.atsAnalysis).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should return early without error when cvId is null', async () => {
    const { cvService } = await import('@/entities/cv/api');
    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV(null);
    });

    expect(cvService.generateSuggestions).not.toHaveBeenCalled();
    expect(result.current.atsAnalysis).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should compute score as 100 - suggestions*5 (4 suggestions → 80)', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce([
      makeSuggestion('1', 'Add Docker'),
      makeSuggestion('2', 'Include metrics'),
      makeSuggestion('3', 'Improve summary'),
      makeSuggestion('4', 'Add Kubernetes'),
    ]);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis?.score).toBe(80);
  });

  it('should cap penalty at 40 (8+ suggestions → score stays at 60)', async () => {
    // penalty = Math.min(suggestions.length * 5, 40), so with 12 suggestions:
    // penalty = Math.min(60, 40) = 40 → score = Math.max(60, 50) = 60
    const { cvService } = await import('@/entities/cv/api');
    const lotsOfSuggestions = Array.from({ length: 12 }, (_, i) =>
      makeSuggestion(String(i), `Fix issue ${i}`, 'high'),
    );
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce(lotsOfSuggestions);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis?.score).toBe(60);
  });

  it('should set score to 100 when no suggestions', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce([]);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis?.score).toBe(100);
    expect(result.current.atsAnalysis?.suggestions).toHaveLength(0);
  });

  it('should classify low-priority suggestions as strengths', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce([
      makeSuggestion('1', 'Great React skills', 'low'),
      makeSuggestion('2', 'Good TypeScript knowledge', 'low'),
      makeSuggestion('3', 'Missing Docker', 'high'),
    ]);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis?.strengths).toContain('Great React skills');
    expect(result.current.atsAnalysis?.strengths).toContain('Good TypeScript knowledge');
    expect(result.current.atsAnalysis?.strengths).not.toContain('Missing Docker');
  });

  it('should classify high-priority suggestions as weaknesses', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce([
      makeSuggestion('1', 'Add Docker', 'high'),
      makeSuggestion('2', 'Learn Kubernetes', 'high'),
      makeSuggestion('3', 'Good React skills', 'low'),
    ]);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis?.weaknesses).toContain('Add Docker');
    expect(result.current.atsAnalysis?.weaknesses).toContain('Learn Kubernetes');
    expect(result.current.atsAnalysis?.weaknesses).not.toContain('Good React skills');
  });

  it('should reset isAnalyzing to false after successful analysis', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce([
      makeSuggestion('1', 'Add more detail', 'medium'),
    ]);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should return null and reset isAnalyzing on API error', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockRejectedValueOnce(new Error('API failure'));

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should clear analysis when clearAnalysis is called', async () => {
    const { cvService } = await import('@/entities/cv/api');
    vi.mocked(cvService.generateSuggestions).mockResolvedValueOnce([
      makeSuggestion('1', 'Improve summary', 'medium'),
    ]);

    const { result } = renderHook(() => useATSAnalysis(mockT));

    await act(async () => {
      await result.current.analyzeCV('cv-123');
    });

    expect(result.current.atsAnalysis).not.toBeNull();

    act(() => {
      result.current.clearAnalysis();
    });

    expect(result.current.atsAnalysis).toBeNull();
  });
});
