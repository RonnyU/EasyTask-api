import { IUser } from '../interfaces/userInterface'

export interface IProject {
  name: string
  description: string
  deadline: Date
  client: string
  createdby: IUser
  partners: IUser[]
}
