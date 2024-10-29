interface User {
  userName: string
  name: string
  email: string
  phone: string
  cpf: string
}

interface ConfirmUser {
  userName?: string
  email?: string
  id?: string
}

interface UserWithKey {
  '@assetType': 'user'
  '@key': string
  name: string
  email: string
  phone: string
  cpf: string
  username: string
}
