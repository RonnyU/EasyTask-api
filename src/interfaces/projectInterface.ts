import { IUser } from '../interfaces/userInterface'

export interface IProject {
  name: string
  description: string
  Deadline: Date
  client: string
  createdby: IUser
  partners: IUser[]
}
