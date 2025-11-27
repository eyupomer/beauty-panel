import {Request} from 'express'

export interface AuthUser {
    userId: number
    email: string
    role: string
    tenantId?: number
}

declare global {
    namespace Express {
        interface Request {
            user?: AuthUser
        }
    }
}