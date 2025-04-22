import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  Box,
  Grid,
  GridItem,
  Text,
  VStack,
  Divider,
  Tag,
  useToast,
  HStack,
} from '@chakra-ui/react'
import { ActionType, getActionTypeLabel } from '../utils/actionType'
import { useAuth } from '../context/Authcontext'
import DateTimeInput from '../components/clause/dateAndTimeInputs'
import { ClauseService } from '../services/clause'
import { formatObjectEntries } from '../utils/formatObjectEntries'
import GetCreditInput from '../components/clause/getCreditInputs'
import MakePaymentInputs from '../components/clause/makePaymentInputs'
import GetDeductionInput from '../components/clause/getDeductionInputs'
import { ContractService } from '../services/contract'

const ClauseDashboard = () => {
  const { id } = useParams<{ id: string }>()
  const queryParams = new URLSearchParams(window.location.search)
  const contractId = queryParams.get('contract')
  const [contract, setContract] = useState<AutoExecutableContract>()
  const [clause, setClause] = useState<Clause | null>(null)
  const { setLoading } = useAuth()
  const toast = useToast()

  const renderFormattedText = (data: Record<string, any>) => {
    return formatObjectEntries(data).map(({ key, value }) => (
      <Text key={key}>
        <strong>{key}:</strong> {value}
      </Text>
    ))
  }

  useEffect(() => {
    fetchClause()
    fetchContract()
  }, [id])

  const fetchContract = async () => {
    setLoading(true)
    if (contractId) {
      try {
        const response = await ContractService.GetContract(contractId)
        setContract(response.contract || null)
      } catch (error) {
        toast({
          title: 'Error fetching contract',
          description:
            'An error occurred while fetching the contract. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
    }
    setLoading(false)
  }

  const fetchClause = async () => {
    setLoading(true)
    if (id) {
      try {
        const response = await ClauseService.GetClause(id)
        setClause(response.clause || null)
      } catch (error) {
        toast({
          title: 'Error fetching clause',
          description:
            'An error occurred while fetching the clause. Please try again later.',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
      setLoading(false)
    }
  }

  if (!clause) return null
  if (!contract) return null

  const hasInput = clause.input && Object.keys(clause.input).length > 0

  return (
    <Box
      p={6}
      maxW="1000px"
      mx="auto"
      bg="white"
      shadow="lg"
      mt={8}
      mb={8}
      borderRadius="md"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={4} textAlign="center">
        Clause Details
      </Text>
      <Divider mb={4} />
      <VStack spacing={4} align="stretch">
        <Grid
          templateColumns={{ base: '1fr', md: '1fr 1fr 1fr' }}
          gap={4}
          p={4}
        >
          <GridItem>
            <Text>
              <strong>Action Type:</strong>{' '}
              {getActionTypeLabel(clause.actionType)}
            </Text>
          </GridItem>
          <GridItem>
            <Text>
              <strong>Executable:</strong>{' '}
              <Tag colorScheme={clause.executable ? 'green' : 'red'}>
                {clause.executable ? 'Yes' : 'No'}
              </Tag>
            </Text>
          </GridItem>
          <GridItem>
            <Text>
              <strong>Finalized:</strong>{' '}
              <Tag colorScheme={clause.finalized ? 'green' : 'red'}>
                {clause.finalized ? 'Yes' : 'No'}
              </Tag>
            </Text>
          </GridItem>
        </Grid>
        <Box p={4} bg="orange.50" borderRadius="md">
          <VStack spacing={4} align="stretch">
            <Text>
              <strong>ID:</strong> {clause.id}
            </Text>
            {clause.description && (
              <Text>
                <strong>Description:</strong> {clause.description}
              </Text>
            )}
            {clause.category && (
              <Text>
                <strong>Category:</strong> {clause.category}
              </Text>
            )}
          </VStack>
        </Box>
        {clause.parameters && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" color="orange.400" mb={4}>
              Parameters
            </Text>
            <VStack spacing={2} align="stretch">
              {renderFormattedText(clause.parameters)}
            </VStack>
          </Box>
        )}
        {clause.input && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" color="orange.400" mb={4}>
              Inputs
            </Text>
            <VStack spacing={2} align="stretch">
              {renderFormattedText(clause.input)}
            </VStack>
          </Box>
        )}
        {clause.dependencies && clause.dependencies.length > 0 && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" color="orange.400" mb={4}>
              Dependencies
            </Text>
            <VStack spacing={2} align="stretch">
              {clause.dependencies.map((dependency) => (
                <HStack key={dependency.id} spacing={2}>
                  <Text>
                    <strong>Clause ID:</strong> {dependency.id}
                  </Text>
                  <Text>
                    <strong> Finalized:</strong>{' '}
                    {dependency.finalized ? 'Yes' : 'No'}
                  </Text>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
        {clause.result && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text fontWeight="bold" color="green.400" mb={4}>
              Results
            </Text>
            <VStack spacing={2} align="stretch">
              {renderFormattedText(clause.result)}
            </VStack>
          </Box>
        )}
        {!hasInput &&
          !clause.finalized &&
          clause.actionType === ActionType.CheckDateInterval && (
            <DateTimeInput
              clause={clause}
              onSubmitSuccess={() => fetchClause()}
            />
          )}
        {!hasInput &&
          !clause.finalized &&
          clause.actionType === ActionType.GetCredit && (
            <GetCreditInput
              clause={clause}
              onSubmitSuccess={() => fetchClause()}
            />
          )}
        {!hasInput &&
          !clause.finalized &&
          clause.actionType === ActionType.GetDeduction && (
            <GetDeductionInput
              clause={clause}
              onSubmitSuccess={() => fetchClause()}
              contract={contract}
            />
          )}
        {!clause.finalized && clause.actionType === ActionType.Payment && (
          <MakePaymentInputs
            clause={clause}
            onSubmitSuccess={() => fetchClause()}
          />
        )}
      </VStack>
    </Box>
  )
}

export default ClauseDashboard
