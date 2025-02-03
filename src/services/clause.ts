import { api } from './api'

export const ClauseService = {
  AddClause: async (formData: any) => {
    return api
      .post('addclause', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
  },
}
