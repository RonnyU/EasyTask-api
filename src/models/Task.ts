import { Schema, Types, model } from 'mongoose'
import { ITask } from '../interfaces/taskInterface'

const taskSchema = new Schema<ITask>({
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
  status: {
    type: Boolean,
    default: false
  },
  deadline: {
    type: Date,
    required: true,
    default: Date.now()
  },
  priority: {
    type: String,
    required: true,
    enum: ['Low', 'Intermediate', 'High']
  },
  project: {
    type: Types.ObjectId,
    ref: 'Project'
  }
}, {
  versionKey: false,
  timestamps: true
})

const Task = model('Task', taskSchema)

export default Task
