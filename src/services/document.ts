import { api } from './api'

export const DocumentService = {
  createDocument: async (formData: any) => {
    return api
      .post('uploaddocument', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then((res) => res.data)
  },
  listDocument: async () => {
    return api.get('listdocuments').then((res) => res.data)
  },
  listSuccessfulSignatures: async () => {
    return api.get('listsuccessfulsignatures').then((res) => res.data)
  },
  downloadDocument: async (formData: any) => {
    return api
      .post('downloaddocument', formData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        responseType: 'blob',
      })
      .then((res) => {
        return res.data
      })
  },
  getDocument: async (id: string) => {
    return api.get(`getdocument?key=${id}`).then((res) => res.data)
  },
}
