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
}
