import { Response, Request } from 'express'
import User from '../models/User'
import { v4 as uuidv4 } from 'uuid'

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
    const userStored = await user.save().catch(() => {
      console.log('Error when trying to save the user')
    })

    res.json({ msg: 'A new user has been created', userStored })
  } catch (error) {
    console.log(`error: ${(error as Error).message}`)
  }

  res.send(req.body)
}

export {
  create
}
