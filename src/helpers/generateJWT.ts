import jwt from 'jsonwebtoken'
import config from '../config/config'

const generateJWT = (id: string): string => {
  return jwt.sign({ id }, config.JWT_SECRET, {
    expiresIn: '30d'
  })
}

export default generateJWT
