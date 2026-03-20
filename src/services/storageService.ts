// src/services/storageService.ts

import { CVData } from "@/types/cv";

const STORAGE_KEYS = {
  CV_DATA: "cv_generator_data",
  CV_HISTORY: "cv_generator_history",
  SETTINGS: "cv_generator_settings",
  COVER_LETTERS: "cv_generator_cover_letters",
} as const;

interface CVVersion {
  id: string;
  name: string;
  data: CVData;
  createdAt: string;
}

interface CoverLetter {
  id: string;
  jobTitle: string;
  content: string;
  createdAt: string;
}

export class StorageService {
  // ============================================
  // CV Data
  // ============================================

  static saveCVData(cvData: CVData): boolean {
    try {
      const dataToSave = {
        ...cvData,
        lastModified: new Date().toISOString(),
      };

      localStorage.setItem(STORAGE_KEYS.CV_DATA, JSON.stringify(dataToSave));

      console.log("💾 CV guardado en localStorage");
      return true;
    } catch (error) {
      console.error("❌ Error al guardar CV:", error);

      // Si es por falta de espacio, mostrar mensaje específico
      if (
        error instanceof DOMException &&
        error.name === "QuotaExceededError"
      ) {
        console.error(
          "⚠️ localStorage lleno. Considera limpiar versiones antiguas.",
        );
      }

      return false;
    }
  }

  static loadCVData(): CVData | null {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CV_DATA);
      if (!data) return null;

