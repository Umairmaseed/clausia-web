import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  Slider,
  SliderTrack,
  SliderFilledTrack,
  SliderThumb,
  useToast,
  Select,
} from '@chakra-ui/react'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'
import { ActionType } from '../../utils/actionType'

interface GetDeductionInputProps {
  clause: Clause
  onSubmitSuccess: () => void
  contract: AutoExecutableContract
}

const GetDeductionInput: React.FC<GetDeductionInputProps> = ({
  clause,
  onSubmitSuccess,
  contract,
}) => {
  const toast = useToast()
  const { setLoading } = useAuth()
  const existingInput = clause.input

  const [referenceValue, setReferenceValue] = useState<number>(
    existingInput?.referenceValue || 0
  )
  const [dailyPercentage, setDailyPercentage] = useState<number>(
    existingInput?.dailyPercentage || 0
  )
  const [days, setDays] = useState<number>(existingInput?.days || 0)
  const [referenceClauseDays, setReferenceClauseDays] = useState<boolean>(false)
  const [selectedClauseId, setSelectedClauseId] = useState<string>('')
  const [cdiClauseList, setCdiClauseList] = useState<Clause[]>([])

  const extractCdiClauses = () => {
    if (!contract?.clauses?.length) {
      setCdiClauseList([])
      return
    }

    const filteredClauses = contract.clauses.filter(
      (clause) => clause.actionType === ActionType.CheckDateInterval
    )

    setCdiClauseList(filteredClauses)
  }

  useEffect(() => {
    extractCdiClauses()
  }, [contract])

  const showToast = (
    title: string,
    description: string,
    status: 'success' | 'error'
  ) => {
    toast({ title, description, status, duration: 3000, isClosable: true })
  }

  const handleSubmit = async () => {
    setLoading(true)

    const selectedClause = cdiClauseList.find(
      (clause) => clause['@key'] === selectedClauseId
    )

    const requestPayload: any = {
      referenceValue,
      dailyPercentage,
      days,
      clause,
    }

    if (referenceClauseDays === true && selectedClause?.parameters?.name) {
      requestPayload.referenceClauseDays = referenceClauseDays
      requestPayload.referenceClauseName = selectedClause.parameters.name
    }

    try {
      const response =
        await ClauseService.AddInputsToGetDeduction(requestPayload)

      if (response.status !== 200) {
        showToast('Error', 'Failed to submit deduction input.', 'error')
        setLoading(false)
        return
      }

      showToast('Success', 'Deduction input submitted successfully.', 'success')
      onSubmitSuccess()
    } catch (error) {
      showToast('Error', 'Failed to submit deduction input.', 'error')
    }
    setLoading(false)
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
        <FormControl>
          <FormLabel>Reference Value</FormLabel>
          <Text fontSize="sm" color="gray.500" mb="4">
            This value serves as the foundation from which the fine will be
            derived, based on the given percentage.
          </Text>
          <NumberInput
            value={referenceValue}
            onChange={(value) => setReferenceValue(Number(value))}
          >
            <NumberInputField placeholder="Enter Reference Value" />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Daily Percentage : {dailyPercentage}%</FormLabel>
          <Text fontSize="sm" color="gray.500" mb="4">
            Specify the percentage to determine how much of the reference value
            should be considered when applying the fine.{' '}
          </Text>
          <Slider
            value={dailyPercentage}
            min={0}
            max={100}
            step={0.5}
            onChange={(val) => setDailyPercentage(val)}
          >
            <SliderTrack>
              <SliderFilledTrack background="orange" />
            </SliderTrack>
            <SliderThumb />
          </Slider>
        </FormControl>

        <FormControl>
          <FormLabel>Days</FormLabel>

          {cdiClauseList.length > 0 ? (
            <>
              <Text fontSize="sm" color="gray.500" mb="2">
                Select a CDI clause to automatically calculate the deduction
                based on its output, or manually enter the number of days.
              </Text>

              <Select
                placeholder="Select CDI clause"
                value={selectedClauseId}
                onChange={(e) => {
                  const selected = e.target.value
                  setSelectedClauseId(selected)
                  if (selected) {
                    setReferenceClauseDays(true)
                    setDays(0)
                  }
                  if (selected === '') {
                    setReferenceClauseDays(false)
                  }
                }}
                mb={4}
              >
                {cdiClauseList.map((clause) => (
                  <option key={clause.id} value={clause['@key']}>
                    {clause.parameters && clause.parameters.name}
                  </option>
                ))}
              </Select>
            </>
          ) : (
            <Text fontSize="sm" color="gray.500" mb="2">
              Please enter the number of days for which you want to implement
              the fine.
            </Text>
          )}

          {(!selectedClauseId || cdiClauseList.length === 0) && (
            <NumberInput
              value={days}
              onChange={(value) => setDays(Number(value))}
            >
              <NumberInputField placeholder="Enter Days" />
            </NumberInput>
          )}
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit Input
        </Button>
      </VStack>
    </Box>
  )
}

export default GetDeductionInput
