import { Request, Response, NextFunction } from 'express';
import { CreateProfileUseCase } from '../../domain/use-cases/profile/CreateProfileUseCase';
import { UpdateProfileUseCase } from '../../domain/use-cases/profile/UpdateProfileUseCase';
import { GetProfileUseCase } from '../../domain/use-cases/profile/GetProfileUseCase';
import { GetMyProfileUseCase } from '../../domain/use-cases/profile/GetMyProfileUseCase';
import { BadRequestError, UnauthorizedError } from '../../domain/errors/AppError';

export class ProfileController {
  constructor(
    private readonly createProfileUseCase: CreateProfileUseCase,
    private readonly updateProfileUseCase: UpdateProfileUseCase,
    private readonly getProfileUseCase: GetProfileUseCase,
    private readonly getMyProfileUseCase: GetMyProfileUseCase
  ) {}

  // POST /api/profile
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const { fullName, title, summary, phone, website, linkedin, github, skills } = req.body;

      const result = await this.createProfileUseCase.execute({
        userId: req.userId,
        fullName,
        title,
        summary,
        phone,
        website,
        linkedin,
        github,
        skills,
      });

      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/profile/me
  getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const result = await this.getMyProfileUseCase.execute(req.userId);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /api/profile/:id
  getById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const id = req.params.id as string;

      if (!id) {
        throw new BadRequestError('ID de perfil requerido');
      }

      const result = await this.getProfileUseCase.execute(id);

      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // PUT /api/profile/:id
  update = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.userId) {
        throw new UnauthorizedError('Usuario no autenticado');
      }

      const id = req.params.id as string;
      const { fullName, title, summary, phone, website, linkedin, github, skills, isPublic } =
        req.body;

      const result = await this.updateProfileUseCase.execute({
        profileId: id,
        userId: req.userId,
        fullName,
        title,
        summary,
        phone,
        website,
        linkedin,
        github,
        skills,
        isPublic,
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
