type AddClauseForm = {
  autoExecutableContract: Record<string, any>
  id: string
  description?: string
  category?: string
  parameters: Record<string, any>
  input: Record<string, any>
  dependencies: Array<Record<string, any>>
  actionType: string
}

type Clause = {
  id: string
  '@key': string
  description?: string
  category?: string
  parameters?: Record<string, any>
  input?: Record<string, any>
  executable: boolean
  dependencies?: Array<Record<string, any>>
  actionType: number
  finalized?: boolean
  result?: Record<string, any>
}

type ClauseReview = {
  rating: number
  comments: string
  date: string
  autoExecutableContract: Record<string, any>
}
