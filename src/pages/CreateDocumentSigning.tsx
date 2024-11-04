import {
  Box,
  Flex,
  Button,
  Text,
  Circle,
  Heading,
  useToast,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Input,
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import { DragAndDrop } from '../components/drag&Drop'
import { useLocation } from 'react-router-dom'
import { FilePreview } from '../components/FileViewer'
import InviteSignerForm from '../components/inviteSignerForm'
import { DocumentService } from '../services/document'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatISO } from 'date-fns'
import { useAuth } from '../context/Authcontext'

function CreateDocumentSigning() {
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(1)
  const [file, setFile] = useState<File | null>(null)
  const [signersId, setSignersId] = useState<string[]>([])
  const [signers, setSigners] = useState<string[]>([])
  const [calendarOpen, setCalendarOpen] = useState(true)
  const [changeNameModel,setChangeNameModel] = useState(false)
  const [changedName,setChangedName] = useState("")
  const { setLoading } = useAuth()

  const [timeoutDate, setTimeoutDate] = useState<Date>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    return date
  })
  const toast = useToast()
  const navigate = useNavigate()

  useEffect(() => {
    if (location.state && location.state.file) {
      setFile(location.state.file)
      setActiveStep(2)
    }
  }, [location.state])

  const steps = [
    { label: 'Upload Document', key: 1, heading: 'Upload your document' },
    { label: 'Review', key: 2, heading: 'Review your document' },
    { label: 'Invite Signers', key: 3, heading: 'Invite signers to sign' },
    {
      label: 'Signing timeout',
      key: 4,
      heading: 'Time after which signature wont be accepted',
    },
    { label: 'Submit', key: 5, heading: 'Submit your document' },
  ]

  const handleNext = () => {
    if (activeStep < steps.length) {
      setActiveStep(activeStep + 1)
    }
  }

  const submitSigners = (signersId: string[], signers : string[]) => {
    setSignersId(signersId)
    setSigners(signers)
    handleNext()
  }

  const submitDocument = async () => {
    setLoading(true)
    const formData = new FormData()

    if (file) {
      formData.append('files', file)
    }

    formData.append('requiredSignatures', signersId.join(','))
    formData.append('timeout', formatISO(timeoutDate))
    try {
      await DocumentService.createDocument(formData)
      toast({
        title: 'Document created successfully',
        status: 'success',
      })
      navigate('/document')
    } catch (error) {
      toast({
        title: 'Failed to create document',
        status: 'error',
      })
    } finally {
      setLoading(false)
    }
  }

  const updateFileName = (newName : string) => {
    if (!file) return; 
  
    const fileExtension = file.name.split('.').pop();
  
    const updatedFile = new File([file], `${newName}.${fileExtension}`, {
      type: file.type,
      lastModified: file.lastModified,
    });
  
    setFile(updatedFile); 
  
    setChangeNameModel(false);
  };

  return (
    <Box>
      {/* Banner */}
      <Box textAlign="center" py={10}>
        <Heading fontSize="2xl" fontWeight="bold">
          Complete the process in {steps.length} simple steps
        </Heading>
        <Text mt={4} size="xl" color="gray.600">
          {steps[activeStep - 1].heading}
        </Text>
      </Box>

      {/* Step Progress */}
      <Flex justifyContent="space-around" alignItems="center" py={10} px={20}>
        {steps.map((step) => (
          <>
            <Flex key={step.key} direction="column" alignItems="center">
              <Circle
                size="80px"
                bg={activeStep >= step.key ? 'green.400' : 'gray.200'}
                color="white"
                fontWeight="bold"
                fontSize="2xl"
              >
                {step.key}
              </Circle>

              <Text
                mt={2}
                textAlign='center'
                fontWeight={activeStep >= step.key ? 'bold' : 'normal'}
              >
                {step.label}
              </Text>
            </Flex>
            {step.key < steps.length && <Box w="250px" h="2px" bg="gray.400" />}
          </>
        ))}
      </Flex>

      {/* Bottom Component */}
      <Box py={6} textAlign="center">
        {activeStep === 1 && (
          <Flex justifyContent="center" alignItems="center">
            <DragAndDrop />
          </Flex>
        )}
        {activeStep === 2 &&
          signersId.length === 0 &&
            <Box>
              <FilePreview
                isOpen={true}
                onClose={()=>{}}
                file={file}
                useModal={false}
              />
              <Button
                mt={4}
                colorScheme="green"
                onClick={() => {
                  setActiveStep(3)
                }}
              >
                Next
              </Button>
            </Box>
          }
        {activeStep === 3 && (
          <Box>
            <InviteSignerForm submitSigners={submitSigners} />
          </Box>
        )}
        {activeStep === 4 && (
          <Flex
            gap={20}
            justifyContent="center"
            alignItems="center"
            mb={4}
            mt={14}
          >
            <DatePicker
              selected={timeoutDate}
              onChange={(date) => {
                setTimeoutDate(date ? date : new Date())
                setCalendarOpen(true)
              }}
              showTimeSelect
              dateFormat="Pp"
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="Time"
              placeholderText="Select date and time"
              isClearable
              open={calendarOpen}
              onCalendarClose={() => setCalendarOpen(false)}
            />
            <Button
              mt={4}
              colorScheme="green"
              onClick={() => {
                handleNext()
              }}
              size='sm'
            >
              Next
            </Button>
          </Flex>
        )}
        {activeStep === 5 && signersId.length > 0 && (
          <Box mb={4}>
            <Grid
              templateColumns="1fr 1fr"
              gap={4}
              mb={20}
              justifyItems="center"
            >
              <GridItem>
                <Text fontSize="md" fontWeight="bold">
                  File Name:
                </Text>
              </GridItem>
              <GridItem justifySelf="flex-start">
                <Flex alignItems="center">
                <Text
                  fontSize="md"
                  wordBreak="break-word"
                  fontWeight="bold"
                  color="gray.500"
                >
                  {file ? file.name : 'No file uploaded'}
                </Text>
                <Button ml={4} size='sm' variant='ghost' colorScheme="orange" onClick={()=>{setChangeNameModel(true)}}>
                  Change
                </Button>
                </Flex>
              </GridItem>

              <GridItem>
                <Text fontSize="md" fontWeight="bold">
                  Signer:
                </Text>
              </GridItem>
              <GridItem justifySelf="flex-start">
                <Text
                  fontSize="md"
                  wordBreak="break-word"
                  fontWeight="bold"
                  color="gray.500"
                >
                  {signersId.length > 0
                    ? signers.join(', ')
                    : 'No signers invited'}
                </Text>
              </GridItem>

              <GridItem>
                <Text fontSize="md" fontWeight="bold">
                  Timeout:
                </Text>
              </GridItem>
              <GridItem justifySelf="flex-start">
                <Text fontSize="md" fontWeight="bold" color="gray.500">
                  {timeoutDate.toLocaleString()}
                </Text>
              </GridItem>
            </Grid>

            <Button mt={4} size='md' colorScheme="green" onClick={submitDocument}>
              Submit Document
            </Button>
          </Box>
        )}
        <Modal isOpen={changeNameModel} onClose={() => setChangeNameModel(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Change Name</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Input
              type={'text'}
              placeholder="Enter new name"
              value={changedName}
              onChange={(e) => setChangedName(e.target.value)}
              mb={4}
            />
          </ModalBody>
          <ModalFooter>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setChangeNameModel(false)}
            >
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              mr={3}
              size="sm"
              onClick={() => updateFileName(changedName)} 
              >
              Confirm
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      </Box>
    </Box>
  )
}

export default CreateDocumentSigning
