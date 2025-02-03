import { api } from './api'

export const ContractService = {
  CreateContract: async (formData: CreateContract) => {
    return api
      .post('createcontract', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
  },
  getUserContracts: async () => {
    return api.get('getusercontracts').then((res) => res.data)
  },
  GetContract: async (contractKey: string) => {
    return api
      .get(`getcontract?contractKey=${encodeURIComponent(contractKey)}`)
      .then((res) => res.data)
  },
  AddParticipants: async (formData: AddParticipants) => {
    return api
      .post('addparticipantrequest', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
  },
  AcceptInvite: async (token: string) => {
    return api
      .post(
        `addparticipants?token=${encodeURIComponent(token)}`,
        {},
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )
      .then((res) => res.data)
  },
  CancelContract: async (formData: CancelContract) => {
    return api
      .post('canceldocument', formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((res) => res.data)
  },
}
