import { jsPDF } from 'jspdf';

export type CoverLetterFormat = 'minimal' | 'formal';

interface PDFOptions {
  candidateName?: string;
  companyName?: string;
  position?: string;
  format?: CoverLetterFormat;
  email?: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  language?: 'es' | 'en';
}

export const generateCoverLetterPDF = (
  coverLetterText: string,
  options?: PDFOptions
) => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const format = options?.format || 'minimal';
    
    if (format === 'formal') {
      generateFormalPDF(doc, coverLetterText, options);
    } else {
      generateMinimalPDF(doc, coverLetterText, options);
    }

    const fileName = generateFileName(options);
    doc.save(fileName);
    
    return true;
  } catch (error) {
    console.error('Error al generar el PDF:', error);
    return false;
  }
};

// Genera vista previa como data URL
export const generateCoverLetterPreview = (
  coverLetterText: string,
  options?: PDFOptions
): string => {
  try {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const format = options?.format || 'minimal';
    
    if (format === 'formal') {
      generateFormalPDF(doc, coverLetterText, options);
    } else {
      generateMinimalPDF(doc, coverLetterText, options);
    }

    return doc.output('dataurlstring');
  } catch (error) {
    console.error('Error al generar la vista previa:', error);
    return '';
  }
};

// Formato Minimalista
const generateMinimalPDF = (
  doc: jsPDF,
  coverLetterText: string,
  options?: PDFOptions
) => {
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 20;
  const marginBottom = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginLeft - marginRight;
  const maxContentHeight = pageHeight - marginTop - marginBottom;

  doc.setFont('helvetica');

  // Fecha arriba a la derecha
  doc.setFontSize(9);
  doc.setTextColor(100);
  const locale = options?.language === 'en' ? 'en-US' : 'es-ES';
  const currentDate = new Date().toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const defaultCity = options?.language === 'en' ? 'New York' : 'Cantabria';
  const location = options?.location ? options.location.split(',')[0] : defaultCity;
  const dateText = `${location}, ${currentDate}`;
  doc.text(dateText, pageWidth - marginRight, marginTop, { align: 'right' });

  // Calcular y renderizar contenido ajustado a una página
  let startY = marginTop + 12;
  renderContentInOnePage(doc, coverLetterText, marginLeft, startY, contentWidth, maxContentHeight, marginTop);
};

