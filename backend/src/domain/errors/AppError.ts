/**
 * AppError - Clase base para errores de la aplicación
 * Extiende Error nativo de JavaScript con statusCode
 */
export class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  details?: any;

  constructor(message: string, statusCode: number = 500, details?: any) {
    super(message);
    this.name = this.constructor.name;
    this.statusCode = statusCode;
    this.isOperational = true; // Diferencia entre errores controlados y bugs
    this.details = details;

    // Mantener stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Errores específicos por tipo
 */

export class BadRequestError extends AppError {
  constructor(message: string = 'Solicitud inválida', details?: any) {
    super(message, 400, details);
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'No autenticado') {
    super(message, 401);
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'No tienes permiso para realizar esta acción') {
    super(message, 403);
  }
}

export class NotFoundError extends AppError {
  constructor(resource: string = 'Recurso') {
    super(`${resource} no encontrado`, 404);
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflicto con datos existentes') {
    super(message, 409);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = 'Error de validación', details?: any) {
    super(message, 422, details);
  }
}

export class InternalServerError extends AppError {
  constructor(message: string = 'Error interno del servidor') {
    super(message, 500);
  }
}
