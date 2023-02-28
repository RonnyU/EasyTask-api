import { IProject } from './projectInterface'

export interface ITask {
  name: string
  description: string
  status: boolean
  deadline: Date
  priority: string
  project: IProject
}
