interface User {
  username: string
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

interface UserKey {
  '@assetType': 'user'
  '@key': string
}
