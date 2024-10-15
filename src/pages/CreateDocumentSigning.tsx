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
} from '@chakra-ui/react'
import { useState, useEffect } from 'react'
import Navbar from '../components/navbar'
import { DragAndDrop } from '../components/drag&Drop'
import { useLocation } from 'react-router-dom'
import { FilePreview } from '../components/FileViewer'
import InviteSignerForm from '../components/inviteSignerForm'
import { DocumentService } from '../services/document'
import { useNavigate } from 'react-router-dom'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { formatISO } from 'date-fns'

function CreateDocumentSigning() {
  const location = useLocation()
  const [activeStep, setActiveStep] = useState(1)
  const [viewFile, setViewFile] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [signers, setSigners] = useState<string[]>([])
  const [calendarOpen, setCalendarOpen] = useState(true)

  const [timeoutDate, setTimeoutDate] = useState<Date>(() => {
    const date = new Date()
    date.setDate(date.getDate() + 2)
    return date
  })
  const toast = useToast()
  const navigate = useNavigate()

  const closeFileViewer = () => {
    setActiveStep(3)
    setViewFile(false)
  }

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

  const submitSigners = (signers: string[]) => {
    setSigners(signers)
    handleNext()
  }

  const submitDocument = async () => {
    const formData = new FormData()

    if (file) {
      formData.append('files', file)
    }

    formData.append('requiredSignatures', signers.join(','))
    formData.append('timeout', formatISO(timeoutDate))
    try {
      const response = await DocumentService.createDocument(formData)
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
    }
  }

  return (
    <Box>
      {/* Navbar */}
      <Navbar />
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
          signers.length === 0 &&
          (viewFile ? (
            <Box>
              <FilePreview
                isOpen={viewFile}
                onClose={closeFileViewer}
                file={file}
              />
            </Box>
          ) : (
            <Box>
              <Text fontSize="lg">
                Step 2: Please Review the document before proceeding.
              </Text>
              <Button
                mt={4}
                colorScheme="green"
                onClick={() => {
                  setViewFile(true)
                }}
              >
                View Document
              </Button>
            </Box>
          ))}
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
            >
              Next
            </Button>
          </Flex>
        )}
        {activeStep === 5 && signers.length > 0 && (
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
                <Text
                  fontSize="md"
                  wordBreak="break-word"
                  fontWeight="bold"
                  color="orange.600"
                >
                  {file ? file.name : 'No file uploaded'}
                </Text>
              </GridItem>

              <GridItem>
                <Text fontSize="md" fontWeight="bold">
                  Signer IDs:
                </Text>
              </GridItem>
              <GridItem justifySelf="flex-start">
                <Text
                  fontSize="md"
                  wordBreak="break-word"
                  fontWeight="bold"
                  color="orange.600"
                >
                  {signers.length > 0
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
                <Text fontSize="md" fontWeight="bold" color="orange.600">
                  {timeoutDate.toLocaleString()}
                </Text>
              </GridItem>
            </Grid>

            <Button mt={4} colorScheme="green" onClick={submitDocument}>
              Submit Document
            </Button>
          </Box>
        )}
      </Box>
    </Box>
  )
}

export default CreateDocumentSigning
