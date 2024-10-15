import {
  Box,
  Flex,
  Heading,
  HStack,
  Button,
  Icon,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  MenuGroup,
  Text,
} from '@chakra-ui/react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { useAuth } from '../context/Authcontext'
import { FaRegBell } from 'react-icons/fa'
import { FcDocument, FcSignature } from 'react-icons/fc'
import { BsGrid3X3Gap } from 'react-icons/bs'

const Navbar = () => {
  const { isLoggedIn, user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [isLoginPage, setIsLoginPage] = useState(false)

  useEffect(() => {
    setIsLoginPage(location.pathname === '/login')
  }, [location.pathname])

  return (
    <Box bg="white" boxShadow="md" position="sticky">
      <Flex
        align="center"
        justify="space-between"
        p={4}
        minW="100vw"
        mx="auto"
        px={10}
      >
        <Heading as="h1" size="md" mr={4}>
          Goprocess
        </Heading>

        {isLoggedIn ?  (
          <HStack spacing={7}>
            <Menu>
              <MenuButton
                as={Box}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="gray.600"
                _hover={{ cursor: 'pointer', color: 'orange.500' }}
              >
                <Icon as={FaRegBell} boxSize={5} />
              </MenuButton>
            </Menu>

            <Menu>
              <MenuButton
                as={Box}
                borderRadius="full"
                display="flex"
                alignItems="center"
                justifyContent="center"
                color="gray.600"
                _hover={{ cursor: 'pointer', color: 'orange.500' }}
              >
                <Icon as={BsGrid3X3Gap} boxSize={5} />
              </MenuButton>
              <MenuList>
                <Flex justifyContent="space-around" px={4}>
                  <MenuItem
                    display="flex"
                    w={'50%'}
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    onClick={() => {
                      navigate('/document')
                    }}
                  >
                    <Icon as={FcSignature} boxSize={6} />
                    <Text fontSize="sm">Document</Text>
                  </MenuItem>
                  <MenuItem
                    display="flex"
                    w={'50%'}
                    flexDirection="column"
                    alignItems="center"
                    textAlign="center"
                    onClick={() => {
                      navigate('/contract')
                    }}
                  >
                    <Icon as={FcDocument} boxSize={6} />
                    <Text fontSize="sm">Contract</Text>
                  </MenuItem>
                </Flex>
              </MenuList>
            </Menu>

            {/* Circle icon with dropdown */}
            <Menu>
              <MenuButton
                as={Box}
                borderRadius="full"
                boxSize={10}
                bgGradient="linear(to-br, orange.100, yellow.200, teal.100)"
                display="flex"
                alignItems="center"
                justifyContent="center"
                _hover={{ cursor: 'pointer' }}
              ></MenuButton>
              <MenuList background={'white'}>
                <MenuGroup>
                  <Text
                    fontWeight="normal"
                    color="gray.400"
                    fontSize="sm"
                    textAlign={'center'}
                    my={2}
                  >
                    {user?.email}
                  </Text>
                  <MenuItem onClick={() => navigate('/dashboard')}>
                    Dashboard
                  </MenuItem>
                  <MenuItem>Settings</MenuItem>
                </MenuGroup>
                <MenuDivider />
                <MenuItem>Theme</MenuItem>
                <MenuDivider />
                <MenuItem onClick={() => logout()}>Logout</MenuItem>
                <MenuDivider />
                <Flex justifyContent="center">
                  <Button colorScheme="orange" w="60%" size={'sm'}>
                    Upgrade Plan
                  </Button>
                </Flex>
              </MenuList>
            </Menu>
          </HStack>
        ):
        (
          <HStack spacing={4}>
            {/* Common Links */}
            <Button
              variant="link"
              color="black"
              fontSize="sm"
              display="block"
              p={2}
              _hover={{
                bg: 'gray.100',
                borderRadius: 'md',
                outline: 'none',
              }}
              _focus={{ outline: 'none' }}
            >
              Pricing
            </Button>
            <Button
              variant="link"
              color="black"
              fontSize="sm"
              display="block"
              p={2}
              _hover={{
                bg: 'gray.100',
                borderRadius: 'md',
                outline: 'none',
              }}
              _focus={{ outline: 'none' }}
            >
              Contact
            </Button>
            <Button
              colorScheme="orange"
              variant="outline"
              fontSize="sm"
              bg="orange.25"
              p={2}
              h={8}
              onClick={() => {
                navigate(isLoginPage ? '/register' : '/login')
              }}
            >
              {isLoginPage ? 'Register' : 'Login'}
            </Button>
          </HStack>
        ) 
         }
      </Flex>
    </Box>
  )
}

export default Navbar
