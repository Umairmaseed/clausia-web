import { extendTheme } from '@chakra-ui/react'
import { buttonTheme } from './components/buttons'

const theme = extendTheme({
  fonts: {
    body: `Montserrat, sans-serif`,
  },
  colors: {
    blue: {
      50: '#f2f6fc',
      100: '#e3ebf6',
      200: '#cddef0',
      300: '#aac7e6',
      400: '#81aad9',
      500: '#648ecd',
      600: '#5075c0',
      700: '#4663af',
      800: '#3d5390',
      900: '#354673',
      950: '#2a3452',
    },
  },
  components: {
    Button: buttonTheme,
  },
})

export default theme
