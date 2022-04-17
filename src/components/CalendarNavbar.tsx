import { useState, useEffect, useRef } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  Box,
  Heading,
  Spacer,
  HStack,
  Text,
  IconButton,
} from '@chakra-ui/react'

type Props = {
  children: React.ReactNode
}

export const navbarHeight = 60

export const CalendarNavbar: React.VFC<Props> = ({ children }) => {

  return (
    <Flex
      h={navbarHeight + 'px'}
      alignItems={'center'}
      justifyContent={'space-between'}
      backgroundColor='#f9f9f9'
    >
      <HStack spacing={8}>
        <Box pl={4}>
          <Heading size='md'>CalendarApp</Heading>
        </Box>
      </HStack>

      <Spacer />

      { children }

    </Flex>
  )
}
