import { api } from './api'

export const DocumentService = {
  createDocument: async (formData : any) => {
    return api.post('uploaddocument', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }).then((res) => res.data)
  },
}
