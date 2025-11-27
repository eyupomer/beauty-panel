import { Request, Response, NextFunction } from 'express'
import { verifyToken } from '../utils/jwt.utils'
import { createUnauthorizedError, createForbiddenError } from '../utils/errors.utils'

export const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization

    if (!authHeader || !authHeader.startsWith('Bearer')) {
      throw createUnauthorizedError('Bu işlem için giriş yapmanız gerekiyor.')
    }

    const token = authHeader.split(' ')[1]
    const decoded = verifyToken(token)

    if (!decoded) {
      throw createUnauthorizedError('Bu işlem için giriş yapmanız gerekiyor.')
    }

    req.user = decoded
    next()
  } catch (error) {
    next(error)
  }
}

export const authorize = (allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(createUnauthorizedError('Bu işlem için giriş yapmanız gerekiyor.'))
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(createForbiddenError('Bu işlem için yetkiniz yok.'))
    }

    next()
  }
}
