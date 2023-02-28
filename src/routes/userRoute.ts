import { RequestHandler, Router } from 'express'

import { create, authenticate, confirmAccount, resetPassword, checkToken, newPassword, getProfile } from '../controllers/userController'
import checkAuth from '../middleware/checkAuth'

const router = Router()

// Create and Authenticate users
router.get('/confirm/:token', confirmAccount as RequestHandler)

router.post('/', create as RequestHandler) // create a new user
router.post('/login', authenticate as RequestHandler) // authenticate an user
router.post('/reset-password', resetPassword as RequestHandler) // authenticate an user

router.route('/reset-password/:token')
  .get(checkToken as RequestHandler)
  .post(newPassword as RequestHandler)

router.get('/profile', checkAuth as RequestHandler, getProfile as RequestHandler)

export default router
