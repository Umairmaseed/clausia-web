import { Box, Spinner } from '@chakra-ui/react'

const Loader = () => {
  return (
    <Box
      position="fixed"
      top="0"
      left="0"
      width="100vw"
      height="100vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="rgba(255, 255, 255, 0.4)"
      backdropFilter="blur(2px)"
      zIndex="1000"
    >
      <Box textAlign="center">
        <Spinner size="xl" color="teal.500" />
      </Box>
    </Box>
  )
}

export default Loader
