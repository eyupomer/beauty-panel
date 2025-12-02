import prisma from '../utils/prisma.utils'
import {
  createNotFoundError,
  createForbiddenError,
  createBadRequestError,
} from '../utils/errors.utils'
import { Prisma } from '@beautypanel/database'

export interface GetCustomerParams {
  page?: number
  limit?: number
  query?: string
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
  isBanned?: boolean
}

export async function createCustomer(tenantId: number, homeBranchId: number, data: any) {
  const existingCustomer = await prisma.customer.findFirst({
    where: {
      tenantId,
      OR: [{ phone: data.phone }, { email: data.email }],
    },
  })

  if (existingCustomer) {
    if (existingCustomer.phone === data.phone) {
      throw createBadRequestError(
        `Bu telefon numarası (${data.phone}) zaten ${existingCustomer.firstName} ${existingCustomer.lastName} adına kayıtlı.`
      )
    }

    if (existingCustomer.email === data.email) {
      throw createBadRequestError(
        `Bu e-posta adresi (${data.email}) zaten ${existingCustomer.firstName} ${existingCustomer.lastName} adına kayıtlı.`
      )
    }
  }

  const customer = await prisma.customer.create({
    data: {
      tenantId,
      homeBranchId,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      email: data.email,
      gender: data.gender,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      notes: data.notes,
    },
  })

  return customer
}

export async function getCustomers(tenantId: number, params: GetCustomerParams) {
  const { page = 1, limit = 10, query, sortBy = 'createdAt', sortOrder = 'desc', isBanned } = params

  const skip = (page - 1) * limit
  const where: Prisma.CustomerWhereInput = { tenantId }

  if (query) {
    where.OR = [
      { phone: { contains: query } },
      { firstName: { contains: query, mode: 'insensitive' } },
      { lastName: { contains: query, mode: 'insensitive' } },
      { email: { contains: query, mode: 'insensitive' } },
    ]
  }

  if (isBanned !== undefined) {
    where.isBanned = isBanned
  }

  const allowedSortFields = ['firstName', 'lastName', 'email', 'phone', 'createdAt', 'isBanned']
  const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
  const orderBy: Prisma.CustomerOrderByWithRelationInput = {
    [safeSortBy]: sortOrder,
  }

  const [total, customers] = await prisma.$transaction([
    prisma.customer.count({ where }),

    prisma.customer.findMany({
      where,
      skip: skip,
      take: limit,
      orderBy,
      include: {
        homeBranch: {
          select: { id: true, name: true },
        },
      },
    }),
  ])
  return {
    data: customers,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  }
}

export async function getCustomerById(tenantId: number, customerId: number) {
  const customer = await prisma.customer.findFirst({
    where: { id: customerId, tenantId },
    include: {
      homeBranch: { select: { name: true, id: true } },
      appointments: {
        orderBy: { startTime: 'desc' },
        include: { service: true, branch: true },
      },
    },
  })

  if (!customer) throw createNotFoundError(`Müşteri bulunamadı.`)

  return customer
}

export async function updateCustomer(tenantId: number, customerId: number, data: any) {
  const existing = await prisma.customer.findFirst({ where: { id: customerId, tenantId } })

  if (!existing) throw createNotFoundError(`Müşteri bulunamadı.`)

  if (data.phone && data.phone !== existing.phone) {
    const phoneExists = await prisma.customer.findFirst({
      where: {
        tenantId,
        phone: data.phone,
        id: { not: customerId },
      },
    })

    if (phoneExists) {
      throw createBadRequestError(
        `Bu telefon numarası (${data.phone}) başka bir müşteri tarafından kullanılıyor.`
      )
    }
  }

  if (data.email && data.email !== existing.email) {
    const emailExists = await prisma.customer.findFirst({
      where: {
        tenantId,
        email: data.email,
        id: { not: customerId },
      },
    })

    if (emailExists) {
      throw createBadRequestError(
        `Bu e-posta adresi (${data.email}) başka bir müşteri tarafından kullanılıyor.`
      )
    }
  }

  const updatedCustomer = await prisma.customer.update({
    where: { id: customerId },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phone: data.phone,
      gender: data.gender,
      birthDate: data.birthDate ? new Date(data.birthDate) : null,
      notes: data.notes,
      isBanned: data.isBanned,
    },
  })

  return updatedCustomer
}
