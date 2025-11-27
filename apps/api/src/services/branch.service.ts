import prisma from '../utils/prisma.utils'
import { createNotFoundError, createForbiddenError } from '../utils/errors.utils'

export async function createBranch(tenantId: number, data: any) {
  const tenant = await prisma.tenant.findUnique({
    where: { id: tenantId },
    select: { maxBranches: true },
  })

  const currentBranchCount = await prisma.branch.count({ where: { tenantId } })

  if (tenant?.maxBranches && currentBranchCount >= tenant.maxBranches)
    throw createForbiddenError(
      `Paketinizin şube limiti ${tenant.maxBranches} dolmuştur. Lütfen paketinizi güncelleyiniz.`
    )

  const branch = await prisma.branch.create({
    data: {
      tenantId,
      name: data.name,
      phone: data.phone,
      cityId: data.cityId,
      districtId: data.districtId,
      address: data.address,
      whatsappNumber: data.whatsappNumber,
      images: data.images,
      coverImage: data.coverImage,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  })

  return branch
}

export async function getAllBranches(tenantId: number) {
  return await prisma.branch.findMany({
    where: { tenantId },
    include: {
      city: true,
      district: true,
    },
  })
}

export async function getBranchById(branchId: number, tenantId: number) {
  const branch = await prisma.branch.findFirst({
    where: { id: branchId, tenantId },
    include: {
      city: true,
      district: true,
    },
  })

  if (!branch) throw createNotFoundError('Şube bulunamadı.')

  return branch
}

export async function updateBranch(branchId: number, tenantId: number, data: any) {
  const branch = await prisma.branch.findFirst({
    where: { id: branchId, tenantId },
  })

  if (!branch) throw createNotFoundError('Şube bulunamadı.')

  const updated = await prisma.branch.update({
    where: { id: branchId },
    data: {
      name: data.name,
      phone: data.phone,
      cityId: data.cityId,
      districtId: data.districtId,
      address: data.address,
      whatsappNumber: data.whatsappNumber,
      images: data.images,
      coverImage: data.coverImage,
      latitude: data.latitude,
      longitude: data.longitude,
    },
  })

  return updated
}

export async function deleteBranch(branchId: number, tenantId: number) {
  const branch = await prisma.branch.findFirst({
    where: { id: branchId, tenantId },
  })

  if (!branch) throw createNotFoundError('Şube bulunamadı.')

  await prisma.branch.delete({ where: { id: branchId } })

  return true
}
