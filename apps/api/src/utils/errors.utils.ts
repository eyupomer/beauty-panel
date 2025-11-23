export const ErrorTypes = {
  NOT_FOUND: 'NOT_FOUND',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  BAD_REQUEST: 'BAD_REQUEST',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
} as const

// Native Error sınıfından türetiyoruz
export class AppError extends Error {
  public readonly type: string
  public readonly statusCode: number
  public readonly isOperational: boolean // Bu hatayı biz mi attık yoksa kod mu patladı?

  constructor(type: string, message: string, statusCode: number) {
    super(message) // Error sınıfının message özelliğini set eder
    this.type = type
    this.statusCode = statusCode
    this.isOperational = true // Bizim kontrolümüzdeki hata

    // Stack Trace'i yakalamak için (V8 motoru için)
    Error.captureStackTrace(this, this.constructor)
  }
}

// Helper Factory Fonksiyonları
export function createNotFoundError(message = 'Kayıt bulunamadı'): AppError {
  return new AppError(ErrorTypes.NOT_FOUND, message, 404)
}

export function createUnauthorizedError(message = 'Kimlik doğrulama başarısız'): AppError {
  return new AppError(ErrorTypes.UNAUTHORIZED, message, 401)
}

export function createForbiddenError(message = 'Bu işlem için yetkiniz bulunmuyor'): AppError {
  return new AppError(ErrorTypes.FORBIDDEN, message, 403)
}

export function createBadRequestError(message = 'Geçersiz istek'): AppError {
  return new AppError(ErrorTypes.BAD_REQUEST, message, 400)
}

export function createInternalError(message = 'Sunucu hatası'): AppError {
  return new AppError(ErrorTypes.INTERNAL_ERROR, message, 500)
}