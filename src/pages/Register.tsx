import {
  Box,
  Grid,
  GridItem,
  Heading,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Button,
  VStack,
  useBreakpointValue,
  Center,
  useToast,
} from '@chakra-ui/react'
import { useState } from 'react'
import Navbar from '../components/navbar'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { UserService } from '../services/User'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'

const Register = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const gridTemplateColumns = useBreakpointValue({
    base: '1fr',
    md: '1fr 1fr',
  })

  const justifyForm = useBreakpointValue({
    base: 'center',
    md: 'start',
  })

  const toast = useToast()

  // State for form fields and errors
  const [formData, setFormData] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  })

  const [errors, setErrors] = useState({
    username: '',
    name: '',
    email: '',
    phone: '',
    cpf: '',
    password: '',
    confirmPassword: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    })

    // Reset error for this field when user types
    setErrors({
      ...errors,
      [e.target.id]: '',
    })
  }

  const mutation = useMutation({
    mutationFn: UserService.registerUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['Users'] })
      toast({
        title: 'Registration successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      navigate('/otp')
    },
    onError: (error: AxiosError) => {
      toast({
        title: 'Registration failed.',
        description: error?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const validateForm = () => {
    let valid = true
    const newErrors: RegisterUser = {
      username: '',
      name: '',
      email: '',
      phone: '',
      cpf: '',
      password: '',
      confirmPassword: '',
    }

    if (!formData.username) {
      newErrors.username = 'Username is required'
      valid = false
    }
    if (!formData.name) {
      newErrors.name = 'Name is required'
      valid = false
    }
    if (!formData.email) {
      newErrors.email = 'Email is required'
      valid = false
    }
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required'
      valid = false
    }
    if (!formData.cpf) {
      newErrors.cpf = 'CPF is required'
      valid = false
    }
    if (!formData.password) {
      newErrors.password = 'Password is required'
      valid = false
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm password is required'
      valid = false
    }
    if (
      formData.password &&
      formData.confirmPassword &&
      formData.password !== formData.confirmPassword
    ) {
      newErrors.confirmPassword = 'Passwords do not match'
      valid = false
    }

    setErrors(newErrors)
    return valid
  }

  const handleRegister = async () => {
    if (!validateForm()) return

    mutation.mutate(formData)
  }

  return (
    <>
      <Navbar />
      <Center p={8} minH="100vh" minW="100vw" bg="gray.50">
        <Grid templateColumns={gridTemplateColumns} ml={10} w="full">
          <GridItem justifySelf={justifyForm}>
            <Box
              bg="white"
              p={8}
              boxShadow="xl"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              w={{ base: 'full', md: '500px' }}
            >
              <Heading mb={6} size="3xl" color="gray.600" textAlign="center">
                Register
              </Heading>
              <VStack spacing={4}>
                {/* Username Field */}
                <FormControl
                  id="username"
                  isInvalid={!!errors.username}
                  isRequired
                >
                  <FormLabel fontWeight="bold">Username</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter username"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.username}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.username && (
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Name Field */}
                <FormControl id="name" isInvalid={!!errors.name} isRequired>
                  <FormLabel fontWeight="bold">Name</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.name}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.name && (
                    <FormErrorMessage>{errors.name}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Email Field */}
                <FormControl id="email" isInvalid={!!errors.email} isRequired>
                  <FormLabel fontWeight="bold">Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter email"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.email}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.email && (
                    <FormErrorMessage>{errors.email}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Phone Field */}
                <FormControl id="phone" isInvalid={!!errors.phone} isRequired>
                  <FormLabel fontWeight="bold">Phone</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter phone number"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.phone}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.phone && (
                    <FormErrorMessage>{errors.phone}</FormErrorMessage>
                  )}
                </FormControl>

                {/* CPF Field */}
                <FormControl id="cpf" isInvalid={!!errors.cpf} isRequired>
                  <FormLabel fontWeight="bold">CPF</FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter CPF"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.cpf}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.cpf && (
                    <FormErrorMessage>{errors.cpf}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Password Field */}
                <FormControl
                  id="password"
                  isInvalid={!!errors.password}
                  isRequired
                >
                  <FormLabel fontWeight="bold">Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.password}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.password && (
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  )}
                </FormControl>

                {/* Confirm Password Field */}
                <FormControl
                  id="confirmPassword"
                  isInvalid={!!errors.confirmPassword}
                  isRequired
                >
                  <FormLabel fontWeight="bold">Confirm Password</FormLabel>
                  <Input
                    type="password"
                    placeholder="Confirm password"
                    bg="gray.100"
                    fontWeight="bold"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  {errors.confirmPassword && (
                    <FormErrorMessage>
                      {errors.confirmPassword}
                    </FormErrorMessage>
                  )}
                </FormControl>

                {/* Register Button */}
                <Button
                  colorScheme="blue"
                  width="full"
                  mt={4}
                  onClick={handleRegister}
                >
                  Register
                </Button>
              </VStack>
            </Box>
          </GridItem>

          <GridItem></GridItem>
        </Grid>
      </Center>
    </>
  )
}

export default Register
