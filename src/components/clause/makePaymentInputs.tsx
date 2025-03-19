import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  Input,
  Checkbox,
  useToast,
  FormControl,
  FormLabel,
  Flex,
} from '@chakra-ui/react'
import { FiUpload } from 'react-icons/fi'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

interface MakePaymentInputProps {
  clause: Clause
  onSubmitSuccess: () => void
}

const MakePaymentInputs: React.FC<MakePaymentInputProps> = ({
  clause,
  onSubmitSuccess,
}) => {
  const toast = useToast()
  const { setLoading } = useAuth()

  const [payment, setPayment] = useState<number>(0)
  const [finalPayment, setFinalPayment] = useState(false)
  const [receipt, setReceipt] = useState<File | null>(null)

  const showToast = (
    title: string,
    description: string,
    status: 'success' | 'error'
  ) => {
    toast({ title, description, status, duration: 3000, isClosable: true })
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setReceipt(event.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (payment === 0 || receipt === null) {
      showToast('Error', 'Please provide payment amount and receipt.', 'error')
      return
    }

    setLoading(true)

    try {
      const formData = new FormData()
      formData.append('clause', JSON.stringify(clause))
      formData.append('date', new Date().toISOString())
      formData.append('payment', String(payment))
      formData.append('finalPayment', String(finalPayment))
      if (receipt) formData.append('Receipt', receipt)

      const response = await ClauseService.AddInputsToMakePayment(formData)

      if (response.status !== 200) {
        showToast('Error', 'Failed to submit payment input.', 'error')
        setLoading(false)
        return
      }

      showToast('Success', 'Payment input submitted successfully.', 'success')
      onSubmitSuccess()
    } catch (error) {
      showToast('Error', 'Failed to submit payment input.', 'error')
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

      <VStack spacing={8} align="stretch">
        <FormControl>
          <FormLabel>Payment Amount</FormLabel>
          <Input
            type="number"
            placeholder="Enter payment amount"
            value={payment}
            onChange={(e) => setPayment(Number(e.target.value))}
          />
        </FormControl>

        <Checkbox
          isChecked={finalPayment}
          onChange={(e) => setFinalPayment(e.target.checked)}
        >
          Final Payment
        </Checkbox>

        {/* Custom File Upload Button */}
        <FormControl>
          <FormLabel>Upload Receipt</FormLabel>
          <Flex align="center">
            <Button
              as="label"
              htmlFor="file-upload"
              leftIcon={<FiUpload />}
              colorScheme="blue"
              cursor="pointer"
              size={'sm'}
            >
              Choose File
            </Button>
            <Input
              id="file-upload"
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileChange}
              hidden
            />
            {receipt && (
              <Text ml={3} fontSize="sm">
                {receipt.name}
              </Text>
            )}
          </Flex>
        </FormControl>

        <Button colorScheme="blue" onClick={handleSubmit}>
          Submit
        </Button>
      </VStack>
    </Box>
  )
}

export default MakePaymentInputs
