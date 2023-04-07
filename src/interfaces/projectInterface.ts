import { Types } from 'mongoose'
import { IUser } from './userInterface'

export interface IProject {
  name: string
  description: string
  deadline: Date
  client: string
  createdby: IUser
  tasks: Types.Array<Types.ObjectId>
  collaborator: Types.Array<Types.ObjectId>
}
