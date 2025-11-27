// TODO: Create, Delete ve Get All işlemleri eklenecek.

import prisma from '../utils/prisma.utils'
import { createNotFoundError } from '../utils/errors.utils'

export async function getMyTenant(tenantId: number) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
  })

  if (!tenant) throw createNotFoundError('Güzellik salonu bulunamadı.')

  return tenant
}

export async function updateMyTenant(tenantId: number, data: any) {
  const {
    name,
    phone,
    email,
    billingAddress,
    images,
    coverImage,
    website,
    facebook,
    instagram,
    twitter,
    tiktok,
    linkedin,
    youtube,
  } = data

  const updatedTenant = await prisma.tenant.update({
    where: { id: tenantId },
    data: {
      name,
      phone,
      email,
      billingAddress,
      images,
      coverImage,
      website,
      facebook,
      instagram,
      twitter,
      tiktok,
      linkedin,
      youtube,
    },
  })

  return updatedTenant
}
