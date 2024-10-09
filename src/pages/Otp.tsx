import {
  Box,
  Input,
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useToast,
  Heading,
  Flex
} from '@chakra-ui/react'
import Navbar from '../components/navbar'
import { useState } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserService } from '../services/User'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

const Otp = () => {
  const queryClient = useQueryClient()
  const toast = useToast()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    username: '',
    otp: '',
  })

  const [errors, setErrors] = useState({
    username: '',
    otp: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })

    setErrors({
      ...errors,
      [e.target.id]: '',
    })
  }

  const mutation = useMutation({
    mutationFn: ({ username, otp }: { username: string; otp: string }) =>
      UserService.confirmOtp(username, otp),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Users'] })
      toast({
        title: 'account created successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/login')
    },
    onError: (error: AxiosError) => {
      toast({
        title: 'Submission failed.',
        description: error?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const validateForm = () => {
    let valid = true
    const newErrors = {
      username: '',
      otp: '',
    }

    if (!formData.username) {
      newErrors.username = 'Username is required'
      valid = false
    }
    if (!formData.otp) {
      newErrors.otp = 'OTP is required'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleSubmit = async () => {
    if (!validateForm()) return
    mutation.mutate({ username: formData.username, otp: formData.otp })
  }

  return (
    <>
      <Navbar />
      <Flex  pt={20} pl={20}>
      <Box
        bg="white"
        p={8}
        boxShadow="xl"
        borderRadius="xl"
        border="1px solid"
        borderColor="gray.200"
        w={{ base: 'full', md: '450px' }}
        ml="auto"
        mr="auto"
        mt="20"
      >
        <Box>
          <Heading mb={6} size="xl" color="gray.600" textAlign="center">
            Confirm OTP
          </Heading>
          {/* Username Field */}
          <FormControl id="username" isInvalid={!!errors.username} isRequired>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              placeholder="Username"
              bg="gray.100"
              mb={4}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && (
              <FormErrorMessage>{errors.username}</FormErrorMessage>
            )}
          </FormControl>

          {/* OTP Field */}
          <FormControl id="otp" isInvalid={!!errors.otp} isRequired>
            <FormLabel>OTP</FormLabel>
            <Input
              type="text"
              placeholder="Enter OTP"
              bg="gray.100"
              mb={4}
              value={formData.otp}
              onChange={handleChange}
            />
            {errors.otp && <FormErrorMessage>{errors.otp}</FormErrorMessage>}
          </FormControl>

          {/* Submit Button */}
          <Button colorScheme="blue" mt={4} onClick={handleSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
      </Flex>
    </>
  )
}

export default Otp
