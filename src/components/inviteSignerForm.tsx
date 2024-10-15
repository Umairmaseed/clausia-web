import React, { useState } from 'react'
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Button,
  List,
  ListItem,
  IconButton,
  VStack,
  HStack,
  CloseButton,
  useToast,
  Flex,
} from '@chakra-ui/react'
import { AddIcon } from '@chakra-ui/icons'
import { useAuth } from '../context/Authcontext'
import { UserService } from '../services/User'

interface SignerFormProps {
  submitSigners: (signers: string[]) => void
}

const InviteSignerForm: React.FC<SignerFormProps> = (SignerForm) => {
  const toast = useToast()
  const [usernameInput, setUsernameInput] = useState<string>('')
  const [emailInput, setEmailInput] = useState<string>('')
  const [idInput, setIdInput] = useState<string>('')

  const [usernames, setUsernames] = useState<string[]>([])
  const [emails, setEmails] = useState<string[]>([])
  const [ids, setIds] = useState<string[]>([])
  const [signerKeys, setSignerKeys] = useState<string[]>([])

  const { setLoading } = useAuth()

  const handleAddUsername = async () => {
    if (usernameInput) {
      setLoading(true)

      try {
        const response = await UserService.confirmUser({
          userName: usernameInput,
        })
        setUsernames([...usernames, usernameInput])
        setSignerKeys([...signerKeys, response?.userId])
        toast({
          title: 'User added successfully',
          status: 'success',
        })
        setUsernameInput('')
      } catch (error) {
        toast({
          title: 'User not found',
          status: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddEmail = async () => {
    if (emailInput) {
      setLoading(true)

      try {
        const response = await UserService.confirmUser({ email: emailInput })
        setEmails([...emails, emailInput])
        setSignerKeys([...signerKeys, response?.userId])

        toast({
          title: 'User added successfully',
          status: 'success',
        })
        setEmailInput('')
      } catch (error) {
        toast({
          title: 'User not found',
          status: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  const handleAddId = async () => {
    if (idInput) {
      setLoading(true)
      try {
        const response = await UserService.confirmUser({ id: idInput })
        setIds([...ids, idInput])
        setSignerKeys([...signerKeys, response?.userId])

        toast({
          title: 'User added successfully',
          status: 'success',
        })
        setIdInput('')
      } catch (error) {
        toast({
          title: 'User not found',
          status: 'error',
        })
      } finally {
        setLoading(false)
      }
    }
  }

  // Handlers to remove items from the respective lists
  const handleRemoveUsername = (index: number) => {
    setUsernames(usernames.filter((_, i) => i !== index))
  }

  const handleRemoveEmail = (index: number) => {
    setEmails(emails.filter((_, i) => i !== index))
  }

  const handleRemoveId = (index: number) => {
    setIds(ids.filter((_, i) => i !== index))
  }

  return (
    <Box p={4} maxW="80%" mx="auto">
      <Tabs isFitted variant="enclosed">
        <TabList mb="1em">
          <Tab
            _selected={{
              color: 'green.500',
              bg: 'green.50',
              fontWeight: 'bold',
            }}
            _hover={{
              color: 'green.500',
              fontWeight: 'bold',
            }}
          >
            Invite by Username
          </Tab>
          <Tab
            _selected={{
              color: 'green.500',
              bg: 'green.50',
              fontWeight: 'bold',
            }}
            _hover={{
              color: 'green.500',
              fontWeight: 'bold',
            }}
          >
            Invite by Email
          </Tab>
          <Tab
            _selected={{
              color: 'green.500',
              bg: 'green.50',
              fontWeight: 'bold',
            }}
            _hover={{
              color: 'green.500',
              fontWeight: 'bold',
            }}
          >
            Invite by ID
          </Tab>
        </TabList>

        <TabPanels>
          {/* Username Tab */}
          <TabPanel>
            <VStack spacing={4}>
              <HStack>
                <Input
                  placeholder="Enter username"
                  value={usernameInput}
                  onChange={(e) => setUsernameInput(e.target.value)}
                />
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Add Username"
                  onClick={handleAddUsername}
                />
              </HStack>

              {/* List of Added Usernames */}
              <List spacing={3}>
                {usernames.map((username, index) => (
                  <ListItem key={index}>
                    <HStack justify="space-between">
                      <Box>{username}</Box>
                      <CloseButton
                        onClick={() => handleRemoveUsername(index)}
                      />
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </TabPanel>

          {/* Email Tab */}
          <TabPanel>
            <VStack spacing={4}>
              <HStack>
                <Input
                  placeholder="Enter email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                />
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Add Email"
                  onClick={handleAddEmail}
                />
              </HStack>

              {/* List of Added Emails */}
              <List spacing={3}>
                {emails.map((email, index) => (
                  <ListItem key={index}>
                    <HStack justify="space-between">
                      <Box>{email}</Box>
                      <CloseButton onClick={() => handleRemoveEmail(index)} />
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </TabPanel>

          {/* ID Tab */}
          <TabPanel>
            <VStack spacing={4}>
              <HStack>
                <Input
                  placeholder="Enter ID"
                  value={idInput}
                  onChange={(e) => setIdInput(e.target.value)}
                />
                <IconButton
                  icon={<AddIcon />}
                  aria-label="Add ID"
                  onClick={handleAddId}
                />
              </HStack>

              {/* List of Added IDs */}
              <List spacing={3}>
                {ids.map((id, index) => (
                  <ListItem key={index}>
                    <HStack justify="space-between">
                      <Box>{id}</Box>
                      <CloseButton onClick={() => handleRemoveId(index)} />
                    </HStack>
                  </ListItem>
                ))}
              </List>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>

      {/* Submit Button and Next Button */}
      {signerKeys.length !== 0 && (
        <Button
          colorScheme="blue"
          mt={4}
          onClick={() => SignerForm.submitSigners(signerKeys)}
        >
          Next
        </Button>
      )}
    </Box>
  )
}

export default InviteSignerForm
