import { useState, useEffect } from 'react'
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
  HStack,
} from '@chakra-ui/react'
import { CalendarIcon } from '@chakra-ui/icons'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

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
  const [contractDates, setContractDates] = useState<Record<string, any>>({})
  const [contractHaveDates, setContractHaveDates] = useState(false)
  const [hasReferenceDate, setHasReferenceDate] = useState(false)

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

  useEffect(() => {
    setLoading(true)
    const fetchContractDates = async () => {
      try {
        const response = await ClauseService.GetDatesWithClause(clause['@key'])
        const dates = Object.keys(response)
        if (dates.length > 0) {
          setContractHaveDates(true)
          setContractDates(response.dates)
        }
      } catch (error) {
        showToast(
          'Error',
          'Failed to fetch contract dates. Please try again.',
          'error'
        )
      }
    }

    if (clause.parameters?.referenceDate) {
      setHasReferenceDate(true)
    }

    fetchContractDates()
    setLoading(false)
  }, [])

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
            <Text fontSize="sm" color="gray.500" mb={2}>
              Provide a reference date if not set earlier or if you want to
              update it. Skip this if you want to keep the existing one
            </Text>
            {contractHaveDates && (
              <VStack spacing={4} align="start" mb={4}>
                <HStack spacing={4} wrap="wrap">
                  {Object.keys(contractDates)
                    .filter((dateKey) => !dateKey.startsWith('@'))
                    .map((dateKey) => {
                      const formattedKey = dateKey
                        .replace(/([a-z])([A-Z])/g, '$1 $2')
                        .replace(/^./, (str: any) => str.toUpperCase())
                      return (
                        <Box
                          key={dateKey}
                          bg={'teal.100'}
                          p={2}
                          borderRadius="md"
                          boxShadow="sm"
                          cursor="pointer"
                          _hover={{
                            bg: 'teal.200',
                            transform: 'scale(1.05)',
                            transition: '0.2s',
                          }}
                          onClick={() => {
                            setReferenceDate(new Date(contractDates[dateKey]))
                          }}
                          transition="0.2s"
                        >
                          <Text color={'teal.800'} fontSize="smaller">
                            {formattedKey}
                          </Text>
                        </Box>
                      )
                    })}
                </HStack>
              </VStack>
            )}

            {contractHaveDates && (
              <Text fontSize="sm" color="gray.500" mb={2}>
                Or input your own reference date:
              </Text>
            )}
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
          <Text fontSize="sm" color="gray.500" mb={2}>
            Provide the date according to which the clause will be evaluated.
          </Text>
          {contractHaveDates && (
            <VStack spacing={4} align="start" mb={4}>
              <HStack spacing={4} wrap="wrap">
                {Object.keys(contractDates)
                  .filter((dateKey) => !dateKey.startsWith('@'))
                  .map((dateKey) => {
                    const formattedKey = dateKey
                      .replace(/([a-z])([A-Z])/g, '$1 $2')
                      .replace(/^./, (str: any) => str.toUpperCase())
                    return (
                      <Box
                        key={dateKey}
                        bg={'teal.100'}
                        p={2}
                        borderRadius="md"
                        boxShadow="sm"
                        cursor="pointer"
                        _hover={{
                          bg: 'teal.200',
                          transform: 'scale(1.05)',
                          transition: '0.2s',
                        }}
                        onClick={() => {
                          setEvaluatedDate(new Date(contractDates[dateKey]))
                        }}
                        transition="0.2s"
                      >
                        <Text color={'teal.800'} fontSize="smaller">
                          {formattedKey}
                        </Text>
                      </Box>
                    )
                  })}
              </HStack>
            </VStack>
          )}

          {contractHaveDates && (
            <Text fontSize="sm" color="gray.500" mb={2}>
              Or input your own evaluate date:
            </Text>
          )}
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
