import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Flex,
  Heading,
  List,
  ListItem,
  Text,
  VStack,
  useDisclosure,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useToast,
} from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import { DocumentService } from '../services/document'
import { useAuth } from '../context/Authcontext'
import { getTimeLeft } from '../utils/returnPendingTime'
import { useNavigate } from 'react-router-dom'

const PendingSignatures: React.FC = () => {
  const [pendingSignatures, setPendingSignatures] = useState<Document[] | null>(
    null
  )
  const toast = useToast()
  const { setLoading } = useAuth()
  const navigate = useNavigate()

  const {
    data,
    isLoading: queryLoading,
    error,
  } = useQuery({
    queryKey: ['PendingSignatures'],
    queryFn: () => DocumentService.getPendingSignaturesDoc(0),
  })

  useEffect(() => {
    setLoading(true)
    if (!queryLoading) {
      if (error) {
        toast({
          title: 'An error occurred.',
          description: 'Unable to fetch pending signatures',
          status: 'error',
          duration: 9000,
          isClosable: true,
        })
        setLoading(false)
      }
      if (data && data['documents']) {
        setPendingSignatures(data['documents'])
        setLoading(false)
      }
      setLoading(false)
    }
  }, [error, data, queryLoading])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  const handleClick = (doc: Document) => {
    setSelectedDoc(doc)
    onOpen()
  }

  const navigateToSigning = (doc: Document) => {
    navigate('/document/sign', { state: { document: doc } })
  }

  return (
    <Flex>
      {/* Pending Signatures List */}
      <Box w="100%" p={6} px={14}>
        <Box mt={10}>
          <Heading size="lg" color="gray.700" mb={10}>
            Pending Signatures
          </Heading>
          <List pl={8} spacing={6} w="60%">
            {pendingSignatures &&
              pendingSignatures.map((doc) => (
                <ListItem
                  key={doc['@key']}
                  borderRadius="md"
                  bg="white"
                  p={6}
                  py={4}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <VStack align="flex-start">
                    <Heading
                      fontWeight="bold"
                      size="md"
                      color="gray.500"
                      mb={6}
                    >
                      {doc.name}
                    </Heading>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Flex>
                        <Text fontWeight="bold">
                          Requested by:
                          <Text
                            as="span"
                            color="green.500"
                            bg="green.100"
                            px={2}
                            py={1}
                            borderRadius="md"
                            mx={3}
                          >
                            {doc.owner.name}
                          </Text>
                        </Text>
                        <Text fontWeight="bold">
                          Due in:
                          <Text
                            as="span"
                            color="orange.500"
                            bg="orange.100"
                            px={2}
                            py={1}
                            borderRadius="md"
                            fontWeight="bold"
                            ml={3}
                          >
                            {getTimeLeft(doc.timeout)}
                          </Text>
                        </Text>
                      </Flex>
                      <Button
                        onClick={() => handleClick(doc)}
                        variant="outline"
                        size="sm"
                      >
                        View Details
                      </Button>
                    </Flex>
                  </VStack>
                </ListItem>
              ))}
          </List>
        </Box>
      </Box>

      {/* Sidebar Drawer */}
      <Drawer placement="right" onClose={onClose} isOpen={isOpen} size="lg">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Pending Signatures Document
          </DrawerHeader>

          <DrawerBody mt={10}>
            <VStack align="flex-start" spacing={8}>
              <Text>
                <strong>Name:</strong> {selectedDoc?.name}
              </Text>
              <Text>
                <strong>Requested By:</strong> {selectedDoc?.owner.name}
              </Text>
              <Text>
                <strong>Required Signatures: </strong>
                {selectedDoc?.requiredSignatures
                  .map((sign) => sign.name)
                  .join(', ')}
              </Text>
              <Text>
                <strong>Due in:</strong> {getTimeLeft(selectedDoc?.timeout)}
              </Text>
            </VStack>
          </DrawerBody>

          <DrawerFooter borderTopWidth="1px">
            <Button variant="outline" size="md" mr={3} onClick={onClose}>
              Close
            </Button>
            {getTimeLeft(selectedDoc?.timeout) != 'expired' && (
              <Button
                size="md"
                colorScheme="blue"
                onClick={() => {
                  selectedDoc && navigateToSigning(selectedDoc)
                }}
              >
                Proceed with Signing
              </Button>
            )}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default PendingSignatures
