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

const PendingSignatures: React.FC = () => {
  const [pendingSignatures, setPendingSignatures] = useState<Document[] | null>(
    null
  )
  const toast = useToast()
  const { setLoading } = useAuth()

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
  }, [error, data, queryLoading])

  const { isOpen, onOpen, onClose } = useDisclosure()
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null)

  const handleClick = (doc: Document) => {
    setSelectedDoc(doc)
    onOpen()
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
                  p={8}
                  py={4}
                  border="1px solid"
                  borderColor="gray.200"
                >
                  <VStack align="flex-start">
                    <Heading
                      fontWeight="bold"
                      size="md"
                      color="orange.400"
                      mb={6}
                    >
                      {doc.name}
                    </Heading>
                    <Flex
                      alignItems="center"
                      justifyContent="space-between"
                      w="100%"
                    >
                      <Text>
                        Requested by:
                        <Text
                          as="span"
                          color="green.500"
                          bg="green.100"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontWeight="bold"
                          ml={3}
                        >
                          {doc.owner.name}
                        </Text>
                      </Text>
                      <Text>
                        Due in:
                        <Text
                          as="span"
                          color="gray.500"
                          bg="gray.100"
                          px={2}
                          py={1}
                          borderRadius="md"
                          fontWeight="bold"
                          ml={3}
                        >
                          {getTimeLeft(doc.timeout)}
                        </Text>
                      </Text>
                      <Button onClick={() => handleClick(doc)} size="sm">
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
            {selectedDoc?.title || 'Document Details'}
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
            <Button variant="outline" size='md' mr={3} onClick={onClose}>
              Close
            </Button>
            {getTimeLeft(selectedDoc?.timeout) != "expired" && <Button size='md' colorScheme="blue">Proceed with Signing</Button>}
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </Flex>
  )
}

export default PendingSignatures
