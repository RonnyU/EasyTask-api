import { Request } from 'express'

export interface IGetUserAuthInfoRequest extends Request {
  user: any // or any other type
}

export interface JwtPayload {
  id: string
}

export interface confirmationEmail {
  name: string
  email: string
  token: string
}