// Formato Formal
const generateFormalPDF = (
  doc: jsPDF,
  coverLetterText: string,
  options?: PDFOptions
) => {
  const marginLeft = 20;
  const marginRight = 20;
  const marginTop = 15;
  const marginBottom = 20;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - marginLeft - marginRight;

  doc.setFont('helvetica');
  let yPosition = marginTop;

  // Datos del remitente (arriba a la derecha) - más compacto
  doc.setFontSize(8.5);
  doc.setTextColor(60);
  
  if (options?.candidateName) {
    doc.text(options.candidateName, pageWidth - marginRight, yPosition, { align: 'right' });
    yPosition += 4;
  }
  
  if (options?.email) {
    doc.text(options.email, pageWidth - marginRight, yPosition, { align: 'right' });
    yPosition += 4;
  }
  
  if (options?.phone) {
    doc.text(options.phone, pageWidth - marginRight, yPosition, { align: 'right' });
    yPosition += 4;
  }
  
  if (options?.location) {
    doc.text(options.location, pageWidth - marginRight, yPosition, { align: 'right' });
    yPosition += 4;
  }
  
  if (options?.linkedin) {
    const linkedinText = options.linkedin.replace('https://', '').replace('http://', '');
    doc.text(linkedinText, pageWidth - marginRight, yPosition, { align: 'right' });
    yPosition += 4;
  }

  // Espacio después de datos
  yPosition += 6;

  // Fecha
  doc.setFontSize(9);
  doc.setTextColor(100);
  const locale = options?.language === 'en' ? 'en-US' : 'es-ES';
  const currentDate = new Date().toLocaleDateString(locale, {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
  const defaultCity = options?.language === 'en' ? 'New York' : 'Cantabria';
  const location = options?.location ? options.location.split(',')[0] : defaultCity;
  doc.text(`${location}, ${currentDate}`, marginLeft, yPosition);
  
  yPosition += 10;

  // Calcular espacio disponible para el contenido
  const maxContentHeight = pageHeight - yPosition - marginBottom;
  
  // Renderizar contenido ajustado
  renderContentInOnePage(doc, coverLetterText, marginLeft, yPosition, contentWidth, maxContentHeight, yPosition);
};

// Renderizar contenido ajustado a UNA PÁGINA
const renderContentInOnePage = (
  doc: jsPDF,
  text: string,
  marginLeft: number,
  startY: number,
  contentWidth: number,
  maxHeight: number,
  topMargin: number
) => {
  // Intentar con diferentes tamaños de fuente hasta que quepa
  const fontSizes = [10.5, 10, 9.5, 9, 8.5, 8];
  const lineSpacings = [5.5, 5.2, 5, 4.8, 4.5, 4.2];
  
  let fittingConfig = null;
  
  for (let i = 0; i < fontSizes.length; i++) {
    const fontSize = fontSizes[i];
    const lineSpacing = lineSpacings[i];
    
    const testHeight = calculateTextHeight(doc, text, contentWidth, fontSize, lineSpacing);
    
    if (testHeight <= maxHeight) {
      fittingConfig = { fontSize, lineSpacing };
      break;
    }
  }
  
  // Si no cabe ni con el tamaño más pequeño, usar el más pequeño de todos modos
  if (!fittingConfig) {
    fittingConfig = { 
      fontSize: fontSizes[fontSizes.length - 1], 
      lineSpacing: lineSpacings[lineSpacings.length - 1] 
    };
  }
  
  // Renderizar el texto con la configuración que cabe
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(fittingConfig.fontSize);
  doc.setTextColor(40);

  const lines = text.split('\n');
  let yPosition = startY;

  lines.forEach((line) => {
    if (line.trim() === '') {
      // Línea vacía - añadir espacio reducido
      yPosition += fittingConfig.lineSpacing * 0.6;
    } else if (line.startsWith('•') || line.startsWith('-')) {
      // Viñeta
      const bulletText = line.replace(/^[•\-]\s*/, '');
      const bulletLines = doc.splitTextToSize(`• ${bulletText}`, contentWidth - 5);
      doc.text(bulletLines, marginLeft + 3, yPosition);
      yPosition += bulletLines.length * fittingConfig.lineSpacing;
    } else {
      // Texto normal
      const wrappedLines = doc.splitTextToSize(line, contentWidth);
      doc.text(wrappedLines, marginLeft, yPosition);
      yPosition += wrappedLines.length * fittingConfig.lineSpacing;
    }
  });
};

// Calcular altura total del texto
const calculateTextHeight = (
  doc: jsPDF,
  text: string,
  contentWidth: number,
  fontSize: number,
  lineSpacing: number
): number => {
  doc.setFontSize(fontSize);
  
  const lines = text.split('\n');
  let totalHeight = 0;

  lines.forEach((line) => {
    if (line.trim() === '') {
      totalHeight += lineSpacing * 0.6;
    } else if (line.startsWith('•') || line.startsWith('-')) {
      const bulletText = line.replace(/^[•\-]\s*/, '');
      const bulletLines = doc.splitTextToSize(`• ${bulletText}`, contentWidth - 5);
      totalHeight += bulletLines.length * lineSpacing;
    } else {
      const wrappedLines = doc.splitTextToSize(line, contentWidth);
      totalHeight += wrappedLines.length * lineSpacing;
    }
  });

  return totalHeight;
};

// Generar nombre de archivo
const generateFileName = (options?: PDFOptions): string => {
  const date = new Date().toISOString().split('T')[0];
  const prefix = options?.language === 'en' ? 'cover_letter' : 'carta_presentacion';

  if (options?.position) {
    const cleanPosition = options.position
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 30);
    return `${prefix}_${cleanPosition}_${date}.pdf`;
  }

  if (options?.companyName) {
    const cleanCompany = options.companyName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '_')
      .substring(0, 30);
    return `${prefix}_${cleanCompany}_${date}.pdf`;
  }

  return `${prefix}_${date}.pdf`;
};