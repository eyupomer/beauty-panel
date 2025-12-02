import { Router } from 'express'
import * as CustomerController from '../controllers/customer.controller'
import { authenticate, authorize } from '../middlewares/auth.middleware'

const router = Router()

router.use(authenticate)

router.post('/', authorize(['OWNER', 'MANAGER']), CustomerController.createCustomer)
router.get('/', authorize(['OWNER', 'MANAGER']), CustomerController.getCustomers)
router.get('/:id', authorize(['OWNER', 'MANAGER', 'STAFF']), CustomerController.getCustomerById)
router.patch('/:id', authorize(['OWNER', 'MANAGER']), CustomerController.updateCustomer)

export default router