import React, { useState } from 'react'
import {
  FormControl,
  FormLabel,
  HStack,
  Textarea,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  useToast,
} from '@chakra-ui/react'
import { StarIcon } from '@chakra-ui/icons'
import { ContractService } from '../services/contract'
import { useAuth } from '../context/Authcontext'

interface ReviewFormProps {
  contractId: string | undefined
  isOpen: boolean
  onClose: () => void
  fetchContract: () => void
}

const ReviewForm: React.FC<ReviewFormProps> = ({
  contractId,
  isOpen,
  onClose,
  fetchContract,
}) => {
  const [rating, setRating] = useState(0)
  const [comments, setComments] = useState('')
  const toast = useToast()
  const { setLoading } = useAuth()

  const submitReview = async () => {
    if (!rating || !comments.trim()) {
      toast({
        title: 'Review incomplete',
        description: 'Please provide both rating and comments.',
        status: 'warning',
        duration: 4000,
        isClosable: true,
      })
      return
    }

    setLoading(true)

    const formData: ClauseReview = {
      rating,
      comments,
      date: new Date().toISOString(),
      autoExecutableContract: {
        '@assetType': 'autoExecutableContract',
        '@key': contractId,
      },
    }

    try {
      await ContractService.AddReviewToContract(formData)
      toast({
        title: 'Review submitted',
        description: 'Your review has been successfully added.',
        status: 'success',
        duration: 4000,
        isClosable: true,
      })
      onClose()
      fetchContract()
    } catch (error) {
      toast({
        title: 'Error submitting review',
        description: 'An error occurred while submitting your review.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Give Feedback</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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

          <FormControl mt={4}>
            <FormLabel>Comments</FormLabel>
            <Textarea
              placeholder="Enter comments"
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </FormControl>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" size={'sm'} onClick={submitReview}>
            Submit
          </Button>
          <Button onClick={onClose} size={'sm'} ml={3}>
            Cancel
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default ReviewForm
