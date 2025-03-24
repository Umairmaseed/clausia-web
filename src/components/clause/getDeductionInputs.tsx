import { useState } from 'react'
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
} from '@chakra-ui/react'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

interface GetDeductionInputProps {
  clause: Clause
  onSubmitSuccess: () => void
}

const GetDeductionInput: React.FC<GetDeductionInputProps> = ({
  clause,
  onSubmitSuccess,
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

  const showToast = (
    title: string,
    description: string,
    status: 'success' | 'error'
  ) => {
    toast({ title, description, status, duration: 3000, isClosable: true })
  }

  const handleSubmit = async () => {
    setLoading(true)

    try {
      const response = await ClauseService.AddInputsToGetDeduction({
        referenceValue,
        dailyPercentage,
        days,
        clause,
      })

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
          <NumberInput
            value={referenceValue}
            onChange={(value) => setReferenceValue(Number(value))}
          >
            <NumberInputField placeholder="Enter Reference Value" />
          </NumberInput>
        </FormControl>

        <FormControl>
          <FormLabel>Daily Percentage : {dailyPercentage}%</FormLabel>
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
          <NumberInput
            value={days}
            onChange={(value) => setDays(Number(value))}
          >
            <NumberInputField placeholder="Enter Days" />
          </NumberInput>
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit Input
        </Button>
      </VStack>
    </Box>
  )
}

export default GetDeductionInput
