import {
  Box,
  Heading,
  Button,
  List,
  ListItem,
  Text,
  SimpleGrid,
  Icon,
  VStack,
  Link,
} from '@chakra-ui/react'
import { CheckCircleIcon } from '@chakra-ui/icons'
import { useState } from 'react'
import Navbar from '../components/navbar'
import { FaCloudUploadAlt } from 'react-icons/fa'

const Document = () => {
    const [file, setFile] = useState<File | null>(null);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
          setFile(files[0]); 
        } else {
          setFile(null);
        }
      };

  const handleDragOver = (event : React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event : React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      setFile(droppedFile)
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  return (
    <>
      <Navbar />
      <Box bg="white" minH="100vh" p={20} px={20}>
        {/* Features Section */}
        <SimpleGrid
          columns={[1, 2, 3, 4, 5, 6]}
          mt={10}
          spacing={14}
          spacingY={20}
        >
          {/* Box 1: Intro with Checklist */}
          <Box p={6} gridColumn={['auto', 'span 3']}>
            <Heading size="xl" mb={6}>
              Revolutionizing Trust: Secure & Decentralized Document Signing
            </Heading>
            <Heading size="md" color="gray.600" fontWeight="lg" mb={10}>
              Empowering Users with Seamless and Reliable Electronic Signing
              Solutions
            </Heading>
            <List spacing={6}>
              <ListItem display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} color="green.500" mr={2} />
                <Text>Safe and Secure through any device</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} color="green.500" mr={2} />
                <Text>View your document history</Text>
              </ListItem>
              <ListItem display="flex" alignItems="center">
                <Icon as={CheckCircleIcon} color="green.500" mr={2} />
                <Text>Track pending documents</Text>
              </ListItem>
            </List>
          </Box>

          {/* Box 2: PDF Uploader */}
          <Box
            bg="white"
            p={6}
            shadow="lg"
            borderRadius="20"
            gridColumn={['auto', 'span 3']}
          >
            {/* Custom Drag and Drop Area */}
            <Box
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              bg="gray.50"
              border="2px dashed"
              borderColor="gray.400"
              borderRadius="md"
              p={20}
              textAlign="center"
              cursor="pointer"
              transition="background-color 0.3s"
              _hover={{ bg: 'gray.100' }}
            >
              <VStack spacing={6}>
                <Icon as={FaCloudUploadAlt} boxSize={10} color="gray.500" />
                <Text color="gray.500">
                  Drag and drop your PDF document here, or click to upload.
                </Text>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={handleFileUpload}
                  style={{ display: 'none' }}
                  id="pdf-upload"
                />
                <label htmlFor="pdf-upload">
                  <Button as="span" colorScheme="blue">
                    Choose File
                  </Button>
                </label>
              </VStack>
            </Box>

            {file && (
              <Text mt={4} color="green.500">
                Uploaded file: {file.name}
              </Text>
            )}
          </Box>

          {/* Feature 3: View Your Documents */}
          <Box
            bg="white"
            p={8}
            borderRadius="md"
            border="1px solid"
            borderColor="gray.200"
            gridColumn={['auto', 'span 2']}
          >
            <Heading size="md" mb={8}>
              View Your Documents
            </Heading>
            <Text mb={6}>
              Access and view all your previously uploaded and signed documents.
              You can also download them.
            </Text>
            <Button colorScheme="orange" size="md" variant="outline">
              View Documents
            </Button>
          </Box>

          {/* Feature 4: Pending Documents to Sign */}
          <Box
            bg="white"
            p={8}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            gridColumn={['auto', 'span 2']}
          >
            <Heading size="md" mb={8}>
              Pending Documents for You to Sign
            </Heading>
            <Text mb={4}>
              Documents that are waiting for your signature. Review and sign
              them.
            </Text>
            <Button colorScheme="orange" variant="outline" size="md">
              Pending Documents
            </Button>
          </Box>

          {/* Feature 5: Additional Features */}
          <Box
            bg="white"
            p={8}
            border="1px solid"
            borderColor="gray.200"
            borderRadius="md"
            gridColumn={['auto', 'span 2']}
          >
            <Heading size="md" mb={8}>
              Features
            </Heading>
            <List spacing={1}>
              <ListItem>
                <Link
                  color="blue.500"
                  fontWeight="bold"
                  _hover={{ textDecoration: 'underline', color: 'blue.700' }}
                >
                  View signed document history
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  color="blue.500"
                  fontWeight="bold"
                  _hover={{ textDecoration: 'underline', color: 'blue.700' }}
                >
                  Track document signing status
                </Link>
              </ListItem>
              <ListItem>
                <Link
                  color="blue.500"
                  fontWeight="bold"
                  _hover={{ textDecoration: 'underline', color: 'blue.700' }}
                >
                  Search for documents by name or date
                </Link>
              </ListItem>
            </List>
          </Box>
        </SimpleGrid>
      </Box>
    </>
  )
}

export default Document
