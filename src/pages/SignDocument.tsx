import { useLocation, useNavigate } from 'react-router-dom'
import { FilePreview } from '../components/FileViewer'
import { useEffect, useState } from 'react'
import { fetchAndViewDocument } from '../utils/viewOrDownloadDocument'
import {
  useToast,
  Box,
  Button,
  Text,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
  Grid,
  GridItem,
  VStack,
  Heading,
} from '@chakra-ui/react'
import { useAuth } from '../context/Authcontext'
import { DocumentService } from '../services/document'
import { UserService } from '../services/User'
import { returnDocumentStatus } from '../utils/returnDocumentStatus'

const SignDocument: React.FC = () => {
  const location = useLocation()
  const doc = location.state?.document
  const [file, setFile] = useState<File | null>(null)
  const [document, SetDocument] = useState<Document | null>(null)
  const [coordinates, setCoordinates] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  })
  const [currentPage, setCurrentPage] = useState<number>(1)
  const [rejectSignature, SetRejectSignature] = useState<boolean>(false)
  const toast = useToast()
  const { user, setLoading } = useAuth()
  const navigate = useNavigate()

  const [isModalOpen, setModalOpen] = useState(false)
  const [password, setPassword] = useState('')

  useEffect(() => {
    setLoading(true)
    if (doc) {
      SetDocument(doc)
      const fetchFile = async () => {
        try {
          const file = await fetchAndViewDocument(doc)
          setFile(file)
        } catch (error) {
          toast({
            title: 'Error',
            description: 'An error occurred while fetching the file',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        } finally {
          setLoading(false)
        }
      }
      fetchFile()
    }
  }, [doc, toast])

  const handleSignDocument = () => {
    setModalOpen(true)
  }

  const handleConfirmPassword = async () => {
    setLoading(true)
    setModalOpen(false)

    if (!document || !user) return

    const userCredentials: LoginUser = {
      username: user.userName,
      password: password,
    }

    try {
      const res = await UserService.confirmPassword(userCredentials)
      if (res.status !== 200) {
        toast({
          title: 'Error',
          description: 'Please try again with the correct password',
          status: 'error',
        })
        setModalOpen(true)
        return
      }

      // pdf height should be validated for different screen size with pdf heights later
      const pdfHeight = 700
      const invertedY = pdfHeight - coordinates.y

      const sign: SignatureObject = {
        [document?.name]: {
          rect: {
            x: coordinates.x,
            y: invertedY,
            page: currentPage,
          },
          final: false,
        },
      }
      const stringSign = JSON.stringify(sign)

      const reqBody: Signature = {
        password: password,
        signature: stringSign,
        username: user.userName,
        cpf: user.cpf,
        dockey: document?.['@key'],
        rejectsignature: rejectSignature || false,
      }

      await DocumentService.putSignature(reqBody)

      setModalOpen(false)
      toast({
        title: 'Success',
        description: rejectSignature
          ? 'Signatures Rejected Successfully'
          : 'Document Signed Successfully',
        status: 'success',
      })
      navigate('/document/detail', { state: { docKey: doc['@key'] } })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while processing your request',
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCoordinateChange = (x: number, y: number) =>
    setCoordinates({ x, y })

  const handlePageChange = (page: number) => setCurrentPage(page)

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
    <Flex alignItems="start" m={10} justifyContent="space-evenly">
      <Box p={14} >
        <VStack align="start" spacing={4} >
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
        <Flex mt={20} justifyContent='end'>
          <Button
            colorScheme="red"
            size="sm"
            mr={4}
            onClick={() => {
              SetRejectSignature(true)
              handleSignDocument()
            }}
          >
            Reject Signature
          </Button>
          <Button colorScheme="green" size="sm" onClick={handleSignDocument}>
            Sign Document
          </Button>
        </Flex>
      </Box>

      {/* File Preview */}
      <FilePreview
        file={file}
        isSigning={true}
        onClose={() => {}}
        isOpen={true}
        useModal={false}
        onCoordinateChange={handleCoordinateChange}
        onPageChange={handlePageChange}
      />

      {/* Password Confirmation Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Password</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type={'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              size="sm"
              onClick={handleConfirmPassword}
            >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  )
}

export default SignDocument
