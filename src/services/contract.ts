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
  }
}
