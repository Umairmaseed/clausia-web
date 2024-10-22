import { DocumentService } from '../services/document'

const fetchDocument = async (doc: Document) => {
  const formData = new FormData()

  if (doc.finalDocURL) {
    formData.append('finalurl', doc.finalDocURL)
  } else {
    formData.append('originalurl', doc.originalDocURL)
  }

  try {
    const response = await DocumentService.downloadDocument(formData)
    if (response) {
      const blob = new Blob([response], { type: 'application/octet-stream' })
      return blob
    }
  } catch (error) {
    return null
  }
}

const viewDocument = (blob: Blob, doc: Document) => {
  const fetchedFile = new File([blob], `${doc.name}.pdf`, { type: blob.type })
  return fetchedFile
}

const downloadDocument = (blob: Blob, doc: Document) => {
  const url = window.URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.setAttribute('download', doc.name || 'download')
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.URL.revokeObjectURL(url)
  return undefined
}

export const fetchAndViewDocument = async (
  doc: Document
): Promise<File | null> => {
  let fetchedFile: File | null = null
  await fetchDocument(doc).then((blob) => {
    if (blob) {
      fetchedFile = viewDocument(blob, doc)
    }
  })
  return fetchedFile
}

export const fetchAndDownloadDocument = async (doc: Document) => {
  const blob = await fetchDocument(doc)
  if (blob) {
    downloadDocument(blob, doc)
  }
}
