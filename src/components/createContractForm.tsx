import React, { useState } from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { format } from 'date-fns';

interface CreateContractFormProps {
  onClose: () => void;
  onSubmit: (data: { name: string; signatureDate: string }) => void;
}

const CreateContractForm: React.FC<CreateContractFormProps> = ({ onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [signatureDate, setSignatureDate] = useState('');
  const [dateInput, setDateInput] = useState('');

  const handleNext = () => {
    if (step === 1 && name.trim()) {
      setStep(2);
    } else if (step === 2 && dateInput.trim()) {
      const formattedDate = format(new Date(dateInput), "yyyy-MM-dd'T'HH:mm:ss'Z'");
      setSignatureDate(formattedDate);
      onSubmit({ name, signatureDate: formattedDate });
      onClose();
    }
  };

  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      bg="rgba(0, 0, 0, 0.5)"
      display="flex"
      justifyContent="center"
      alignItems="center"
      backdropFilter="blur(5px)"
      zIndex="10"
    >
      <Box
        bg="white"
        p="14"
        borderRadius="md"
        boxShadow="lg"
        width={{ base: '90%', md: '600px' }}
      >
        {step === 1 ? (
          <VStack spacing="4">
            <Heading size="md">What would you like to call this contract?</Heading>
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
        <HStack justify="flex-end" mt="8">
          {step === 2 && (
            <Button variant="outline" size={'sm'} onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          <Button colorScheme="blue" size={'sm'} onClick={handleNext}>
            {step === 1 ? 'Next' : 'Submit'}
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default CreateContractForm;
