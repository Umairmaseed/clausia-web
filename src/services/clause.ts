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
  AddStoredValueToGetCredit: async (formData: any) => {
    return api
      .post('addstoredvaluetogetcredit', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res)
  },
  AddInputsToMakePayment: async (formData: any) => {
    return api
      .post('addinputstomakepayment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res)
  },
  AddInputsToGetDeduction: async (formData: any) => {
    return api
      .post('addinputstocheckfine', JSON.stringify(formData), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res)
  },
  GetDatesWithClause: async (clasueKey: string) => {
    return api
      .get(`getdateswithclause?clauseKey=${encodeURIComponent(clasueKey)}`)
      .then((res) => res.data)
  },
}
