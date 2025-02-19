import { useState, useEffect } from 'react'
import {
  Box,
  Button,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Image,
  VStack,
  Heading,
  useToast,
} from '@chakra-ui/react'
import noDataImage from '../assets/Contract/no_data.jpg'
import CreateContractForm from '../components/createContractForm'
import { ContractService } from '../services/contract'
import { useAuth } from '../context/Authcontext'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { format } from 'date-fns'
import AddParticipantForm from '../components/inviteParticipants'

const Contract = () => {
  const [isFormOpen, setIsFormOpen] = useState(false)
  const toast = useToast()
  const { setLoading } = useAuth()
  const [userCreatedContracts, setUserCreatedContracts] = useState<
    AutoExecutableContract[]
  >([])
  const [userParticipatedContracts, setUserParticipatedContracts] = useState<
    AutoExecutableContract[]
  >([])
  const [isParticipantFormOpen, setIsParticipantFormOpen] = useState(false)

  const handleAddParticipants = async (
    newParticipants: UserKey[],
    contractId: string
  ) => {
    setLoading(true)
    const req = {
      participants: newParticipants,
      autoExecutableContract: {
        '@assetType': 'autoExecutableContract',
        '@key': contractId,
      },
    }

    const response = await ContractService.AddParticipants(req)

    if (response) {
      toast({
        title: 'Invite sent',
        description: 'Invite sent successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Error',
        description: 'An error occurred while sending the invite',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
    setLoading(false)
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['UserContracts'],
    queryFn: () => fetchUserContracts(),
  })

  const queryClient = useQueryClient()

  const fetchUserContracts = async () => {
    const response = await ContractService.getUserContracts()
    return response
  }

  useEffect(() => {
    setLoading(isLoading)

    if (error) {
      toast({
        title: 'Error',
        description: 'An error occurred while fetching the contracts',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }

    if (data && data.userCreatedContracts) {
      setUserCreatedContracts(data.userCreatedContracts)
    }
    if (data && data.participantContract) {
      setUserParticipatedContracts(data.participantContract)
    }
  }, [isLoading, error, data, toast])

  const handleCreateContract = async (data: {
    name: string
    signatureDate: string
  }) => {
    setLoading(true)
    const response = await ContractService.CreateContract(data)
    queryClient.invalidateQueries({ queryKey: ['UserContracts'] })
    if (response) {
      toast({
        title: 'Contract Created',
        description: 'Contract created successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } else {
      toast({
        title: 'Error',
        description: 'An error occurred while creating the contract',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const navigateToContract = (contractId: string) => {
    window.location.href = `/contract/view/${contractId}`
  }

  return (
    <Box mx={20}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        my={14}
      >
        <Heading size="xl" fontWeight="bold" color={'gray.700'}>
          Dashboard
        </Heading>
        <Button
          variant={'outline'}
          size={'sm'}
          colorScheme="blue"
          onClick={() => setIsFormOpen(true)}
        >
          Create Contract
        </Button>
      </Box>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>All Contracts</Tab>
          <Tab>Participating</Tab>
          <Tab>In Progress</Tab>
          <Tab>Completed</Tab>
          <Tab>Cancelled</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {userCreatedContracts.length === 0 ? (
              <VStack spacing={8} mt={14}>
                <Image src={noDataImage} alt="No Contracts" boxSize="200px" />
                <Text>No contracts found.</Text>
                <Button
                  colorScheme="blue"
                  size={'sm'}
                  onClick={() => setIsFormOpen(true)}
                >
                  Create Contract
                </Button>
              </VStack>
            ) : (
              <>
                <Table variant="simple">
                  <Thead bg={'gray.100'}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Signature Date</Th>
                      <Th>Owner</Th>
                      <Th>Last Updated</Th>
                      <Th>Participants</Th>
                      <Th textAlign={'center'}>Actions</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userCreatedContracts.map((contract, index) => (
                      <Tr key={index}>
                        <Td>{contract.name}</Td>
                        <Td>
                          {contract.signatureDate
                            ? format(
                                new Date(contract.signatureDate),
                                'dd MMM, yyyy'
                              )
                            : '-'}
                        </Td>
                        <Td>{contract.owner.name}</Td>
                        <Td>
                          {contract['@lastUpdated']
                            ? format(
                                new Date(contract['@lastUpdated']),
                                'dd MMM, yyyy'
                              )
                            : '-'}
                        </Td>
                        <Td>
                          {contract.participants &&
                          contract.participants.length > 0
                            ? contract.participants
                                .map((participant, _) => participant.name)
                                .join(', ')
                            : '-'}
                        </Td>
                        <Td>
                          <Button
                            size="sm"
                            colorScheme="teal"
                            mr={2}
                            onClick={() => setIsParticipantFormOpen(true)}
                          >
                            Add Participants
                          </Button>
                          <Button
                            onClick={() => navigateToContract(contract['@key'])}
                            size="sm"
                            colorScheme="teal"
                            mr={2}
                          >
                            View
                          </Button>
                          <AddParticipantForm
                            isOpen={isParticipantFormOpen}
                            onClose={() => setIsParticipantFormOpen(false)}
                            onAddParticipant={handleAddParticipants}
                            contractId={contract['@key']}
                          />
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </TabPanel>

          <TabPanel>
            {userParticipatedContracts.length === 0 ? (
              <VStack spacing={8} mt={14}>
                <Image src={noDataImage} alt="No Contracts" boxSize="200px" />
                <Text>No contracts found.</Text>
              </VStack>
            ) : (
              <>
                <Table variant="simple">
                  <Thead bg={'gray.100'}>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Signature Date</Th>
                      <Th>Owner</Th>
                      <Th>Last Updated</Th>
                      <Th>Participants</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {userParticipatedContracts.map((contract, index) => (
                      <Tr key={index}>
                        <Td>{contract.name}</Td>
                        <Td>
                          {contract.signatureDate
                            ? format(
                                new Date(contract.signatureDate),
                                'dd MMM, yyyy'
                              )
                            : '-'}
                        </Td>
                        <Td>{contract.owner.name}</Td>
                        <Td>
                          {contract['@lastUpdated']
                            ? format(
                                new Date(contract['@lastUpdated']),
                                'dd MMM, yyyy'
                              )
                            : '-'}
                        </Td>
                        <Td>
                          {contract.participants &&
                          contract.participants.length > 0
                            ? contract.participants
                                .map((participant, _) => participant.name)
                                .join(', ')
                            : '-'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            )}
          </TabPanel>
          <TabPanel>
            <VStack spacing={8} mt={14}>
              <Image src={noDataImage} alt="No Contracts" boxSize="200px" />
              <Text>No contracts in progress.</Text>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={8} mt={14}>
              <Image src={noDataImage} alt="No Contracts" boxSize="200px" />
              <Text>No contracts completed yet.</Text>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={8} mt={14}>
              <Image src={noDataImage} alt="No Contracts" boxSize="200px" />
              <Text>No contracts canceled.</Text>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <>
        {isFormOpen && (
          <CreateContractForm
            onClose={() => setIsFormOpen(false)}
            onSubmit={handleCreateContract}
          />
        )}
      </>
    </Box>
  )
}

export default Contract
