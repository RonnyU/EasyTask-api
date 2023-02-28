import { Schema, model, Types } from 'mongoose'
import { IProject } from '../interfaces/projectInterface'

const projectSchema = new Schema<IProject>({
  name: {
    type: String,
    trim: true,
    required: true
  },
  description: {
    type: String,
    trim: true,
    required: true
  },
  deadline: {
    type: Date,
    default: Date.now()
  },
  client: {
    type: String,
    trim: true,
    required: true
  },
  createdby: {
    type: Types.ObjectId,
    ref: 'User'
  },
  partners: [
    {
      type: Types.ObjectId,
      ref: 'User'
    }
  ]
},
{
  timestamps: true,
  versionKey: false
})

const Project = model('Project', projectSchema)

export default Project
