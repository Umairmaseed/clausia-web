import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  FormLabel,
  InputGroup,
  Input,
  InputRightElement,
  IconButton,
  useToast,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

interface Clause {
  id: string
  input?: { evaluatedDate?: string }
  parameters?: Record<string, any>
  result?: Record<string, any>
}

interface DateTimeInputProps {
  clause: Clause
  onSubmitSuccess: () => void
}

const DateTimeInput: React.FC<DateTimeInputProps> = ({
  clause,
  onSubmitSuccess,
}) => {
  const toast = useToast()
  const existingInput = clause.input
  const { setLoading } = useAuth()

  const [evaluatedDate, setEvaluatedDate] = useState<Date | null>(
    existingInput?.evaluatedDate ? new Date(existingInput.evaluatedDate) : null
  )

  const [referenceDate, setReferenceDate] = useState<Date | null>(
    clause.parameters?.referenceDate
      ? new Date(clause.parameters.referenceDate)
      : null
  )

  const [isEvaluatedOpen, setEvaluatedOpen] = useState(false)
  const [isReferenceOpen, setReferenceOpen] = useState(false)
  const hasReferenceDate = false

  const showToast = (
    title: string,
    description: string,
    status: 'success' | 'error'
  ) => {
    toast({
      title,
      description,
      status,
      duration: 3000,
      isClosable: true,
    })
  }

  const handleSubmit = async () => {
    setLoading(true)
    if (!evaluatedDate) {
      showToast('Error', 'Evaluated date is required.', 'error')
      return
    }

    if (!hasReferenceDate && !referenceDate) {
      showToast('Error', 'Reference date is required.', 'error')
      return
    }

    try {
      if (
        referenceDate &&
        referenceDate.toISOString() !==
          new Date(clause.parameters?.referenceDate).toISOString()
      ) {
        await ClauseService.AddReferenceDate({
          referenceDate: referenceDate.toISOString(),
          clause,
        })
      }

      await ClauseService.AddEvaluteDate({
        evaluateDate: evaluatedDate.toISOString(),
        clause,
      })
      showToast('Success', 'Input submitted successfully.', 'success')
      onSubmitSuccess()
    } catch (error) {
      showToast('Error', 'Failed to submit input.', 'error')
    }
    setLoading(false)
  }

  if (existingInput?.evaluatedDate) {
    return (
      <Box
        width="50%"
        p={4}
        borderWidth="1px"
        borderRadius={8}
        background="white"
      >
        <Text fontWeight="bold">Existing Input</Text>
        <Text>
          Evaluated Date:{' '}
          {new Date(existingInput.evaluatedDate).toLocaleString()}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      width="100%"
      p={6}
      borderWidth="1px"
      borderRadius={8}
      background="white"
      borderColor="red.400"
    >
      <Text fontWeight="bold" color="red.400" mb={4}>
        Inputs Required
      </Text>
      <VStack spacing={4} align="stretch">
        {!hasReferenceDate && (
          <FormControl>
            <FormLabel>Reference Date</FormLabel>
            <InputGroup>
              <DatePicker
                selected={referenceDate}
                onChange={setReferenceDate}
                dateFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"
                showTimeSelect
                customInput={<Input placeholder="Select Reference Date" />}
                open={isReferenceOpen}
                onClickOutside={() => setReferenceOpen(false)}
              />
              <InputRightElement>
                <IconButton
                  aria-label="Open Calendar"
                  icon={<CalendarIcon />}
                  size="sm"
                  onClick={() => setReferenceOpen(!isReferenceOpen)}
                />
              </InputRightElement>
            </InputGroup>
          </FormControl>
        )}

        <FormControl>
          <FormLabel>Evaluated Date</FormLabel>
          <InputGroup>
            <DatePicker
              selected={evaluatedDate}
              onChange={setEvaluatedDate}
              dateFormat="yyyy-MM-dd'T'HH:mm:ss'Z'"
              showTimeSelect
              customInput={<Input placeholder="Select Evaluated Date" />}
              open={isEvaluatedOpen}
              onClickOutside={() => setEvaluatedOpen(false)}
            />
            <InputRightElement>
              <IconButton
                aria-label="Open Calendar"
                icon={<CalendarIcon />}
                size="sm"
                onClick={() => setEvaluatedOpen(!isEvaluatedOpen)}
              />
            </InputRightElement>
          </InputGroup>
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit Input
        </Button>
      </VStack>
    </Box>
  )
}

export default DateTimeInput
