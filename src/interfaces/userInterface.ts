export interface IUser {
  name: string
  password: string
  email: string
  token: string
  confirm: boolean
}

export interface IUserMethods {
  checkPassword: (password: string) => boolean
}
