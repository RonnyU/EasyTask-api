import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'

interface IUser {
  name: string
  password: string
  email: string
  token: string
  confirm: boolean
}

const userSchema = new Schema<IUser>(
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
    timestamps: true
  }
)

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next()
  }

  const salt = await bcrypt.genSalt(10)

  this.password = await bcrypt.hash(this.password, salt)
})

const User = mongoose.model('User', userSchema)

export default User
