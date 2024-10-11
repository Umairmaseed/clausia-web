import {
  Box,
  Center,
  Flex,
  Heading,
  HStack,
  Icon,
  VStack,
  Text,
  Button,
  List,
  ListItem,
  ListIcon,
} from '@chakra-ui/react'
import { IoSettingsOutline } from 'react-icons/io5'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { GoHome } from 'react-icons/go'
import { useState } from 'react'
import Navbar from '../components/navbar'
import { useNavigate } from 'react-router-dom'

const Home = () => {
  const [activeTab, setActiveTab] = useState('personal')

  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <Flex minH="100vh" pt={20} pl={20}>
        {/* Sidebar */}
        <Box
          w="15%"
          p={4}
          pt={10}
          my={10}
          borderRightWidth="1px"
          borderRightStyle="solid"
          borderRightColor="gray.200"
          justifyContent={'center'}
        >
          <VStack align="start" spacing={4}>
            <HStack
              onClick={() => setActiveTab('personal')}
              cursor="pointer"
              spacing={5}
              p={2}
              w="100%"
              borderRightRadius="md"
              borderLeft={
                activeTab === 'personal'
                  ? '4px solid orange'
                  : '4px solid white'
              }
              bg={activeTab === 'personal' ? 'gray.100' : 'transparent'}
              _hover={{ bg: 'gray.100' }}
            >
              <Icon
                as={GoHome}
                boxSize={5}
                color={activeTab === 'personal' ? 'orange' : 'gray.600'}
              />
              <Text fontSize={['sm', 'md']} fontWeight="medium">
                Overview
              </Text>
            </HStack>
            <HStack
              onClick={() => setActiveTab('settings')}
              cursor="pointer"
              spacing={5}
              p={2}
              w="100%"
              borderRightRadius="md"
              borderLeft={
                activeTab === 'settings'
                  ? '4px solid orange'
                  : '4px solid white'
              }
              bg={activeTab === 'settings' ? 'gray.100' : 'transparent'}
              _hover={{ bg: 'gray.100' }}
            >
              <Icon
                as={IoSettingsOutline}
                boxSize={5}
                color={activeTab === 'settings' ? 'orange' : 'gray.600'}
              />
              <Text fontSize={['sm', 'md']} fontWeight="medium">
                Settings
              </Text>
            </HStack>
          </VStack>
        </Box>

        {/* Main Content */}
        {activeTab === 'personal' && (
          <Box w="85%" p={6} px={20}>
            {/* Heading */}
            <Heading
              mt={10}
              mb={2}
              fontSize={['sm', 'md', 'xx-large']}
              color="gray.700"
            >
              Welcome to Your Dashboard
            </Heading>
            <Text fontSize={['xs', 'sm']} color="gray.600">
              Here you can manage your documents, contracts and much more.
            </Text>

            {/* Cards */}
            <Flex
              //   justify="space-between"
              align="center"
              gap={10}
              pt={10}
              pb={10}
              borderBottomWidth="1px"
              borderRightStyle="solid"
              borderRightColor="gray.200"
            >
              <Box
                w="25%"
                h="auto"
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                px={8}
                py={4}
                textAlign="center"
              >
                <Heading size="lg" mb={4} color="gray.600">
                  Documents
                </Heading>
                <List spacing={1} mb={4} textAlign="left" fontSize="sm">
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.400" />
                    Create or View Document
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.400" />
                    Sign Document
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.400" />
                    Manage Document
                  </ListItem>
                </List>
                <Button
                  colorScheme="orange"
                  size="sm"
                  onClick={() => navigate('/document')}
                >
                  Explore
                </Button>
              </Box>

              <Box
                w="25%"
                h="auto"
                bg="white"
                borderRadius="xl"
                borderWidth="1px"
                px={8}
                py={4}
                textAlign="center"
              >
                <Heading size="lg" mb={4} color="gray.600">
                  Contracts
                </Heading>
                <List spacing={1} mb={4} textAlign="left" fontSize="sm">
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.400" />
                    Create or View Contract
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.400" />
                    Share Contract
                  </ListItem>
                  <ListItem>
                    <ListIcon as={CheckCircleIcon} color="green.400" />
                    Manage Contract
                  </ListItem>
                </List>
                <Button
                  colorScheme="orange"
                  size="sm"
                  onClick={() => {
                    navigate('/contract')
                  }}
                >
                  Explore
                </Button>
              </Box>
            </Flex>
          </Box>
        )}
      </Flex>
    </>
  )
}

export default Home
