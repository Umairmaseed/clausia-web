import { Box, Flex, Heading, HStack, Button } from '@chakra-ui/react'

const Navbar = () => {
  return (
    <Box bg="white" boxShadow="md">
      <Flex
        align="center"
        justify="space-between"
        p={4}
        minW="100vw"
        mx="auto"
        px={10}
      >
        <Heading as="h1" size="md" mr={4}>
          Goprocess
        </Heading>

        <HStack spacing={4}>
          <Button
            variant="link"
            color="black"
            fontSize="sm"
            display="block"
            p={2}
            _hover={{
              bg: 'gray.100',
              borderRadius: 'md',
              outline: 'none',
            }}
            _focus={{ outline: 'none' }}
          >
            Pricing
          </Button>
          <Button
            variant="link"
            color="black"
            fontSize="sm"
            display="block"
            p={2}
            _hover={{
              bg: 'gray.100',
              borderRadius: 'md',
              outline: 'none',
            }}
            _focus={{ outline: 'none' }}
          >
            Contact
          </Button>
          <Button
            colorScheme="orange"
            variant="outline"
            fontSize="sm"
            bg="orange.25"
            p={2}
            h={8}
          >
            Login
          </Button>
        </HStack>
      </Flex>
    </Box>
  )
}

export default Navbar
