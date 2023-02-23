import express, { RequestHandler } from 'express'

import { create } from '../controllers/userController'

const router = express.Router()

// Create and Authenticate users
router.post('/', create as RequestHandler) // create a new user

export default router