      const parsed = JSON.parse(data);
      console.log("✅ CV cargado desde localStorage");
      return parsed;
    } catch (error) {
      console.error("❌ Error al cargar CV:", error);
      return null;
    }
  }

  static deleteCVData(): boolean {
    try {
      localStorage.removeItem(STORAGE_KEYS.CV_DATA);
      console.log("🗑️ CV eliminado de localStorage");
      return true;
    } catch (error) {
      console.error("❌ Error al eliminar CV:", error);
      return false;
    }
  }

  // ============================================
  // CV History (múltiples versiones)
  // ============================================

  static saveCVVersion(cvData: CVData, name: string): boolean {
    try {
      const history = this.loadCVHistory();

      const newVersion: CVVersion = {
        id: Date.now().toString(),
        name,
        data: cvData,
        createdAt: new Date().toISOString(),
      };

      history.unshift(newVersion);

      // Mantener solo las últimas 10 versiones para no llenar el storage
      const limitedHistory = history.slice(0, 10);

      localStorage.setItem(
        STORAGE_KEYS.CV_HISTORY,
        JSON.stringify(limitedHistory),
      );

      console.log(`💾 Versión "${name}" guardada`);
      return true;
    } catch (error) {
      console.error("❌ Error al guardar versión:", error);
      return false;
    }
  }

  static loadCVHistory(): CVVersion[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CV_HISTORY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("❌ Error al cargar historial:", error);
      return [];
    }
  }

  static deleteCVVersion(id: string): boolean {
    try {
      const history = this.loadCVHistory();
      const filtered = history.filter((v) => v.id !== id);

      localStorage.setItem(STORAGE_KEYS.CV_HISTORY, JSON.stringify(filtered));

      console.log(`🗑️ Versión ${id} eliminada`);
      return true;
    } catch (error) {
      console.error("❌ Error al eliminar versión:", error);
      return false;
    }
  }

  static loadCVVersion(id: string): CVData | null {
    try {
      const history = this.loadCVHistory();
      const version = history.find((v) => v.id === id);
      return version ? version.data : null;
    } catch (error) {
      console.error("❌ Error al cargar versión:", error);
      return null;
    }
  }

  // ============================================
  // Cover Letters
  // ============================================

  static saveCoverLetter(letter: string, jobTitle: string): boolean {
    try {
      const letters = this.loadCoverLetters();

      const newLetter: CoverLetter = {
        id: Date.now().toString(),
        jobTitle: jobTitle.substring(0, 100), // Limitar longitud
        content: letter,
        createdAt: new Date().toISOString(),
      };

      letters.unshift(newLetter);

      // Mantener solo las últimas 20 cartas
      const limitedLetters = letters.slice(0, 20);

      localStorage.setItem(
        STORAGE_KEYS.COVER_LETTERS,
        JSON.stringify(limitedLetters),
      );

      console.log(`💾 Carta para "${jobTitle}" guardada`);
      return true;
    } catch (error) {
      console.error("❌ Error al guardar carta:", error);
      return false;
    }
  }

  static loadCoverLetters(): CoverLetter[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.COVER_LETTERS);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("❌ Error al cargar cartas:", error);
      return [];
    }
  }

  static loadCoverLetter(id: string): CoverLetter | null {
    try {
      const letters = this.loadCoverLetters();
      return letters.find((l) => l.id === id) || null;
    } catch (error) {
      console.error("❌ Error al cargar carta:", error);
      return null;
    }
  }

  static deleteCoverLetter(id: string): boolean {
    try {
      const letters = this.loadCoverLetters();
      const filtered = letters.filter((l) => l.id !== id);

      localStorage.setItem(
        STORAGE_KEYS.COVER_LETTERS,
        JSON.stringify(filtered),
      );

      console.log(`🗑️ Carta ${id} eliminada`);
      return true;
    } catch (error) {
      console.error("❌ Error al eliminar carta:", error);
      return false;
    }
  }

  // ============================================
  // Settings
  // ============================================

  static saveSettings(settings: Record<string, unknown>): boolean {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));

      console.log("💾 Configuración guardada");
      return true;
    } catch (error) {
      console.error("❌ Error al guardar configuración:", error);
      return false;
    }
  }

  static loadSettings(): Record<string, unknown> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? (JSON.parse(data) as Record<string, unknown>) : {};
    } catch (error) {
      console.error("❌ Error al cargar configuración:", error);
      return {};
    }
  }

  // ============================================
  // Utilidades
  // ============================================

  static exportAllData(): string {
    try {
      const allData = {
        cvData: this.loadCVData(),
        history: this.loadCVHistory(),
        coverLetters: this.loadCoverLetters(),
        settings: this.loadSettings(),
        exportedAt: new Date().toISOString(),
        version: "1.0",
      };

      return JSON.stringify(allData, null, 2);
    } catch (error) {
      console.error("❌ Error al exportar datos:", error);
      return "";
    }
  }

  static importAllData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);

      // Validar versión
      if (!data.version) {
        console.warn("⚠️ Importando datos sin versión");
      }

      if (data.cvData) {
        this.saveCVData(data.cvData);
      }

      if (data.history && Array.isArray(data.history)) {
        localStorage.setItem(
          STORAGE_KEYS.CV_HISTORY,
          JSON.stringify(data.history),
        );
      }

      if (data.coverLetters && Array.isArray(data.coverLetters)) {
        localStorage.setItem(
          STORAGE_KEYS.COVER_LETTERS,
          JSON.stringify(data.coverLetters),
        );
      }

      if (data.settings) {
        this.saveSettings(data.settings);
      }

      console.log("✅ Datos importados correctamente");
      return true;
    } catch (error) {
      console.error("❌ Error al importar datos:", error);
      return false;
    }
  }

  static downloadBackup(): void {
    try {
      const json = this.exportAllData();
      const blob = new Blob([json], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cv-backup-${new Date().toISOString().split("T")[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      console.log("✅ Backup descargado");
    } catch (error) {
      console.error("❌ Error al descargar backup:", error);
    }
  }

  static clearAllData(): boolean {
    try {
      const confirmed = window.confirm(
        "⚠️ ¿Estás seguro de que quieres eliminar TODOS los datos?\n\n" +
          "Esto incluye:\n" +
          "• Tu CV actual\n" +
          "• Todas las versiones guardadas\n" +
          "• Todas las cartas de presentación\n" +
          "• Configuración\n\n" +
          "Esta acción NO se puede deshacer.",
      );

      if (!confirmed) {
        return false;
      }

      Object.values(STORAGE_KEYS).forEach((key) => {
        localStorage.removeItem(key);
      });

      console.log("🗑️ Todos los datos eliminados");
      return true;
    } catch (error) {
      console.error("❌ Error al limpiar datos:", error);
      return false;
    }
  }

  static getStorageInfo(): {
    used: string;
    usedBytes: number;
    available: string;
    percentUsed: number;
  } {
    try {
      let totalSize = 0;

      for (const key of Object.keys(localStorage)) {
        const value = localStorage.getItem(key) ?? "";
        const itemSize = value.length + key.length;
        totalSize += itemSize * 2; // UTF-16 = 2 bytes por char
      }

      const maxSize = 5 * 1024 * 1024; // 5MB (típico)
      const usedKB = (totalSize / 1024).toFixed(2);
      const availableKB = ((maxSize - totalSize) / 1024).toFixed(2);
      const percentUsed = ((totalSize / maxSize) * 100).toFixed(1);

      return {
        used: `${usedKB} KB`,
        usedBytes: totalSize,
        available: `${availableKB} KB`,
        percentUsed: parseFloat(percentUsed),
      };
    } catch (error) {
      return {
        used: "N/A",
        usedBytes: 0,
        available: "N/A",
        percentUsed: 0,
      };
    }
  }

  static getItemCount(): {
    cvVersions: number;
    coverLetters: number;
    hasCurrentCV: boolean;
  } {
    return {
      cvVersions: this.loadCVHistory().length,
      coverLetters: this.loadCoverLetters().length,
      hasCurrentCV: this.loadCVData() !== null,
    };
  }
}

export default StorageService;
