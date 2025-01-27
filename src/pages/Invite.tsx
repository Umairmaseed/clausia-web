import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Box, Spinner, Heading, useToast, Image } from '@chakra-ui/react';
import inviteImage from '../assets/Invite/invite-wait.jpg'
import { ContractService } from '../services/contract';


const Invite = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const toast = useToast();

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      acceptInvite(token);
    } else {
      toast({
        title: 'Invalid Link',
        description: 'The invitation link is missing a token.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      navigate('/error');
    }
  }, [token, toast, navigate]);

  const acceptInvite = async (token : string) => {

    try {
   const response = await ContractService.AcceptInvite(token);

      if (response.contract) {
        toast({
          title: 'Invite Accepted',
          description: 'Your invitation has been successfully accepted!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
        navigate('/contract');
      } else {
        const data = await response.json();
        throw new Error(data.error || 'Failed to accept invite');
      }
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong while accepting the invite.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box textAlign="center" mt={20}>
      {isLoading ? (
        <Box
        display="flex" 
        flexDirection="column" 
        justifyContent="center" 
        alignItems="center" 
        >
          <Heading mt={4} size="md">
            Processing your invitation...
          </Heading>
          <Image src={inviteImage} alt="No Contracts" width={'600px'} mt={20} />
        </Box>
      ) : (
        <Heading size="lg">Redirecting...</Heading>
      )}
    </Box>
  );
};

export default Invite;
