import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useCVAdapter } from './useCVAdapter';

vi.mock('sonner', () => ({
  toast: { success: vi.fn(), error: vi.fn() },
}));

vi.mock('@/shared/services', () => ({
  analyzeCVCompatibility: vi.fn(),
  adaptCVWithGemini: vi.fn(),
}));

const mockT = (key: string) => key;

const mockCVData = {
  personalInfo: { fullName: 'John Doe', email: 'john@example.com', phone: '123', location: 'NY' },
  summary: 'Senior developer',
  experience: [],
  education: [],
  skills: ['React', 'TypeScript', 'Node.js'],
};

describe('useCVAdapter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should initialize with isAnalyzing=false', () => {
    const { result } = renderHook(() => useCVAdapter(mockT));
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should return null when jobDescription is empty', async () => {
    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: unknown = undefined;
    await act(async () => {
      adaptation = await result.current.adaptCV(mockCVData as any, '');
    });

    expect(adaptation).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should return null when jobDescription is whitespace only', async () => {
    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: unknown = undefined;
    await act(async () => {
      adaptation = await result.current.adaptCV(mockCVData as any, '   ');
    });

    expect(adaptation).toBeNull();
  });

  it('should return AdaptationData with correct structure on success', async () => {
    const services = await import('@/shared/services');

    vi.mocked(services.analyzeCVCompatibility).mockResolvedValueOnce({
      score: 80,
      analysis: 'Good match overall',
      missing: ['Docker', 'Kubernetes'],
    } as any);

    vi.mocked(services.adaptCVWithGemini).mockResolvedValueOnce({
      summary: 'Updated summary with Docker experience',
      skills: ['React', 'TypeScript', 'Docker'],
      experience: [],
    } as any);

    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: any = null;
    await act(async () => {
      adaptation = await result.current.adaptCV(
        mockCVData as any,
        'Senior developer with Docker and Kubernetes',
      );
    });

    expect(adaptation).not.toBeNull();
    expect(adaptation.compatibilityScore).toBe(80);
    expect(adaptation.missingSkills).toContain('Docker');
    expect(adaptation.missingSkills).toContain('Kubernetes');
    expect(adaptation.suggestions.summary).toBe('Updated summary with Docker experience');
    expect(result.current.isAnalyzing).toBe(false);
  });

  it('should include overallRecommendations when score < 50', async () => {
    const services = await import('@/shared/services');

    vi.mocked(services.analyzeCVCompatibility).mockResolvedValueOnce({
      score: 40,
      analysis: 'Low compatibility',
      missing: ['Python', 'ML'],
    } as any);

    vi.mocked(services.adaptCVWithGemini).mockResolvedValueOnce({
      summary: '',
      skills: [],
    } as any);

    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: any = null;
    await act(async () => {
      adaptation = await result.current.adaptCV(mockCVData as any, 'ML engineer role');
    });

    expect(adaptation.overallRecommendations).toContain(
      'Considera añadir más habilidades relevantes al puesto',
    );
  });

  it('should include positive recommendation when score >= 70', async () => {
    const services = await import('@/shared/services');

    vi.mocked(services.analyzeCVCompatibility).mockResolvedValueOnce({
      score: 75,
      analysis: 'High compatibility',
      missing: [],
    } as any);

    vi.mocked(services.adaptCVWithGemini).mockResolvedValueOnce({
      summary: '',
      skills: [],
    } as any);

    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: any = null;
    await act(async () => {
      adaptation = await result.current.adaptCV(mockCVData as any, 'React developer position');
    });

    expect(adaptation.overallRecommendations).toContain(
      'Tu perfil es muy compatible con este puesto',
    );
  });

  it('should match CV skills that appear in job description', async () => {
    const services = await import('@/shared/services');

    vi.mocked(services.analyzeCVCompatibility).mockResolvedValueOnce({
      score: 85,
      analysis: 'Excellent',
      missing: [],
    } as any);

    vi.mocked(services.adaptCVWithGemini).mockResolvedValueOnce({
      summary: '',
      skills: [],
    } as any);

    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: any = null;
    await act(async () => {
      adaptation = await result.current.adaptCV(
        mockCVData as any,
        'Looking for React and TypeScript developer with Node.js background',
      );
    });

    expect(adaptation.matchedSkills).toContain('React');
    expect(adaptation.matchedSkills).toContain('TypeScript');
    expect(adaptation.matchedSkills).toContain('Node.js');
  });

  it('should return null and reset isAnalyzing on service error', async () => {
    const services = await import('@/shared/services');
    vi.mocked(services.analyzeCVCompatibility).mockRejectedValueOnce(
      new Error('Gemini service error'),
    );

    const { result } = renderHook(() => useCVAdapter(mockT));

    let adaptation: unknown = undefined;
    await act(async () => {
      adaptation = await result.current.adaptCV(mockCVData as any, 'Job description here');
    });

    expect(adaptation).toBeNull();
    expect(result.current.isAnalyzing).toBe(false);
  });
});
