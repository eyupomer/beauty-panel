import { Router } from 'express'
import { authenticate, authorize } from '../middlewares/auth.middleware'
import * as tenantController from '../controllers/tenant.controller'

const router = Router()

router.use(authenticate)

router.get('/me', tenantController.getMyTenant)
router.patch('/me', authorize(['OWNER']), tenantController.updateMyTenant)

export default router
