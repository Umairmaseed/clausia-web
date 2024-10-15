import { Box, Button, Text, Icon, VStack } from '@chakra-ui/react'
import { FaCloudUploadAlt } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

export const DragAndDrop = () => {
  const navigate = useNavigate()

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files
    if (files && files.length > 0) {
      navigate('/document/create', { state: { file: files[0] } })
    }
  }

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    const droppedFile = event.dataTransfer.files[0]
    if (droppedFile && droppedFile.type === 'application/pdf') {
      navigate('/document/create', { state: { file: droppedFile } })
    } else {
      alert('Please upload a valid PDF file.')
    }
  }

  return (
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
    </Box>
  )
}
