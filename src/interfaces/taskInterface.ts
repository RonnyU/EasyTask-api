import { IProject } from './projectInterface'
import { IUser } from './userInterface'

export interface ITask {
  name: string
  description: string
  status: boolean
  deadline: Date
  priority: string
  project: IProject
  completed: IUser
}
