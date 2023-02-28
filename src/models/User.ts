import { Model, Schema, model } from 'mongoose'
import bcrypt from 'bcrypt'
import { IUser, IUserMethods } from '../interfaces/userInterface'

// Create a new Model type that knows about IUserMethods...
export type UserModel = Model<IUser, {}, IUserMethods>

//* Schema Model
const userSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      require: true,
      trim: true
    },
    password: {
      type: String,
      require: true,
      trim: true
    },
    email: {
      type: String,
      require: true,
      trim: true,
      unique: true
    },
    token: {
      type: String
    },
    confirm: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true,
    versionKey: false
  }
)

//* Schema Methods
userSchema.method('checkPassword', async function (password: string) {
  // console.log(password, this.password, await bcrypt.compare(password, this.password))
  return await bcrypt.compare(password, this.password)
})

//* Schema Middleware
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)

  this.password = await bcrypt.hash(this.password, salt)
})

const User = model('User', userSchema)

export default User
