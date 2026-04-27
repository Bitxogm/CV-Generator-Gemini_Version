import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useAIAssistant } from './useAIAssistant';

describe('useAIAssistant', () => {
  it('should initialize with default values', () => {
    const { result } = renderHook(() => useAIAssistant());

    expect(result.current.jobUrl).toBe('');
    expect(result.current.jobDescription).toBe('');
    expect(result.current.coverLetter).toBe('');
    expect(result.current.pdfFormat).toBe('minimal');
    expect(result.current.adaptation).toBeNull();
    expect(result.current.editedSummary).toBe('');
    expect(result.current.showPreview).toBe(false);
    expect(result.current.previewUrl).toBe('');
    expect(result.current.isEditingLetter).toBe(false);
    expect(result.current.isEditingSummary).toBe(false);
  });

  it('should update jobUrl', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setJobUrl('https://example.com/job');
    });

    expect(result.current.jobUrl).toBe('https://example.com/job');
  });

  it('should update jobDescription', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setJobDescription('Senior developer position');
    });

    expect(result.current.jobDescription).toBe('Senior developer position');
  });

  it('should update coverLetter', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setCoverLetter('Dear hiring manager...');
    });

    expect(result.current.coverLetter).toBe('Dear hiring manager...');
  });

  it('should update pdfFormat to formal', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setPdfFormat('formal');
    });

    expect(result.current.pdfFormat).toBe('formal');
  });

  it('should toggle showPreview', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setShowPreview(true);
    });

    expect(result.current.showPreview).toBe(true);

    act(() => {
      result.current.setShowPreview(false);
    });

    expect(result.current.showPreview).toBe(false);
  });

  it('should set previewUrl', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setPreviewUrl('data:application/pdf;base64,abc123');
    });

    expect(result.current.previewUrl).toBe('data:application/pdf;base64,abc123');
  });

  it('should set adaptation data', () => {
    const { result } = renderHook(() => useAIAssistant());

    const mockAdaptation = {
      compatibilityScore: 85,
      matchedSkills: ['React', 'TypeScript'],
      missingSkills: ['Docker'],
      overallRecommendations: ['Add more details'],
      suggestions: { summary: 'Updated summary' },
    };

    act(() => {
      result.current.setAdaptation(mockAdaptation);
    });

    expect(result.current.adaptation).toEqual(mockAdaptation);
  });

  it('should clear adaptation by setting null', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setAdaptation({
        compatibilityScore: 70,
        matchedSkills: [],
        missingSkills: [],
        overallRecommendations: [],
        suggestions: {},
      });
    });

    act(() => {
      result.current.setAdaptation(null);
    });

    expect(result.current.adaptation).toBeNull();
  });

  it('should toggle isEditingLetter', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setIsEditingLetter(true);
    });

    expect(result.current.isEditingLetter).toBe(true);
  });

  it('should update editedSummary', () => {
    const { result } = renderHook(() => useAIAssistant());

    act(() => {
      result.current.setEditedSummary('Professional with 5 years of experience');
    });

    expect(result.current.editedSummary).toBe('Professional with 5 years of experience');
  });
});
