import { api } from './api'

export const UserService = {
  registerUser: async (user: RegisterUser) => {
    return api.post('signup', user).then((res) => res.data)
  },
  confirmOtp: async (username: string, otp: string) => {
    return api.post('otp', { username, otp }).then((res) => res.data)
  },
  loginUser: async (user: LoginUser) => {
    return api.post('login', user).then((res) => res.data)
  },
  infoUser: async () => {
    return api
      .get<{
        id: string
        name: string
        username: string
        email: string
        phone: string
        cpf: string
      }>('user/info')
      .then((res) => res.data)
  },
  confirmUser: async (confirmUserForm: ConfirmUser) => {
    return api
      .get('confirmuser', { params: confirmUserForm })
      .then((res) => res.data)
  },
  logoutUser: async () => {
    return api.post('logout').then((res) => res.data)
  }
}
