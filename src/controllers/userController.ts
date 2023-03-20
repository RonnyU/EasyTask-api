import { Response, Request } from 'express'
import User from '../models/User'
import { v4 as uuidv4 } from 'uuid'
import generateJWT from '../helpers/generateJWT'
import { IGetUserAuthInfoRequest } from '../extended-types/types'
import { registerEmail, forgotPassword } from '../helpers/emails'

const create = async (req: Request, res: Response): Promise<any> => {
  const { email } = req.body
  const userExists = await User.findOne({ email })
  // avoid duplicates keys
  if (userExists != null) {
    const error = new Error('User already stored')
    return res.status(400).json({ msg: error.message })
  }

  try {
    const user = new User(req.body)
    user.token = uuidv4()
    await user.save()

    // send confirmation email
    await registerEmail({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({ msg: 'User created successfully, check your email to confirm your account' })
  } catch (error) {
    console.log(`error: ${(error as Error).message}`)
  }
}

const authenticate = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { email, password } = req.body
  const user = await User.findOne({ email })
  // check if the user exists
  if (user == null) {
    error = new Error('User does not exists')
    return res.status(404).json({ msg: error.message })
  }
  // check if the user has been verified
  if (!user.confirm) {
    error = new Error('Your account has not been confirmed yet')
    return res.status(403).json({ msg: error.message })
  }

  if (await user.checkPassword(password)) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateJWT(String(user._id))
    })
  } else {
    error = new Error('Invalid credentials')
    return res.status(403).json({ msg: error.message })
  }
}

const confirmAccount = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const token = req.params.token

  const userToConfirm = await User.findOne({ token })

  if (userToConfirm == null) {
    error = new Error('Invalid token')
    return res.status(403).json({ msg: error.message })
  }

  try {
    userToConfirm.confirm = true
    userToConfirm.token = ''
    await userToConfirm.save()
    res.json({ msg: 'User confirmed successfully' })
  } catch (error) {
    console.log(`Error when trying to confirm the user account: ${(error as Error).message}`)
  }
}

const resetPassword = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { email } = req.body
  const user = await User.findOne({ email })
  // check if the user exists
  if (user == null) {
    error = new Error('User does not exists')
    return res.status(404).json({ msg: error.message })
  }

  try {
    user.token = uuidv4()
    await user.save()

    await forgotPassword({
      email: user.email,
      name: user.name,
      token: user.token
    })

    res.json({ msg: `Instructions to reset your password have been sent to your email: ${String(email)}` })
  } catch (error) {
    console.log(`Error when trying to reset the user password: ${(error as Error).message}`)
  }
}

const checkToken = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const token = req.params.token
  const user = await User.findOne({ token })

  if (user == null) {
    error = new Error('Invalid token')
    return res.status(403).json({ msg: error.message })
  }

  res.json({
    msg: 'Token validated'
  })
}

const newPassword = async (req: Request, res: Response): Promise<any> => {
  let error: Error
  const { token } = req.params
  const { password } = req.body

  const user = await User.findOne({ token })

  if (user == null) {
    error = new Error('Invalid token')
    return res.status(403).json({ msg: error.message })
  }

  try {
    user.password = password
    user.token = ''
    await user.save()
    res.json({ msg: 'Password changed successfully' })
  } catch (error) {
    console.log(`Error when trying to change the user password: ${(error as Error).message}`)
  }
}

const getProfile = async (req: Request, res: Response): Promise<any> => {
  const { user } = req as IGetUserAuthInfoRequest
  return res.json(user)
}

export {
  create,
  authenticate,
  confirmAccount,
  resetPassword,
  checkToken,
  newPassword,
  getProfile
}
