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
import Navbar from '../components/navbar'
import { useMutation } from '@tanstack/react-query'
import { UserService } from '../services/User'
import { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import React from 'react'
import { useAuth } from '../context/Authcontext'

const Login = () => {
  const navigate = useNavigate()
  const auth = useAuth()

  const gridTemplateColumns = useBreakpointValue({
    base: '1fr',
    md: '1fr 1fr',
  })

  const justifyForm = useBreakpointValue({
    base: 'center',
    md: 'start',
  })

  const toast = useToast()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const mutation = useMutation({
    mutationFn: UserService.loginUser,
    onSuccess: () => {
      toast({
        title: 'Login successful!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
      auth.login()
      navigate('/')
    },
    onError: (error: AxiosError) => {
      toast({
        title: 'Login failed.',
        description: error?.message || 'Something went wrong.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    },
  })

  const handleLogin = (formData: any) => {
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
              w={{ base: 'full', md: '450px' }}
            >
              <Heading mb={6} size="3xl" color="gray.600" textAlign="center">
                Login
              </Heading>
              <VStack
                spacing={4}
                as="form"
                onSubmit={handleSubmit(handleLogin)}
              >
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
                    {...register('username', {
                      required: 'Username is required',
                    })}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  <FormErrorMessage>
                    {errors.username?.message as React.ReactNode}
                  </FormErrorMessage>
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
                    {...register('password', {
                      required: 'Password is required',
                    })}
                    _placeholder={{ fontWeight: 'medium' }}
                  />
                  <FormErrorMessage>
                    {errors.password?.message as React.ReactNode}
                  </FormErrorMessage>
                </FormControl>

                {/* Login Button */}
                <Button colorScheme="blue" width="full" mt={4} type="submit">
                  Login
                </Button>
              </VStack>
            </Box>
          </GridItem>
        </Grid>
      </Center>
    </>
  )
}

export default Login
