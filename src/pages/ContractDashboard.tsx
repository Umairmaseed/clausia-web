import React, {useState} from 'react';
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
} from '@chakra-ui/react';
import noDataImage from '../assets/Contract/no_data.jpg'; 
import CreateContractForm from '../components/createContractForm';

const Contract = () => {
    const [isFormOpen, setIsFormOpen] = useState(false);

    const handleCreateContract = (data: { name: string; signatureDate: string }) => {
      console.log('Contract Data:', data);
      // Call API service here
    };
    
  const contracts = []; // Example: Use state or props to manage contract data

  return (
    <Box mx={20}>
      <Box display="flex" justifyContent="space-between" alignItems="center" my={14}>
        <Heading size="xl" fontWeight="bold" color={'gray.700'}>
         Dashboard
        </Heading>
        <Button variant={'outline'} size={'sm'} colorScheme="blue" onClick={() => setIsFormOpen(true)}>
          Create Contract
        </Button>
      </Box>

      <Tabs variant="enclosed">
        <TabList>
          <Tab>All Contracts</Tab>
          <Tab>In Progress</Tab>
          <Tab>Completed</Tab>
          <Tab>Cancelled</Tab>
        </TabList>

        <TabPanels>
          <TabPanel>
            {contracts.length === 0 ? (
              <VStack spacing={8} mt={14}>
                <Image src={noDataImage} alt="No Contracts" boxSize="200px" />
                <Text>No contracts found.</Text>
                <Button colorScheme="blue" size={'sm'} onClick={() => setIsFormOpen(true)}>
                  Create Contract
                </Button>
              </VStack>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>ID</Th>
                    <Th>Name</Th>
                    <Th>Status</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {/* Example: Replace with dynamic rows */}
                  <Tr>
                    <Td>1</Td>
                    <Td>Sample Contract</Td>
                    <Td>In Progress</Td>
                    <Td>
                      <Button size="sm" colorScheme="teal" mr={2}>
                        View
                      </Button>
                      <Button size="sm" colorScheme="red">
                        Cancel
                      </Button>
                    </Td>
                  </Tr>
                </Tbody>
              </Table>
            )}
          </TabPanel>

          {/* Repeat similar structure for other tabs */}
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
        <CreateContractForm onClose={() => setIsFormOpen(false)} onSubmit={handleCreateContract} />
      )}
    </>
    </Box>
  );
};

export default Contract;