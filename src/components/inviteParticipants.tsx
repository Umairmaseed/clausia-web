import React, { useState } from 'react';
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  Button,
  List,
  ListItem,
  IconButton,
  VStack,
  HStack,
  CloseButton,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { UserService } from '../services/User';
import { useAuth } from '../context/Authcontext';

interface ParticipantOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onAddParticipant: ( participants: UserKey[], contractId: string) => void;
  contractId : string
}

const ParticipantOverlay: React.FC<ParticipantOverlayProps> = ({ isOpen, onClose, onAddParticipant,contractId }) => {
  const toast = useToast();
  const {setLoading} = useAuth();
  const [nameInput, setNameInput] = useState('');
  const [emailInput, setEmailInput] = useState('');
  const [idInput, setIdInput] = useState('');
  const [names, setNames] = useState<string[]>([]);
  const [emails, setEmails] = useState<string[]>([]);
  const [ids, setIds] = useState<string[]>([]);
  const [participants, setParticipants] = useState<UserKey[]>([]);

  const handleAddParticipant = async (input: string, type: 'userName' | 'email' | 'id') => {
    setLoading(true);
    if (input) {
      try {
        const response = await UserService.confirmUser({ [type]: input });
        if (type === 'userName') {
          setNames([...names, input]);
        } else if (type === 'email') {
          setEmails([...emails, input]);
        } else {
          setIds([...ids, input]);
        }
        setParticipants([...participants, {
          "@assetType": "user",
          "@key": response.userId,
        }]);
        toast({ title: 'Participant added successfully', status: 'success' });
        if (type === 'userName') setNameInput('');
        if (type === 'email') setEmailInput('');
        if (type === 'id') setIdInput('');
      } catch (error) {
        toast({ title: 'Participant not found', status: 'error' });
      }
    }
    setLoading(false);
  };

  const handleRemoveParticipant = (index: number, type: 'userName' | 'email' | 'id') => {
    setLoading(true);
    if (type === 'userName') setNames(names.filter((_, i) => i !== index));
    if (type === 'email') setEmails(emails.filter((_, i) => i !== index));
    if (type === 'id') setIds(ids.filter((_, i) => i !== index));
    setLoading(false);
  };

  const clearInputs = () => {
    setNameInput('');
    setEmailInput('');
    setIdInput('');
    setEmails([]);
    setNames([]);
    setIds([]);
  }

  const handleSubmit = () => {
    onAddParticipant(participants, contractId);
    clearInputs();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent px={20} py={10}>
        <ModalHeader>Add Participants</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Tabs variant="enclosed">
            <TabList>
              <Tab>By UserName</Tab>
              <Tab>By Email</Tab>
              <Tab>By ID</Tab>
            </TabList>

            <TabPanels>
              <TabPanel>
                <VStack spacing={4}>
                  <List spacing={2}>
                    {names.map((name, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <Box>{name}</Box>
                          <CloseButton onClick={() => handleRemoveParticipant(index, 'userName')} />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                  <HStack>
                    <Input placeholder="Enter username" value={nameInput} onChange={(e) => setNameInput(e.target.value)} />
                    <IconButton size={'sm'} icon={<AddIcon />} aria-label="Add Name" onClick={() => handleAddParticipant(nameInput, 'userName')} />
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4}>
                  <List spacing={2}>
                    {emails.map((email, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <Box>{email}</Box>
                          <CloseButton onClick={() => handleRemoveParticipant(index, 'email')} />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                  <HStack>
                    <Input placeholder="Enter email" value={emailInput} onChange={(e) => setEmailInput(e.target.value)} />
                    <IconButton size={'sm'} icon={<AddIcon />} aria-label="Add Email" onClick={() => handleAddParticipant(emailInput, 'email')} />
                  </HStack>
                </VStack>
              </TabPanel>

              <TabPanel>
                <VStack spacing={4}>
                  <List spacing={2}>
                    {ids.map((id, index) => (
                      <ListItem key={index}>
                        <HStack justify="space-between">
                          <Box>{id}</Box>
                          <CloseButton onClick={() => handleRemoveParticipant(index, 'id')} />
                        </HStack>
                      </ListItem>
                    ))}
                  </List>
                  <HStack>
                    <Input placeholder="Enter ID" value={idInput} onChange={(e) => setIdInput(e.target.value)} />
                    <IconButton size={'sm'} icon={<AddIcon />} aria-label="Add ID" onClick={() => handleAddParticipant(idInput, 'id')} />
                  </HStack>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" size={'md'} onClick={handleSubmit} isDisabled={participants.length === 0}>
            Submit
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ParticipantOverlay;
