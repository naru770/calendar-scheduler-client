import { createRoot } from 'react-dom/client'
import App from './App';
import { ChakraProvider } from '@chakra-ui/react'

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('Failed to find the root element')
const root = createRoot(rootElement)

root.render(
  <ChakraProvider>
    <App />
  </ChakraProvider>
);
