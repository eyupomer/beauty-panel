import {Request, Response, NextFunction} from 'express'
import {login} from '../services/auth.service'
import {createBadRequestError, ErrorTypes} from '../utils/errors.utils'

export async function loginController(req: Request, res: Response, next: NextFunction) {
    try {
        const {email, password} = req.body

        if (!email || !password) {
            throw createBadRequestError('Email ve şifre gereklidir.')
        }

        const result = await login(email, password)

        return res.status(200).json({
            success: true,
            data: result
        })
    } catch (error) {
        next(error)
    }
}