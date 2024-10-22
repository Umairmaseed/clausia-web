import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Box,
  Text,
} from '@chakra-ui/react'
import { Worker, Viewer } from '@react-pdf-viewer/core'
// import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';

interface FilePreviewProps {
  isOpen: boolean
  onClose: () => void
  file: File | null
  useModal?: boolean
}

export function FilePreview({
  isOpen,
  onClose,
  file,
  useModal = true,
}: FilePreviewProps) {
  // Default to true
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  // const defaultLayoutPluginInstance = defaultLayoutPlugin();

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPdfUrl(fileUrl)

      return () => URL.revokeObjectURL(fileUrl)
    }
  }, [file])

  const pdfViewer = (
    <Box
      height="600px"
      width="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Worker
        workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js`}
      >
        <Viewer
          fileUrl={pdfUrl || ''}
          // plugins={[defaultLayoutPluginInstance]}
        />
      </Worker>
    </Box>
  )

  if (useModal) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="4xl">
        <ModalOverlay />
        <ModalContent py={10}>
          <ModalCloseButton />
          <ModalBody>
            {file && pdfUrl ? (
              pdfViewer
            ) : (
              <Skeleton height="600px" isLoaded={false}>
                <Box
                  height="600px"
                  display="flex"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text fontSize="xl" color="gray.500">
                    No PDF available for preview
                  </Text>
                </Box>
              </Skeleton>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    )
  }

  return (
    <Box width="100%">
      {file && pdfUrl ? (
        pdfViewer
      ) : (
        <Skeleton height="600px" isLoaded={false}>
          <Box
            height="600px"
            display="flex"
            justifyContent="center"
            alignItems="center"
          >
            <Text fontSize="xl" color="gray.500">
              No PDF available for preview
            </Text>
          </Box>
        </Skeleton>
      )}
    </Box>
  )
}
