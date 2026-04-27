import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateCoverLetterPDF, generateCoverLetterPreview } from './pdfGenerator';

// jsPDF is a named export in "jspdf"
vi.mock('jspdf', () => {
  const MockJsPDF = vi.fn().mockImplementation(() => ({
    internal: { pageSize: { getWidth: () => 210, getHeight: () => 297 } },
    setFontSize: vi.fn(),
    setFont: vi.fn(),
    setTextColor: vi.fn(),
    setDrawColor: vi.fn(),
    text: vi.fn(),
    setLineWidth: vi.fn(),
    line: vi.fn(),
    splitTextToSize: vi.fn((text: string) => [text]),
    addPage: vi.fn(),
    save: vi.fn(),
    output: vi.fn(() => 'data:application/pdf;base64,mockpdf'),
  }));

  return { jsPDF: MockJsPDF };
});

const baseOptions = {
  candidateName: 'John Doe',
  companyName: 'Tech Corp',
  position: 'Senior Developer',
  email: 'john@example.com',
  phone: '+34 123 456 789',
  location: 'Madrid, Spain',
};

describe('pdfGenerator', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('generateCoverLetterPDF', () => {
    it('should return true on successful PDF generation (minimal format)', () => {
      const result = generateCoverLetterPDF('Cover letter content.', {
        ...baseOptions,
        format: 'minimal',
      });
      expect(result).toBe(true);
    });

    it('should return true on successful PDF generation (formal format)', () => {
      const result = generateCoverLetterPDF('Cover letter content.', {
        ...baseOptions,
        format: 'formal',
      });
      expect(result).toBe(true);
    });

    it('should not throw when called with no options', () => {
      expect(() => generateCoverLetterPDF('Some content')).not.toThrow();
    });

    it('should not throw when called with empty options object', () => {
      expect(() => generateCoverLetterPDF('Some content', {})).not.toThrow();
    });

    it('should call save() on the PDF instance', async () => {
      const { jsPDF } = await import('jspdf');
      generateCoverLetterPDF('Content', baseOptions);
      const instance = vi.mocked(jsPDF).mock.results[0].value;
      expect(instance.save).toHaveBeenCalled();
    });

    it('should return false when PDF generation throws', async () => {
      const { jsPDF } = await import('jspdf');
      vi.mocked(jsPDF).mockImplementationOnce(() => {
        throw new Error('PDF library error');
      });

      const result = generateCoverLetterPDF('Content', baseOptions);
      expect(result).toBe(false);
    });
  });

  describe('generateCoverLetterPreview', () => {
    it('should return the data URL from output()', () => {
      const result = generateCoverLetterPreview('Cover letter.', baseOptions);
      expect(result).toBe('data:application/pdf;base64,mockpdf');
    });

    it('should call output("dataurlstring") on the PDF instance', async () => {
      const { jsPDF } = await import('jspdf');
      generateCoverLetterPreview('Content', baseOptions);
      const instance = vi.mocked(jsPDF).mock.results[0].value;
      expect(instance.output).toHaveBeenCalledWith('dataurlstring');
    });

    it('should work with formal format', () => {
      const result = generateCoverLetterPreview('Content', {
        ...baseOptions,
        format: 'formal',
      });
      expect(result).toBe('data:application/pdf;base64,mockpdf');
    });

    it('should return empty string when PDF generation throws', async () => {
      const { jsPDF } = await import('jspdf');
      vi.mocked(jsPDF).mockImplementationOnce(() => {
        throw new Error('PDF library error');
      });

      const result = generateCoverLetterPreview('Content', baseOptions);
      expect(result).toBe('');
    });

    it('should not throw when called with no options', () => {
      expect(() => generateCoverLetterPreview('Content')).not.toThrow();
    });
  });
});
