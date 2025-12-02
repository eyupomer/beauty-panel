import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import * as branchController from '../controllers/branch.controller'

const router = Router()

router.use(authenticate)

router.post('/', authorize(['OWNER']), branchController.createBranch)
router.get('/', authorize(['OWNER']), branchController.getAllBranches)
router.get('/:id',authorize(['OWNER', 'MANAGER', 'STAFF']), branchController.getBranchById)
router.patch('/:id', authorize(['OWNER', 'MANAGER']), branchController.updateBranch)
router.delete('/:id', authorize(['OWNER']), branchController.deleteBranch)

export default router