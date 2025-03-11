interface CreateContract {
  name: string
  signatureDate: string
}

interface AutoExecutableContract {
  '@assetType': string
  '@key': string
  '@lastTouchBy': string
  '@lastTx': string
  '@lastUpdated': string
  name: string
  owner: UserWithKey
  signatureDate: string
  participants?: UserWithKey[]
  clauses?: Clause[]
  data?: Record<string, any>
}

interface ContractKey {
  '@assetType': string
  '@key': string
}

interface AddParticipants {
  autoExecutableContract: ContractKey
  participants: UserKey[]
}
interface CancelContract {
  clause: ContractKey
  forceCancellation?: boolean
  requestedCancellation?: boolean
}
