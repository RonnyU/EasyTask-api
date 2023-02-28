import jwt from 'jsonwebtoken'
import config from '../config/config'
import { Response, Request, NextFunction } from 'express'
import { IGetUserAuthInfoRequest, JwtPayload } from '../extended-types/types'
import User from '../models/User'

export const checkAuth = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
  let token

  if (req.headers?.authorization?.startsWith('Bearer') != null) {
    try {
      token = req.headers.authorization.split(' ')[1]

      const tokenDecoded = jwt.verify(token, config.JWT_SECRET) as JwtPayload

      (req as IGetUserAuthInfoRequest).user = await User.findById(tokenDecoded.id)

      return next()
    } catch (error) {
      return res.status(404).json({ msg: 'The user does not exists or the token is invalid' })
    }
  }

  if (token == null) {
    const error = new Error('Missing token')
    return res.status(401).json({ msg: error.message })
  }
}

export default checkAuth
