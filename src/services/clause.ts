import { api } from './api'

export const ClauseService = {
  AddClause: async (formData: any) => {
    return api
      .post('addclause', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res)
  },
  GetClause: async (clasueKey: string) => {
    return api
      .get(`getclause?clauseKey=${encodeURIComponent(clasueKey)}`)
      .then((res) => res.data)
  },
  AddEvaluteDate: async (formData: any) => {
    return api
      .post('addevaluatedate', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res)
  },
  AddReferenceDate: async (formData: any) => {
    return api
      .post('addreferencedate', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res)
  },
}
