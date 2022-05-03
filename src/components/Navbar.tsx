import {
  Flex,
  Box,
  Heading,
  Spacer,
  HStack,
} from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
}

export const navbarHeight = 55

export const CalendarNavbar: React.VFC<Props> = ({ children }) => {

  return (
    <Box boxShadow="md">
    <Flex
      h={navbarHeight + 'px'}
      alignItems={'center'}
      justifyContent={'space-between'}
      backgroundColor='#f9f9f9'
    >
      <HStack spacing={8}>
        <Box pl={4}>
          <Heading size='md'>Calendar</Heading>
        </Box>
      </HStack>

      <Spacer />

      { children }

    </Flex>
    </Box>
  )
}
