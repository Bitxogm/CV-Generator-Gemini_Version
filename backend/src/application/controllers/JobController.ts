import { Request, Response } from 'express';
import { JobScraperService } from '../../infrastructure/services/JobScraperService';

const jobScraperService = new JobScraperService();

export const extractJobFromUrl = async (req: Request, res: Response) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: 'URL es requerida',
      });
    }

    // Validar que sea una URL válida
    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        success: false,
        message: 'URL inválida',
      });
    }

    const jobOffer = await jobScraperService.extractFromUrl(url);

    res.json({
      success: true,
      data: jobOffer,
    });
  } catch (error) {
    console.error('Error extrayendo oferta:', error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : 'Error al extraer información',
    });
  }
};