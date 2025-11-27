import {Router} from 'express'
import authRoutes from './auth.route'
import tenantRoutes from './tenant.route'
import branchRoutes from './branch.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/tenant', tenantRoutes)
router.use('/branch', branchRoutes)

export default router