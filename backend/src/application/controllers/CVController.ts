import { Request, Response, NextFunction } from 'express';
import { CreateCVUseCase } from '../../domain/use-cases/cv/CreateCVUseCase';
import { GetCVUseCase } from '../../domain/use-cases/cv/GetCVUseCase';
import { GetMyCVsUseCase } from '../../domain/use-cases/cv/GetMyCVsUseCase';
import { UpdateCVUseCase } from '../../domain/use-cases/cv/UpdateCVUseCase';
import { DeleteCVUseCase } from '../../domain/use-cases/cv/DeleteCVUseCase';
import { AdaptToJobOfferUseCase } from '../../domain/use-cases/cv/AdaptToJobOfferUseCase';
import { GenerateSuggestionsUseCase } from '../../domain/use-cases/cv/GenerateSuggestionsUseCase';
import { GenerateCoverLetterUseCase } from '../../domain/use-cases/cv/GenerateCoverLetterUseCase';
import { BadRequestError, UnauthorizedError } from '../../domain/errors/AppError';

export class CVController {
  constructor(
    private readonly createCVUseCase: CreateCVUseCase,
    private readonly getCVUseCase: GetCVUseCase,
    private readonly getMyCVsUseCase: GetMyCVsUseCase,
    private readonly updateCVUseCase: UpdateCVUseCase,
    private readonly deleteCVUseCase: DeleteCVUseCase,
    private readonly adaptToJobOfferUseCase: AdaptToJobOfferUseCase,
    private readonly generateSuggestionsUseCase: GenerateSuggestionsUseCase,
    private readonly generateCoverLetterUseCase: GenerateCoverLetterUseCase
  ) {}

  // POST /api/cvs
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { title, cvData } = req.body;

      if (!title || !cvData) {
        throw new BadRequestError('title y cvData son requeridos');
      }

      const result = await this.createCVUseCase.execute({
        userId: req.userId,
        title,
        cvData,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/cvs (mis CVs)
  getMyCVs = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { hasJobOffer, search, limit, offset, sortBy, sortOrder } = req.query;

      const result = await this.getMyCVsUseCase.execute(req.userId, {
        hasJobOffer: hasJobOffer === 'true',
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
        sortBy: sortBy as 'createdAt' | 'updatedAt',
        sortOrder: sortOrder as 'asc' | 'desc',
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/cvs/:id
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      if (!id) {
        throw new BadRequestError('ID de CV requerido');
      }

      const result = await this.getCVUseCase.execute(id, req.userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/cvs/:id
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;
      const { title, cvData, jobOffer, coverLetter, pdfUrl } = req.body;

      const result = await this.updateCVUseCase.execute({
        cvId: id,
        userId: req.userId,
        title,
        cvData,
        jobOffer,
        coverLetter,
        pdfUrl,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // DELETE /api/cvs/:id
  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;

      await this.deleteCVUseCase.execute(id, req.userId);

      res.status(200).json({
        success: true,
        message: 'CV eliminado exitosamente',
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/cvs/:id/adapt
  adaptToJobOffer = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;
      const { jobOffer } = req.body;

      if (!jobOffer) {
        throw new BadRequestError('jobOffer es requerido');
      }

      const result = await this.adaptToJobOfferUseCase.execute({
        cvId: id,
        userId: req.userId,
        jobOffer,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/cvs/:id/suggestions
  generateSuggestions = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      const result = await this.generateSuggestionsUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // POST /api/cvs/:id/cover-letter
  generateCoverLetter = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;
      const { jobOffer } = req.body;

      if (!jobOffer) {
        throw new BadRequestError('jobOffer es requerido');
      }

      const result = await this.generateCoverLetterUseCase.execute({
        cvId: id,
        jobOffer,
      });

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };
}
