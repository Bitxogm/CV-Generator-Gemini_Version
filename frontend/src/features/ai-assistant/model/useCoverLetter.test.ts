import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCoverLetter } from './useCoverLetter';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/shared/services', () => ({
  generateCoverLetter: vi.fn(),
}));

vi.mock('@/shared/utils', () => ({
  generateCoverLetterPDF: vi.fn(),
  generateCoverLetterPreview: vi.fn(),
}));

const mockT = (key: string) => key;

const mockCVData = {
  personalInfo: { fullName: 'John Doe', email: 'john@example.com', phone: '123', location: 'NY' },
  summary: 'Senior developer',
  experience: [],
  education: [],
  skills: ['React', 'TypeScript'],
};

describe('useCoverLetter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with loading states as false', () => {
    const { result } = renderHook(() => useCoverLetter(mockT));

    expect(result.current.isGeneratingLetter).toBe(false);
    expect(result.current.isDownloadingPDF).toBe(false);
  });

  it('should return null when jobDescription is empty', async () => {
    const { result } = renderHook(() => useCoverLetter(mockT));

    let letter: string | null = null;
    await act(async () => {
      letter = await result.current.generateCoverLetterContent(
        mockCVData as any,
        '',
        'Tech Corp',
      );
    });

    expect(letter).toBeNull();
  });

  it('should return null when jobDescription is whitespace only', async () => {
    const { result } = renderHook(() => useCoverLetter(mockT));

    let letter: string | null = null;
    await act(async () => {
      letter = await result.current.generateCoverLetterContent(
        mockCVData as any,
        '   ',
        'Tech Corp',
      );
    });

    expect(letter).toBeNull();
  });

  it('should generate cover letter and return it on success', async () => {
    const services = await import('@/shared/services');
    vi.mocked(services.generateCoverLetter).mockResolvedValueOnce(
      'Dear hiring manager, I am excited to apply.',
    );

    const { result } = renderHook(() => useCoverLetter(mockT));

    let letter: string | null = null;
    await act(async () => {
      letter = await result.current.generateCoverLetterContent(
        mockCVData as any,
        'Senior developer position at Tech Corp',
        'Tech Corp',
      );
    });

    expect(letter).toBe('Dear hiring manager, I am excited to apply.');
    expect(result.current.isGeneratingLetter).toBe(false);
  });

  it('should return null and reset loading state on service error', async () => {
    const services = await import('@/shared/services');
    vi.mocked(services.generateCoverLetter).mockRejectedValueOnce(
      new Error('Gemini API error'),
    );

    const { result } = renderHook(() => useCoverLetter(mockT));

    let letter: string | null = null;
    await act(async () => {
      letter = await result.current.generateCoverLetterContent(
        mockCVData as any,
        'Job description',
        'Tech Corp',
      );
    });

    expect(letter).toBeNull();
    expect(result.current.isGeneratingLetter).toBe(false);
  });

  it('should call generateCoverLetterPDF and reset isDownloadingPDF on success', async () => {
    const utils = await import('@/shared/utils');
    vi.mocked(utils.generateCoverLetterPDF).mockReturnValueOnce(true);

    const { result } = renderHook(() => useCoverLetter(mockT));

    await act(async () => {
      await result.current.downloadPDF('My cover letter content', { format: 'minimal' });
    });

    expect(utils.generateCoverLetterPDF).toHaveBeenCalledWith('My cover letter content', {
      format: 'minimal',
    });
    expect(result.current.isDownloadingPDF).toBe(false);
  });

  it('should copy text to clipboard', () => {
    const clipboardMock = { writeText: vi.fn() };
    Object.defineProperty(navigator, 'clipboard', {
      value: clipboardMock,
      configurable: true,
    });

    const { result } = renderHook(() => useCoverLetter(mockT));

    act(() => {
      result.current.copyToClipboard('My cover letter');
    });

    expect(clipboardMock.writeText).toHaveBeenCalledWith('My cover letter');
  });

  it('should return preview URL when generateCoverLetterPreview returns non-empty string', async () => {
    const utils = await import('@/shared/utils');
    vi.mocked(utils.generateCoverLetterPreview).mockReturnValueOnce(
      'data:application/pdf;base64,abc123',
    );

    const { result } = renderHook(() => useCoverLetter(mockT));

    let url: string | null = null;
    act(() => {
      url = result.current.previewLetter('My content', { format: 'formal' });
    });

    expect(url).toBe('data:application/pdf;base64,abc123');
  });

  it('should return null when generateCoverLetterPreview returns empty string', async () => {
    const utils = await import('@/shared/utils');
    vi.mocked(utils.generateCoverLetterPreview).mockReturnValueOnce('');

    const { result } = renderHook(() => useCoverLetter(mockT));

    let url: string | null = null;
    act(() => {
      url = result.current.previewLetter('My content', {});
    });

    expect(url).toBeNull();
  });
});
