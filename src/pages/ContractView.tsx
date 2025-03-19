import React, { useState, useEffect } from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  HStack,
  GridItem,
  Grid,
} from '@chakra-ui/react'
import { useParams } from 'react-router-dom'
import ClauseForm from '../components/clause/clauseForm'
import { useAuth } from '../context/Authcontext'
import { ContractService } from '../services/contract'
import { getActionTypeLabel } from '../utils/actionType'
import { formatObjectEntries } from '../utils/formatObjectEntries'
import { useToast } from '@chakra-ui/react'
import ReviewForm from '../components/reviewForm'

const ContractView: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const { setLoading } = useAuth()
  const [contract, setContract] = useState<AutoExecutableContract>()
  const [openClauseModel, setOpenClauseModel] = useState(false)
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false)
  const toast = useToast()

  useEffect(() => {
    fetchContract()
  }, [id])

  const fetchContract = async () => {
    setLoading(true)
    if (id) {
      try {
        const response = await ContractService.GetContract(id)
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

  const navigateToClause = (clauseId: string) => {
    window.location.href = `/clause/view/${clauseId}`
  }

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
                <strong>Participants:</strong>{' '}
                {contract.participants
                  ? contract.participants
                      .map((participant) => participant.name)
                      .join(', ')
                  : 'No participants available'}
              </Text>
              <Text mt={2}>
                <strong>Owner:</strong> {contract.owner.name}
              </Text>

              {contract.data && (
                <Box mt={6} bg="orange.50" p={4} borderRadius="md">
                  <Heading as="h3" color="orange.400" size="md" mb={4}>
                    Contract Data
                  </Heading>
                  <VStack align="start" spacing={2}>
                    {formatObjectEntries(contract.data).map(
                      ({ key, value }) => (
                        <Text key={key}>
                          <strong>{key}:</strong>{' '}
                          {typeof value === 'string' &&
                          value.startsWith('{') ? (
                            <pre style={{ whiteSpace: 'pre-wrap' }}>
                              {value}
                            </pre>
                          ) : (
                            value
                          )}
                        </Text>
                      )
                    )}
                  </VStack>
                </Box>
              )}
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
            {contract && !contract.data?.review && (
              <Button
                size={'sm'}
                onClick={() => setIsReviewModalOpen(true)}
                colorScheme="blue"
              >
                Give Feedback
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
                  background="gray.100"
                  px={8}
                >
                  <Grid
                    templateColumns="repeat(6, 1fr)"
                    gap={6}
                    alignItems="center"
                  >
                    <GridItem>
                      <Text isTruncated overflow="hidden" whiteSpace="nowrap">
                        <strong>ID:</strong> {clause.id}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text isTruncated overflow="hidden" whiteSpace="nowrap">
                        <strong>Key:</strong> {clause['@key']}
                      </Text>
                    </GridItem>
                    <GridItem>
                      <Text isTruncated overflow="hidden" whiteSpace="nowrap">
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
                    <GridItem justifySelf="end">
                      <Button
                        size="sm"
                        colorScheme="blue"
                        onClick={() => navigateToClause(clause['@key'])}
                      >
                        View
                      </Button>
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
            fetchContract={fetchContract}
          />
        </Box>

        {contract && (
          <ReviewForm
            contractId={id as string}
            isOpen={isReviewModalOpen}
            onClose={() => setIsReviewModalOpen(false)}
            fetchContract={fetchContract}
          />
        )}
      </VStack>
    </Box>
  )
}

export default ContractView
