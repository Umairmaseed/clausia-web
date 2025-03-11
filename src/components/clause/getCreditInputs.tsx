import { useState } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Textarea,
  NumberInput,
  NumberInputField,
  useToast,
  HStack,
  IconButton,
} from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { ClauseService } from '../../services/clause'
import { useAuth } from '../../context/Authcontext'

interface Clause {
  id: string
  input?: { review?: ClauseReview; storedValue?: number }
  parameters?: { reviewCondition?: boolean }
  result?: Record<string, any>
}

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
  const reviewCondition = clause.parameters?.reviewCondition ?? false

  const [storedValue, setStoredValue] = useState<number>(
    existingInput?.storedValue || 0
  )
  const [rating, setRating] = useState<number>(
    existingInput?.review?.rating || 0
  )
  const [comments, setComments] = useState<string>(
    existingInput?.review?.comments || ''
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

    if (reviewCondition && (!rating || !comments.trim())) {
      showToast('Error', 'Rating and comments are required.', 'error')
      setLoading(false)
      return
    }

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

  if (existingInput?.review) {
    return (
      <Box
        width="50%"
        p={4}
        borderWidth="1px"
        borderRadius={8}
        background="white"
      >
        <Text fontWeight="bold">Existing Input</Text>
        <Text>Rating: {existingInput.review.rating} ⭐</Text>
        <Text>Comments: {existingInput.review.comments}</Text>
        <Text>Stored Value: {existingInput.storedValue}</Text>
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
        {reviewCondition && (
          <>
            <FormControl>
              <FormLabel>Rating</FormLabel>
              <HStack>
                {[1, 2, 3, 4, 5].map((star) => (
                  <IconButton
                    key={star}
                    icon={
                      <StarIcon
                        color={star <= rating ? 'yellow.400' : 'gray.300'}
                      />
                    }
                    aria-label={`Rate ${star} stars`}
                    onClick={() => setRating(star)}
                    variant="ghost"
                  />
                ))}
              </HStack>
            </FormControl>

            <FormControl>
              <FormLabel>Comments</FormLabel>
              <Textarea
                placeholder="Enter comments"
                value={comments}
                onChange={(e) => setComments(e.target.value)}
              />
            </FormControl>
          </>
        )}

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
