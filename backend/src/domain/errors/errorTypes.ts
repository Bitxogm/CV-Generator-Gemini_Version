/**
 * Mensajes de error estándar
 * Centralizar mensajes para consistencia
 */

export const ErrorMessages = {
  // Autenticación
  INVALID_CREDENTIALS: 'Email o contraseña incorrectos',
  SESSION_EXPIRED: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente',
  UNAUTHORIZED: 'Debes iniciar sesión para acceder a este recurso',
  TOKEN_INVALID: 'Token de autenticación inválido',
  TOKEN_EXPIRED: 'Tu sesión ha expirado',

  // Autorización
  FORBIDDEN: 'No tienes permiso para realizar esta acción',
  ADMIN_ONLY: 'Esta acción solo está disponible para administradores',

  // Usuarios
  USER_NOT_FOUND: 'Usuario no encontrado',
  USER_ALREADY_EXISTS: 'El email ya está registrado',
  USER_INACTIVE: 'Tu cuenta está inactiva. Contacta con soporte',

  // Perfiles
  PROFILE_NOT_FOUND: 'Perfil no encontrado',
  PROFILE_ALREADY_EXISTS: 'Ya tienes un perfil creado',
  PROFILE_NOT_PUBLIC: 'Este perfil no está disponible públicamente',
  PROFILE_RESERVED: 'Este perfil está reservado',

  // CVs
  CV_GENERATION_FAILED: 'Error al generar el CV. Intenta nuevamente',
  CV_NOT_FOUND: 'CV no encontrado',

  // Mensajes
  MESSAGE_NOT_FOUND: 'Mensaje no encontrado',
  CANNOT_MESSAGE_SELF: 'No puedes enviarte mensajes a ti mismo',

  // Favoritos
  FAVORITE_ALREADY_EXISTS: 'Ya tienes este perfil en favoritos',
  FAVORITE_NOT_FOUND: 'Favorito no encontrado',

  // Validación
  VALIDATION_ERROR: 'Los datos enviados no son válidos',
  REQUIRED_FIELD: 'Este campo es obligatorio',
  INVALID_EMAIL: 'Email inválido',
  INVALID_PASSWORD: 'La contraseña debe tener al menos 8 caracteres',
  INVALID_RATE: 'La tarifa por hora debe ser un número positivo',

  // Genéricos
  INTERNAL_SERVER_ERROR: 'Error interno del servidor. Intenta más tarde',
  NOT_FOUND: 'Recurso no encontrado',
  BAD_REQUEST: 'Solicitud inválida',
  SERVICE_UNAVAILABLE: 'Servicio no disponible temporalmente',
} as const;

/**
 * Códigos de estado HTTP
 */
export const HttpStatus = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;
