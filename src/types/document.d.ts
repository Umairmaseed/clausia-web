interface CreateDocument {
  requiredSignatures: string[]
  files: File
  timeout: string
}
interface Document {
  '@assetType': 'document'
  '@key': string
  '@lastTouchBy': string
  '@lastTx': string
  '@lastUpdated': string
  name: string
  originalDocURL: string
  originalHash: string
  finalDocURL?: string
  owner: UserWithKey
  rejectedSignatures: UserWithKey[]
  requiredSignatures: UserWithKey[]
  status: number
  successfulSignatures: UserWithKey[]
  timeout: string
}

interface DocumentSignature {
  rect: {
    x: number
    y: number
    page: number
  }
  final: boolean
}

interface SignatureObject {
  [key: string]: DocumentSignature
}

interface Signature {
  password: string
  signature: string
  username: string
  cpf: string
  dockey: string
  rejectsignature: boolean
}
