import { Request, Response, NextFunction } from 'express'
import { ErrorTypes } from '../utils/errors.utils'

export const errorHandler = (
  error: any, 
  req: Request, 
  res: Response, 
  next: NextFunction
) => {
  console.error('❌ Error Caught:', error)

  // 1. Bizim oluşturduğumuz bilinen bir hata mı? (AppError veya senin obje yapın)
  if (error.type && error.statusCode) {
    return res.status(error.statusCode).json({
      success: false,
      error: error.type,
      message: error.message,
    })
  }

  // 2. Beklenmedik bir hata mı? (Prisma patladı, sunucu çöktü vs.)
  // Kullanıcıya detay gösterme, "Sunucu Hatası" de geç.
  return res.status(500).json({
    success: false,
    error: ErrorTypes.INTERNAL_ERROR,
    message: 'Sunucu kaynaklı bir hata oluştu.',
  })
}