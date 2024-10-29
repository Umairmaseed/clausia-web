import { useState, useEffect } from 'react'
import {
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Skeleton,
  Box,
  Text,
  Flex,
  HStack,
  Checkbox,
} from '@chakra-ui/react'
import {
  Worker,
  Viewer,
  SpecialZoomLevel,
  ScrollMode,
  PageChangeEvent,
  ViewMode,
} from '@react-pdf-viewer/core'
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation'
import Draggable from 'react-draggable'

interface FilePreviewProps {
  isOpen: boolean
  onClose: () => void
  file: File | null
  useModal?: boolean
  isSigning?: boolean
  onCoordinateChange?: (x: number, y: number) => void
  onPageChange?: (currentPage: number) => void
}

export const FilePreview = ({
  isOpen,
  onClose,
  file,
  isSigning = false,
  useModal = true,
  onCoordinateChange,
  onPageChange,
}: FilePreviewProps) => {
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [allowSignature, setAllowSignature] = useState<boolean>(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [position, setPosition] = useState({ x: 10, y: 0 })
  const pageNavigationPluginInstance = pageNavigationPlugin()
  const { GoToNextPage, GoToPreviousPage, CurrentPageLabel, NumberOfPages } =
    pageNavigationPluginInstance

  useEffect(() => {
    if (file) {
      const fileUrl = URL.createObjectURL(file)
      setPdfUrl(fileUrl)

      return () => URL.revokeObjectURL(fileUrl)
    }
  }, [file])

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAllowSignature(e.target.checked)
  }

  const handlePageChange = (e: PageChangeEvent) => {
    const newPage = e.currentPage
    setCurrentPage(newPage)
    onPageChange && onPageChange(newPage + 1)
  }

  const handleDrag = (e: any, data: any) => {
    const { x, y } = data
    if (onCoordinateChange) onCoordinateChange(x, y)
    setPosition({ x: x, y: y })
  }

  const pdfViewer = (
    <Flex
      display="flex"
      justifyContent="center"
      alignItems="center"
      userSelect="none"
      className="pdf-signing"
    >
      <Worker
        workerUrl={`https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.0.279/pdf.worker.min.js`}
      >
        <Viewer
          fileUrl={pdfUrl || ''}
          plugins={[pageNavigationPluginInstance]}
          defaultScale={SpecialZoomLevel.PageFit}
          scrollMode={!useModal ? ScrollMode.Page : ScrollMode.Vertical}
          onPageChange={handlePageChange}
          viewMode={ViewMode.SinglePage}
        />
      </Worker>
    </Flex>
  )

  if (useModal) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalOverlay />
        <ModalContent py={4}>
          <ModalCloseButton />
          <ModalBody>
            {file && pdfUrl ? (
              <Box>
                <HStack spacing={4} justifyContent="center" mb={4}>
                  <GoToPreviousPage />
                  <Text fontSize="sm" fontWeight="medium">
                    <CurrentPageLabel /> of <NumberOfPages />
                  </Text>
                  <GoToNextPage />
                </HStack>
                {pdfViewer}
              </Box>
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

  if (isSigning) {
    return (
      <Box position="relative" mx="auto" w="50%">
        <Flex
          justifyContent="space-between"
          alignItems="center"
          p={4}
          width="100%"
        >
          <HStack spacing={4} mb={4}>
            <GoToPreviousPage />
            <Text fontSize="sm" fontWeight="medium">
              <CurrentPageLabel /> of <NumberOfPages />
            </Text>
            <GoToNextPage />
          </HStack>

          {isSigning && (
            <HStack spacing={2}>
              <Checkbox
                isChecked={allowSignature}
                onChange={handleCheckboxChange}
              />
              <Text>Place Signature</Text>
            </HStack>
          )}
        </Flex>
        <Box position="relative">
          {file && (
            <>
              {/* File Preview */}
              <Box position="relative" mx="auto" w="100%">
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

              {/* Draggable Signature Box */}
              {allowSignature && (
                <Box position="absolute" top={0} left={0} w="100%" h="100%">
                  <Draggable
                    bounds="parent"
                    position={position}
                    onDrag={handleDrag}
                  >
                    <Box
                      position="absolute"
                      cursor="move"
                      border="3px dotted"
                      borderColor="gray.400"
                      bg="rgba(200, 200, 200, 0.5)"
                      borderStyle="dotted"
                      py={4}
                      px={8}
                      style={{
                        borderSpacing: '10px',
                      }}
                    >
                      <Text>Sign Here</Text>
                    </Box>
                  </Draggable>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }

  return (
    <Box width="100%">
      {file && pdfUrl ? (
        <Box>
          <HStack spacing={4} mb={4} justifyContent="center">
            <GoToPreviousPage />
            <Text fontSize="sm" fontWeight="medium">
              <CurrentPageLabel /> of <NumberOfPages />
            </Text>
            <GoToNextPage />
          </HStack>
          {pdfViewer}
        </Box>
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
