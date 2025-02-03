import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  Spinner,
  Flex,
  GridItem,
  Grid,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import ClauseForm from '../components/clause/clauseForm'
import { useAuth } from '../context/Authcontext'
import { ContractService } from '../services/contract'
import { getActionTypeLabel } from '../utils/actionType'

const ContractView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { setLoading } = useAuth()
  const [contract, setContract] = useState<AutoExecutableContract>()
  const [openClauseModel, setOpenClauseModel] = useState(false)

  useEffect(() => {
    const fetchContract = async () => {
      setLoading(true)
      if (id) {
        try {
          const response = await ContractService.GetContract(id)
          setContract(response.contract || null)
        } catch (error) {
          console.error('Error fetching contract:', error)
        }
      }
      setLoading(false)
    }

    fetchContract()
  }, [id])

  return (
    <Box p={10}>
      <VStack spacing={5} align="stretch">
        <Box p={5} shadow="md" borderWidth="1px">
          <Heading as="h2" size="lg">
            Contract Details
          </Heading>

          {contract ? (
            <>
              <Text mt={4}>
                <strong>Contract ID:</strong> {contract['@key']}
              </Text>
              <Text mt={2}>
                <strong>Contract Name:</strong> {contract.name}
              </Text>
              <Text mt={2}>
                <strong>Signature Date:</strong> {contract.signatureDate}
              </Text>
              <Text mt={2}>
                <strong>Last Updated:</strong> {contract['@lastUpdated']}
              </Text>
              <Text mt={2}>
                <strong>Participants:</strong>
                {contract.participants
                  ? contract.participants
                      .map((participant) => participant.name)
                      .join(', ')
                  : 'No participants available'}
              </Text>
              <Text mt={2}>
                <strong>Owner:</strong> {contract.owner.name}
              </Text>
            </>
          ) : (
            <Text mt={4}>Contract not found or an error occurred.</Text>
          )}

          <HStack spacing={4} pt={8} pb={2}>
            {contract && (
              <Button
                size={'sm'}
                onClick={() => setOpenClauseModel(true)}
                colorScheme="green"
              >
                Add Clause
              </Button>
            )}
          </HStack>
        </Box>
        <Box p={5}>
          <Heading as="h2" textAlign={'center'} size="lg">
            Clauses
          </Heading>
          {contract && contract.clauses && contract.clauses.length > 0 ? (
            <VStack spacing={3} mt={4}>
              {contract.clauses.map((clause, index) => (
                <Box
                  key={index}
                  p={4}
                  shadow="md"
                  borderWidth="1px"
                  width="100%"
                  borderRadius={8}
                  background="blue.100"
                >
                  <Grid templateColumns="repeat(4, 1fr)" gap={4}>
                    <GridItem>
                      <Text>
                        <strong>Clause ID:</strong> {clause.id}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text>
                        <strong>Type:</strong>{' '}
                        {getActionTypeLabel(clause.actionType)}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text>
                        <strong>Category:</strong> {clause.category}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text>
                        <strong>Finalized:</strong>{' '}
                        {clause.finalized ? 'Yes' : 'No'}
                      </Text>
                    </GridItem>
                  </Grid>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text textAlign={'center'} mt={4}>
              No clauses available
            </Text>
          )}
        </Box>

        <Box>
          <ClauseForm
            contract={contract}
            openClauseModel={openClauseModel}
            setOpenClauseModel={setOpenClauseModel}
          />
        </Box>
      </VStack>
    </Box>
  )
}

export default ContractView
