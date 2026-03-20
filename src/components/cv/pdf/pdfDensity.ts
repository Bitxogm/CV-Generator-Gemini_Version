import { CVData } from "@/types/cv";

export type PdfDensity = "normal" | "compact" | "ultra";

const estimateLines = (text: string | undefined, charsPerLine: number) => {
  if (!text) return 0;
  const normalized = text.replace(/\s+/g, " ").trim();
  if (!normalized) return 0;
  return Math.ceil(normalized.length / charsPerLine);
};

const estimateArrayLines = (
  count: number,
  itemsPerLine: number,
  minLines = 1,
) => {
  if (count <= 0) return 0;
  return Math.max(minLines, Math.ceil(count / itemsPerLine));
};

export const estimateCvLineBudget = (data: CVData) => {
  let lines = 8; // Header + contact

  lines += estimateLines(data.summary, 95) + (data.summary ? 2 : 0);

  if (data.experience.length > 0) {
    lines += 2;
    lines += data.experience.reduce((acc, exp) => {
      const base = 4;
      const descriptionLines = estimateLines(exp.description, 100);
      return acc + base + descriptionLines;
    }, 0);
  }

  if (data.education.length > 0) {
    lines += 2;
    lines += data.education.length * 3;
  }

  if (data.skills.length > 0) {
    lines += 2 + estimateArrayLines(data.skills.length, 8);
  }

  if (data.softSkills && data.softSkills.length > 0) {
    lines += 2 + estimateArrayLines(data.softSkills.length, 8);
  }

  if (data.projects && data.projects.length > 0) {
    lines += 2;
    lines += data.projects.reduce((acc, project) => {
      const base = 3;
      const descriptionLines = estimateLines(project.description, 105);
      const techLines = estimateArrayLines(project.technologies.length, 10, 0);
      return acc + base + descriptionLines + techLines;
    }, 0);
  }

  if (data.languages && data.languages.length > 0) {
    lines += 2 + estimateArrayLines(data.languages.length, 4);
  }

  return lines;
};

export const getPdfDensity = (data: CVData): PdfDensity => {
  const estimatedLines = estimateCvLineBudget(data);

  if (estimatedLines > 115) return "ultra";
  if (estimatedLines > 90) return "compact";
  return "normal";
};

export const getPdfScales = (density: PdfDensity) => {
  switch (density) {
    case "ultra":
      return { fontScale: 0.8, spacingScale: 0.68 };
    case "compact":
      return { fontScale: 0.9, spacingScale: 0.82 };
    case "normal":
    default:
      return { fontScale: 1, spacingScale: 1 };
  }
};
