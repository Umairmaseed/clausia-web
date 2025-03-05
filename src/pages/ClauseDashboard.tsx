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
} from '@chakra-ui/react'
import { ActionType, getActionTypeLabel } from '../utils/actionType'
import { useAuth } from '../context/Authcontext'
import DateTimeInput from '../components/clause/dateAndTimeInputs'
import { ClauseService } from '../services/clause'

const ClauseDashboard = () => {
  const { id } = useParams<{ id: string }>()
  const [clause, setClause] = useState<Clause | null>(null)
  const { setLoading } = useAuth()
  const toast = useToast()

  const renderFormattedText = (data: Record<string, any>) => {
    return Object.entries(data)
      .filter(([key]) => key !== '@assetType')
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([a-z])([A-Z])/g, '$1 $2')
          .replace(/^./, (str) => str.toUpperCase())

        return (
          <Text key={key}>
            <strong>{formattedKey}:</strong> {String(value)}
          </Text>
        )
      })
  }

  useEffect(() => {
    fetchClause()
  }, [id])

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

  const hasInput = clause.input && Object.keys(clause.input).length > 0
  const needsInput =
    clause.actionType === ActionType.CheckDateInterval && !hasInput

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
        {clause.dependencies && clause.dependencies.length > 0 && (
          <Box p={4} bg="gray.50" borderRadius="md">
            <Text>
              <strong>Dependencies:</strong> {clause.dependencies.join(', ')}
            </Text>
          </Box>
        )}
        {needsInput && clause.actionType === ActionType.CheckDateInterval && (
          <DateTimeInput
            clause={clause}
            onSubmitSuccess={() => fetchClause()}
          />
        )}
      </VStack>
    </Box>
  )
}

export default ClauseDashboard
