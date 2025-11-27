import { comparePassword } from '../utils/password.utils'
import { generateToken } from '../utils/jwt.utils'
import prisma from '../utils/prisma.utils';
import {
  createNotFoundError,
  createUnauthorizedError,
  createForbiddenError,
  createInternalError,
} from '../utils/errors.utils'


export async function login(email: string, password: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        tenant: true,
      },
    })

    if (!user) {
      throw createNotFoundError('Email veya şifre hatalı.')
    }

    if (user.role !== 'OWNER' && user.role !== 'MANAGER') {
        throw createForbiddenError('Panele giriş yapmak için yetkiniz bulunmuyor.')
    }

    if (!user.isActive) {
      throw createForbiddenError('Hesabınız pasif duruma alınmıştır. Yöneticilerinizle görüşün.')
    }

    if (user.tenant?.accountStatus === 'SUSPENDED' || user.tenant?.accountStatus === 'CANCELLED') {
       throw createForbiddenError('Klinik üyeliği askıya alınmıştır. Lütfen ödeme yapınız.')
    }

    const isPasswordValid = await comparePassword(password, user.passwordHash)

    if (!isPasswordValid) {
        throw createUnauthorizedError('Email veya şifre hatalı.')
    }

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      branchId: user.branchId || undefined,
    })

    return {
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        tenantId: user.tenantId,
        branchId: user.branchId
      },
    }
  } catch (error: any) {
    if (error.isOperational || error.type) {
      throw error
    }
    console.error('Login error :', error)
    throw createInternalError('Giriş işlemi sırasında bir hata oluştu.')
  }
}
