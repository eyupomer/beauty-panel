import { Request, Response, NextFunction } from 'express'
import * as tenantService from '../services/tenant.service'
import { createBadRequestError } from '../utils/errors.utils'

export async function getMyTenant(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = req.user!.tenantId

    if (!tenantId) throw createBadRequestError('Sistemde kayıtlı güzellik salonunuz bulunmuyor.')

    const tenant = await tenantService.getMyTenant(tenantId)

    res.json({ success: true, data: tenant })
  } catch (error) {
    next(error)
  }
}

export async function updateMyTenant(req: Request, res: Response, next: NextFunction) {
  try {
    const tenantId = req.user!.tenantId

    if (!tenantId) throw createBadRequestError('Sistemde kayıtlı güzellik salonunuz bulunmuyor.')

    const updatedTenant = await tenantService.updateMyTenant(tenantId, req.body)

    res.json({ success: true, message: 'Bilgileriniz başarıyla güncellendi.', data: updatedTenant })
  } catch (error) {
    next(error)
  }
}
