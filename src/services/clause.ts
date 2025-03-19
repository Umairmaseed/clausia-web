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
    for (let pair of formData.entries()) {
      console.log(`${pair[0]}: ${pair[1]} (${typeof pair[1]})`)
    }
    return api
      .post('addinputstomakepayment', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res)
  },
}
