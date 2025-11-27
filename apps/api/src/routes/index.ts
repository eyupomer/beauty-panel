import {Router} from 'express'
import authRoutes from './auth.route'
import tenantRoutes from './tenant.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/tenant', tenantRoutes)

export default router