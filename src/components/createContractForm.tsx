import React, { useState } from 'react'
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
} from '@chakra-ui/react'
import { format } from 'date-fns'

interface CreateContractFormProps {
  onClose: () => void
  onSubmit: (data: { name: string; signatureDate: string }) => void
}

const CreateContractForm: React.FC<CreateContractFormProps> = ({
  onClose,
  onSubmit,
}) => {
  const [step, setStep] = useState(1)
  const [name, setName] = useState('')
  const [signatureDate, setSignatureDate] = useState('')
  const [dateInput, setDateInput] = useState('')

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2)
    } else if (step === 2 && dateInput.trim()) {
      const formattedDate = format(
        new Date(dateInput),
        "yyyy-MM-dd'T'HH:mm:ss'Z'"
      )
      setSignatureDate(formattedDate)
      onSubmit({ name, signatureDate: formattedDate })
      onClose()
    }
  }

  return (
    <Modal isOpen={true} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {step === 1 ? 'Create a Contract' : 'Select Signature Date'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {step === 1 ? (
            <VStack spacing="4">
              <Heading size="md">
                What would you like to call this contract?
              </Heading>
              <Input
                placeholder="Contract name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </VStack>
          ) : (
            <VStack spacing="4">
              <Heading size="md">Please select the signature date</Heading>
              <Input
                type="datetime-local"
                value={dateInput}
                onChange={(e) => setDateInput(e.target.value)}
              />
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <HStack justify="flex-end">
            {step === 2 && (
              <Button variant="outline" size="sm" onClick={() => setStep(1)}>
                Back
              </Button>
            )}
            <Button colorScheme="blue" size="sm" onClick={handleNext}>
              {step === 1 ? 'Next' : 'Submit'}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default CreateContractForm
