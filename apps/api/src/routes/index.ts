import {Router} from 'express'
import authRoutes from './auth.route'
import tenantRoutes from './tenant.route'
import branchRoutes from './branch.route'
import customerRoutes from './customer.route'

const router = Router()

router.use('/auth', authRoutes)
router.use('/tenant', tenantRoutes)
router.use('/branch', branchRoutes)
router.use('/customer', customerRoutes)

export default router