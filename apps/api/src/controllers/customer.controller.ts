import { Request, Response, NextFunction } from 'express'
import * as CustomerService from '../services/customer.service'
import { createBadRequestError } from '../utils/errors.utils'
import { GetCustomerParams } from '../services/customer.service'

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const userRole = req.user!.role

        let homeBranchId = req.user!.branchId

        if (userRole === 'OWNER' && req.body.homeBranchId) {
            homeBranchId = req.body.homeBranchId
        }

        if (!homeBranchId) {
            throw createBadRequestError('Müşterinin hangi şubeye kayıt olacağı belirtilmelidir.')
        }

        const customer = await CustomerService.createCustomer(tenantId!, homeBranchId, req.body)

        res.status(201).json({
            success: true,
            message: 'Müşteri oluşturuldu.',
            data: customer,
        })
        
    } catch (error) {
        next(error)
    }
}

export async function getCustomers(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId

        const page = parseInt(req.query.page as string) || 1
        const limit = parseInt(req.query.limit as string) || 10
        const query = req.query.search as string | undefined
        const sortBy = req.query.sortBy as string | undefined
        const sortOrder = (req.query.sortOrder === 'asc' ? 'asc' : 'desc')

        let isBanned: boolean | undefined = undefined
        if (req.query.isBanned === 'true') isBanned = true
        if (req.query.isBanned === 'false') isBanned = false

        const params: GetCustomerParams = {page, limit, query, sortBy, sortOrder, isBanned}

        const result = await CustomerService.getCustomers(tenantId!, params)

        res.status(200).json({
            success: true,
            data: result.data,
            meta: result.meta,
        })
    } catch (error) {
        next(error)
    }
}

export async function getCustomerById(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const customerId = parseInt(req.params.id)

        if (isNaN(customerId)) {
            throw createBadRequestError('Geçersiz müşteri ID.')
        }

        const customer = await CustomerService.getCustomerById(tenantId!, customerId)

        res.status(200).json({
            success: true,
            data: customer,
        })
    } catch (error) {
        next(error)
    }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const customerId = parseInt(req.params.id)

        if (isNaN(customerId)) {
            throw createBadRequestError('Geçersiz müşteri ID.')
        }

        const updated = await CustomerService.updateCustomer(tenantId!, customerId, req.body)

        res.status(200).json({
            success: true,
            message: 'Müşteri güncellendi.',
            data: updated,
        })
    } catch (error) {
        next(error)
    }
}