import {
  Box,
  VStack,
  Text,
  Heading,
  useToast,
  Grid,
  GridItem,
} from '@chakra-ui/react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { DocumentService } from '../services/document'
import { useAuth } from '../context/Authcontext'
import { FilePreview } from '../components/FileViewer'
import { useEffect, useState } from 'react'
import { fetchAndViewDocument } from '../utils/viewOrDownloadDocument'
import { returnDocumentStatus } from '../utils/returnDocumentStatus'

const DocumentDetail = () => {
  const [document, setDocument] = useState<Document | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const location = useLocation()
  const toast = useToast()
  const { setLoading } = useAuth()
  const docId = location.state?.docKey
  const navigate = useNavigate()

  const { data, isLoading, error } = useQuery({
    queryKey: ['DocumentDetail', docId],
    queryFn: () => fetchDocumentDetails(),
  })

  const fetchDocumentDetails = async () => {
    if (!docId) {
      navigate('/document/list')
    } else {
      const response = await DocumentService.getDocument(docId)
      return response
    }
  }

  useEffect(() => {
    setLoading(isLoading)

    if (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while fetching the document',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    if (data && data.document) {
      setDocument(data.document)

      const fetchFile = async () => {
        try {
          const file = await fetchAndViewDocument(data.document)
          setFile(file)
        } catch (error) {
          toast({
            title: 'Error',
            description: 'An error occurred while fetching the file',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        }
      }

      fetchFile()
    }
  }, [isLoading, error, data, setLoading, toast])

  const checkTimeout = (timeout: string) => {
    const currentTime = new Date()
    const deadline = new Date(timeout)
    if (currentTime > deadline) {
      return 'Expired'
    } else if (currentTime < deadline) {
      return 'Active'
    }
  }

  return (
    <Box display="flex" p={20} width="100%" pt={10}>
      {/* Left side: Document details */}
      <Box width="60%" p={5}>
        <VStack align="start" spacing={4}>
          <Heading size="lg" mb={10} color="orange.500">
            Document Details
          </Heading>
          {document && (
            <Grid templateColumns="150px 1fr" gap={4} width="100%">
              <GridItem>
                <Text fontWeight="bold">Name:</Text>
              </GridItem>
              <GridItem>
                <Text>{document?.name}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Status:</Text>
              </GridItem>
              <GridItem>
                <Text
                  fontWeight="bold"
                  color={document?.status == 3 ? 'green.500' : 'yellow.500'}
                >
                  {returnDocumentStatus(document?.status || 0)}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Owner:</Text>
              </GridItem>
              <GridItem>
                <Text>{document.owner.name}</Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Last Updated:</Text>
              </GridItem>
              <GridItem>
                <Text>
                  {new Date(document['@lastUpdated']).toLocaleDateString()}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Required Signatures:</Text>
              </GridItem>
              <GridItem>
                <Text>
                  {document?.requiredSignatures
                    .map((signer) => signer.name)
                    .join(', ')}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Rejected Signatures:</Text>
              </GridItem>
              <GridItem>
                <Text>
                  {document?.rejectedSignatures
                    .map((signer) => signer.name)
                    .join(', ')}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Successful Signatures:</Text>
              </GridItem>
              <GridItem>
                <Text>
                  {document?.successfulSignatures
                    .map((signer) => signer.name)
                    .join(', ')}
                </Text>
              </GridItem>
              <GridItem>
                <Text fontWeight="bold">Deadline:</Text>
              </GridItem>
              <GridItem>
                <Text
                  fontWeight="bold"
                  color={
                    checkTimeout(document.timeout) === 'Active'
                      ? 'green.500'
                      : 'red.500'
                  }
                >
                  {new Date(document?.timeout || '').toLocaleDateString()}
                </Text>
              </GridItem>
            </Grid>
          )}
        </VStack>
      </Box>

      {/* Right side: Document preview */}
      <Box width="35%" p={5}>
        <FilePreview
          file={file}
          isOpen={true}
          onClose={() => {}}
          useModal={false}
        />
      </Box>
    </Box>
  )
}

export default DocumentDetail
