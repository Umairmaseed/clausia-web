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
  owner: UserSignature
  rejectedSignatures: UserKey[]
  requiredSignatures: UserKey[]
  status: number
  successfulSignatures: UserKey[]
  timeout: string
}
