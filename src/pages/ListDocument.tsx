import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  VStack,
  Icon,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  List,
  ListItem,
  useToast,
} from '@chakra-ui/react'
import { ViewIcon, DownloadIcon } from '@chakra-ui/icons'
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import { returnDocumentStatus } from '../utils/returnDocumentStatus'
import { useQuery } from '@tanstack/react-query'
import { DocumentService } from '../services/document'
import { useAuth } from '../context/Authcontext'
import { FilePreview } from '../components/FileViewer'

const ListDocument = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedSigners, setSelectedSigners] = useState<UserKey[]>([])
  const [signerType, setSignerType] = useState('')
  const [documents, setDocuments] = useState<Document[]>([])
  const [signedDocuments, setSignedDocuments] = useState<Document[]>([])
  const [viewDocument, setViewDocument] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const { setLoading } = useAuth()
  const toast = useToast()

  const checkStatus = returnDocumentStatus

  const checkTimeout = (timeout: string) => {
    const currentTime = new Date()
    const deadline = new Date(timeout)
    if (currentTime > deadline) {
      return 'Expired'
    } else if (currentTime < deadline) {
      return 'Active'
    }
  }

  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ['UserDocuments'],
    queryFn: () => DocumentService.listDocument(),
  })

  const {
    data: signaturesData,
    isLoading: signaturesLoading,
    error: signaturesError,
  } = useQuery({
    queryKey: ['UserSignedDocuments'],
    queryFn: () => DocumentService.listSuccessfulSignatures(),
  })

  useEffect(() => {
    setLoading(true)
    if (!queryLoading) {
      if (error) {
        toast({
          title: 'Error',
          description: 'An error occurred while fetching data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setLoading(false)
      } else if (data['documents']) {
        setDocuments(data['documents'])
        setLoading(false)
      }
      setLoading(true)
    }
  }, [queryLoading, data, error])

  useEffect(() => {
    setLoading(true)
    if (!signaturesLoading) {
      if (signaturesError) {
        toast({
          title: 'Error',
          description: 'An error occurred while fetching data',
          status: 'error',
          duration: 3000,
          isClosable: true,
        })
        setLoading(false)
      } else if (signaturesData['documents']) {
        setSignedDocuments(signaturesData['documents'])
        setLoading(false)
      }
    }
  }, [signaturesLoading, signaturesData, signaturesError])

  const handleOpenModal = (signers: UserKey[], type: string) => {
    setSelectedSigners(signers)
    setSignerType(type)
    onOpen()
  }

  const fetchAndViewDocument = async (doc: Document) => {
    const formData = new FormData()
    setLoading(true)
    if (doc.finalDocURL) {
      formData.append('finalurl', doc.finalDocURL)
    } else {
      formData.append('originalurl', doc.originalDocURL)
    }

    try {
      const response = await DocumentService.downloadDocument(formData)
      if (response) {
        const blob = new Blob([response], { type: 'application/octet-stream' })
        const fetchedFile = new File([blob], `${doc.name}.pdf`, {
          type: blob.type,
        })

        setFile(fetchedFile)
        setViewDocument(true)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while fetching the document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const fetchAndDownloadDocument = async (doc: Document) => {
    setLoading(true)
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
        const url = window.URL.createObjectURL(blob)

        const link = document.createElement('a')
        link.href = url
        link.setAttribute('download', doc.name || 'download')
        document.body.appendChild(link)
        link.click()
        link.remove()
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while fetching the document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  const closeDocumentModel = () => {
    setLoading(true)
    setViewDocument(false)
    setFile(null)
    setLoading(false)
  }

  return (
    <Box>
      <VStack spacing={20} align="stretch" mx="auto" mt="20" width="95%">
        {/* Section 1: Uploaded Documents */}
        <Box p={5} borderRadius="md">
          <Heading size="md" mb={10}>
            Uploaded Documents
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Document Name</Th>
                <Th>Status</Th>
                <Th>Last Updated</Th>
                <Th>Owner</Th>
                <Th>Required Signatures</Th>
                <Th>Rejected Signatures</Th>
                <Th>Successful Signatures</Th>
                <Th>Deadline</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {documents.length > 0 &&
                documents.map((doc: Document) => (
                  <Tr key={doc['@key']}>
                    <Td
                      maxW="150px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {doc.name}
                    </Td>
                    <Td
                      color={doc.status === 3 ? 'green.500' : 'orange.500'}
                      fontWeight="bold"
                    >
                      {checkStatus(doc.status)}
                    </Td>
                    <Td>
                      {new Date(doc['@lastUpdated']).toLocaleDateString()}
                    </Td>
                    <Td>{doc.owner['@key']}</Td>
                    <Td>
                      {doc.requiredSignatures.length > 0 &&
                        doc.requiredSignatures?.[0]['@key']}
                      {doc.requiredSignatures.length >= 2 && (
                        <>
                          {' '}
                          ...{' '}
                          <Icon
                            as={ViewIcon}
                            ml={4}
                            onClick={() =>
                              handleOpenModal(
                                doc.requiredSignatures,
                                'Required Signatures'
                              )
                            }
                            aria-label="View full list"
                            cursor="pointer"
                            _hover={{
                              color: 'blue.500',
                              transform: 'scale(1.1)',
                            }}
                            transition="transform 0.2s ease, color 0.2s ease"
                            color="gray.400"
                          />
                        </>
                      )}
                    </Td>
                    <Td>
                      {doc.rejectedSignatures.length > 0 &&
                        doc.rejectedSignatures?.[0]['@key']}
                      {doc.rejectedSignatures.length >= 2 && (
                        <>
                          {' '}
                          ...{' '}
                          <Icon
                            as={ViewIcon}
                            ml={4}
                            onClick={() =>
                              handleOpenModal(
                                doc.rejectedSignatures,
                                'Rejected Signatures'
                              )
                            }
                            aria-label="View full list"
                            cursor="pointer"
                            _hover={{
                              color: 'blue.500',
                              transform: 'scale(1.1)',
                            }}
                            transition="transform 0.2s ease, color 0.2s ease"
                            color="gray.400"
                          />
                        </>
                      )}
                    </Td>
                    <Td>
                      {doc.successfulSignatures.length > 0 &&
                        doc.successfulSignatures?.[0]['@key']}
                      {doc.successfulSignatures.length >= 2 && (
                        <>
                          {' '}
                          ...{' '}
                          <Icon
                            as={ViewIcon}
                            ml={4}
                            onClick={() =>
                              handleOpenModal(
                                doc.successfulSignatures,
                                'Successful Signatures'
                              )
                            }
                            aria-label="View full list"
                            cursor="pointer"
                            _hover={{
                              color: 'blue.500',
                              transform: 'scale(1.1)',
                            }}
                            transition="transform 0.2s ease, color 0.2s ease"
                            color="gray.400"
                          />
                        </>
                      )}
                    </Td>
                    <Td
                      fontWeight="bold"
                      color={
                        checkTimeout(doc.timeout) === 'Active'
                          ? 'green.500'
                          : 'red.500'
                      }
                    >
                      {checkTimeout(doc.timeout)}
                    </Td>
                    <Td display="flex" alignItems="center">
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => fetchAndViewDocument(doc)}
                      >
                        View
                      </Button>
                      <Icon
                        as={DownloadIcon}
                        ml={4}
                        onClick={() => fetchAndDownloadDocument(doc)}
                        aria-label="View full list"
                        cursor="pointer"
                        _hover={{
                          color: 'blue.500',
                          transform: 'scale(1.1)',
                        }}
                        transition="transform 0.2s ease, color 0.2s ease"
                        color="gray.400"
                      />
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>

        {/* Section 2: Signed Documents */}
        <Box p={5} borderRadius="md">
          <Heading size="md" mb={10}>
            Documents Signed by You
          </Heading>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Document Name</Th>
                <Th>Status</Th>
                <Th>Last Updated</Th>
                <Th>Successful Signatures</Th>
                <Th>Rejected Signatures</Th>
                <Th>Deadline</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {signedDocuments.length > 0 &&
                signedDocuments.map((doc) => (
                  <Tr key={doc['@key']}>
                    <Td
                      maxW="150px"
                      whiteSpace="nowrap"
                      overflow="hidden"
                      textOverflow="ellipsis"
                    >
                      {doc.name}
                    </Td>
                    <Td>{doc.status}</Td>
                    <Td>
                      {new Date(doc['@lastUpdated']).toLocaleDateString()}
                    </Td>
                    <Td>{doc.requiredSignatures.join(', ')}</Td>
                    <Td></Td>
                    <Td></Td>
                    <Td></Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() => fetchAndViewDocument(doc)}
                      >
                        View Document
                      </Button>
                    </Td>
                  </Tr>
                ))}
            </Tbody>
          </Table>
        </Box>
      </VStack>

      {/* Pdf Viewer for documents */}
      {viewDocument && (
        <FilePreview
          isOpen={viewDocument}
          onClose={closeDocumentModel}
          file={file}
        />
      )}

      {/* Modal to show full list of signatures */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent p={6} maxW="400px" mx="auto">
          <ModalHeader textAlign="center">{signerType}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <List spacing={3}>
              {selectedSigners.length > 0 &&
                selectedSigners.map((signer, index) => (
                  <ListItem key={index}>{signer['@key']}</ListItem>
                ))}
            </List>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}

export default ListDocument
