import prisma from '../utils/prisma.utils'
import {
  createNotFoundError,
  createForbiddenError,
  createBadRequestError,
} from '../utils/errors.utils'
import { Prisma } from '@beautypanel/database'

interface GetCustomerParams {
    page?: number
    limit?: number
    query?: string
    sortBy?: string
    sortOrder?: 'asc' | 'desc'
    isBanned?: boolean
}

export async function createCustomer(tenantId: number, homeBranchId: number, data: any) {
  const existingCustomer = await prisma.customer.findUnique({
    where: {
      tenantId_phone: {
        tenantId,
        phone: data.phone,
      },
    },
  })

  if (existingCustomer) {
    throw createBadRequestError(
      `Bu telefon numarası (${data.phone}) ile kayıtlı bir müşteri zaten var: ${existingCustomer.firstName} ${existingCustomer.lastName}`
    )
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
    const {
        page = 1,
        limit = 10,
        query,
        sortBy = 'createdAt',
        sortOrder = 'desc',
        isBanned
    } = params

    const skip = (page - 1) * limit
    const where: Prisma.CustomerWhereInput = {tenantId}

    if (query) {
        where.OR = [
            {phone: {contains: query}},
            {firstName: {contains: query, mode: 'insensitive'}},
            {lastName: {contains: query, mode: 'insensitive'}},
            {email: {contains: query, mode: 'insensitive'}}
        ]
    }

    if (isBanned !== undefined) {
        where.isBanned = isBanned
    }

    const allowedSortFields = ['firstName', 'lastName', 'email', 'phone', 'createdAt', 'isBanned']
    const safeSortBy = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
    const orderBy: Prisma.CustomerOrderByWithRelationInput = {
        [safeSortBy]: sortOrder
    }

    const [total, customers] = await prisma.$transaction([
        prisma.customer.count({where}),

        prisma.customer.findMany({
            where,
            skip: skip,
            take: limit,
            orderBy,
            include: {
                homeBranch: {
                    select: {id: true, name: true}
                }
            }
        })
    ])
  return {
    data: customers,
    meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
    }
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
