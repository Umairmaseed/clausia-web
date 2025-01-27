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
