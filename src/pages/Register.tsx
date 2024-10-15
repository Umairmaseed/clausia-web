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
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { UserService } from '../services/User'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/navbar'

const Register = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const toast = useToast()

  const gridTemplateColumns = useBreakpointValue({
    base: '1fr',
    md: '1fr 1fr',
  })

  const justifyForm = useBreakpointValue({
    base: 'center',
    md: 'start',
  })

  // React Hook Form initialization
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    mode: 'onBlur',
  })

  // Mutation for registration
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

  // Submit handler
  const onSubmit = (data: any) => {
    mutation.mutate(data)
  }

  return (
    <>
      <Navbar />
      <Center p={8} minH="100vh" minW="100vw" bg="gray.50">
        <Grid templateColumns={gridTemplateColumns} mt={6} ml={10} w="full">
          <GridItem justifySelf={justifyForm}>
            <Box
              bg="white"
              p={8}
              boxShadow="xl"
              borderRadius="xl"
              border="1px solid"
              borderColor="gray.200"
              w={{ base: 'full', md: '400px' }}
            >
              <Heading mb={6} size="3xl" color="gray.600" textAlign="center">
                Register
              </Heading>
              <VStack spacing={4}>
                {/* Form fields */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  style={{ width: '100%' }}
                >
                  {/* Username Field */}
                  <FormControl isInvalid={!!errors.username} isRequired>
                    <FormLabel fontWeight="bold">Username</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter username"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('username', {
                        required: 'Username is required',
                      })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.username?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Name Field */}
                  <FormControl isInvalid={!!errors.name} isRequired>
                    <FormLabel fontWeight="bold">Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter name"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('name', { required: 'Name is required' })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.name?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Email Field */}
                  <FormControl isInvalid={!!errors.email} isRequired>
                    <FormLabel fontWeight="bold">Email</FormLabel>
                    <Input
                      type="email"
                      placeholder="Enter email"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('email', {
                        required: 'Email is required',
                        pattern: {
                          value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                          message: 'Invalid email address',
                        },
                      })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.email?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Phone Field */}
                  <FormControl isInvalid={!!errors.phone} isRequired>
                    <FormLabel fontWeight="bold">Phone</FormLabel>
                    <Input
                      type="tel"
                      placeholder="Enter phone number"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('phone', {
                        required: 'Phone number is required',
                      })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.phone?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* CPF Field */}
                  <FormControl isInvalid={!!errors.cpf} isRequired>
                    <FormLabel fontWeight="bold">CPF</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter CPF"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('cpf', { required: 'CPF is required' })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.cpf?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Password Field */}
                  <FormControl isInvalid={!!errors.password} isRequired>
                    <FormLabel fontWeight="bold">Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Enter password"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('password', {
                        required: 'Password is required',
                      })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.password?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Confirm Password Field */}
                  <FormControl isInvalid={!!errors.confirmPassword} isRequired>
                    <FormLabel fontWeight="bold">Confirm Password</FormLabel>
                    <Input
                      type="password"
                      placeholder="Confirm password"
                      bg="gray.100"
                      fontWeight="bold"
                      {...register('confirmPassword', {
                        required: 'Confirm password is required',
                        validate: (value) =>
                          value === watch('password') ||
                          'Passwords do not match',
                      })}
                      _placeholder={{ fontWeight: 'medium' }}
                    />
                    <FormErrorMessage>
                      {errors.confirmPassword?.message as React.ReactNode}
                    </FormErrorMessage>
                  </FormControl>

                  {/* Register Button */}
                  <Button colorScheme="blue" width="full" mt={4} type="submit">
                    Register
                  </Button>
                </form>
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
