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
  useToast,
} from '@chakra-ui/react'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

interface GetCreditInputProps {
  clause: Clause
  onSubmitSuccess: () => void
}

const GetCreditInput: React.FC<GetCreditInputProps> = ({
  clause,
  onSubmitSuccess,
}) => {
  const toast = useToast()
  const { setLoading } = useAuth()
  const existingInput = clause.input

  const [storedValue, setStoredValue] = useState<number>(
    existingInput?.storedValue || 0
  )

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
      const response = await ClauseService.AddStoredValueToGetCredit({
        storedValue,
        clause,
      })

      if (response.status !== 200) {
        showToast('Error', 'Failed to submit credit input.', 'error')
        setLoading(false)
        return
      }

      showToast('Success', 'Credit input submitted successfully.', 'success')
      onSubmitSuccess()
    } catch (error) {
      showToast('Error', 'Failed to submit credit input.', 'error')
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
          <FormLabel>Stored Value</FormLabel>
          <NumberInput
            value={storedValue}
            onChange={(value) => setStoredValue(Number(value))}
          >
            <NumberInputField placeholder="Enter Stored Value" />
          </NumberInput>
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit Input
        </Button>
      </VStack>
    </Box>
  )
}

export default GetCreditInput
