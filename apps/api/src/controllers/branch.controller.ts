import {Request, Response, NextFunction} from 'express'
import * as branchService from '../services/branch.service'
import {createForbiddenError, createNotFoundError, createBadRequestError} from '../utils/errors.utils'

export async function createBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId

        const result = await branchService.createBranch(tenantId!, req.body)

        res.status(201).json({
            success: true,
            message: 'Şube başarıyla oluşturuldu.',
            data: result
        })
    } catch (error) {
        next(error)
    }
}

export async function getAllBranches(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const branches = await branchService.getAllBranches(tenantId!)

        res.status(200).json({
            success: true,
            data: branches
        })
    } catch (error) {
        next(error)
    }
}

export async function getBranchById(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const requestedBranchId = parseInt(req.params.id)

        const userRole = req.user!.role
        const userBranchId = req.user!.branchId

        if (userRole !== 'OWNER') {
            if (requestedBranchId !== userBranchId) {
                throw createForbiddenError('Sadece kendi şubenizi görüntüleyebilirsiniz.')
            }
        }

        const branch = await branchService.getBranchById(requestedBranchId, tenantId!)

        res.status(200).json({
            success: true,
            data: branch
        })
    } catch (error) {
        next(error)
    }
}

export async function updateBranch(req: Request, res: Response, next: NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const requestedBranchId = parseInt(req.params.id)

        const userRole = req.user!.role
        const userBranchId = req.user!.branchId

        if (userRole !== 'OWNER' && requestedBranchId !== userBranchId) {
            throw createForbiddenError('Sadece kendi şubenizi güncelleyebilirsiniz.')
        }

        const updatedBranch = await branchService.updateBranch(requestedBranchId, tenantId!, req.body)

        res.status(200).json({
            success: true,
            message: 'Şube bilgileri güncellendi.',
            data: updatedBranch
        })
    } catch (error) {
        next(error)
    }
}

export async function deleteBranch(req: Request, res: Response, next:NextFunction) {
    try {
        const tenantId = req.user!.tenantId
        const branchId = parseInt(req.params.id)

        await branchService.deleteBranch(branchId, tenantId!)

        res.status(200).json({
            success: true,
            message: 'Şube silindi.'
        })
    } catch (error) {
        next(error)
    }
}