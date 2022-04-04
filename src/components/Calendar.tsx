import { useState } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  Modal,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  Box,
  Heading,
  Spacer,
  HStack,
  Text,
  VStack
} from '@chakra-ui/react'

function getFirstSquareOfCalendar(today: Date) {
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const diff = firstDay.getDay() * 86400 * 1000
  return new Date(firstDay.getTime() - diff)
}

function getListOfCalendarDays(firstDay: Date) {
  const listOfDays = Array(7 * 6).fill(0).map((_, i) => new Date(firstDay.getTime() + i * 86400 * 1000))
  return listOfDays
}

const Calendar = () => {

  const ShowModal = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()
    return (
      <>
        <Button onClick={onOpen}>Open Modal</Button>

        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>ModalTitle</ModalHeader>
            <ModalCloseButton />

            <ModalFooter>
              <Button colorScheme={'blue'} mr={3} onClick={onClose}>
                Close
              </Button>
              <Button variant='ghost'>Secondary Action</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </>
    )
  }

  const today = new Date()
  const [calendarMonth, setCalendarMonth] = useState([today.getFullYear(), today.getMonth()])
  const weekName = ["日", "月", "火", "水", "木", "金", "土"]

  const setNextCalnedarMonth = () => {
    setCalendarMonth((prev) => {
      const year = prev[0] + Math.floor((prev[1] + 1) / 12)
      const month = (prev[1] + 1) % 12
      return [year, month]
    })
  }

  const setPrevCalendarMonth = () => {
    setCalendarMonth((prev) => {
      const year = prev[0] + Math.floor((prev[1] - 1) / 12)
      const month = (prev[1] + 12 - 1) % 12
      return [year, month]
    })
  }

  const showTable = () => {
    const firstDay = getFirstSquareOfCalendar(new Date(calendarMonth[0], calendarMonth[1], 1))
    const listOfCalendarDays = getListOfCalendarDays(firstDay)
    
    return (
      <Box>
        <Flex h='2vh'>
        {weekName.map((w, i) =>
          <Flex grow={1} basis={1} justifyContent='center'
          borderRight='1px' borderTop='1px' borderColor='#dadce0'>
            <Text fontSize='md'>{w}</Text>
          </Flex>
        )}
        </Flex>
      {Array(6).fill(0).map((_, i) =>
        <Flex h='15vh'>
        {Array(7).fill(0).map((_, j) => 
          <Flex grow={1} basis={1} justifyContent='center'
          borderLeft={(j === 0) ? '1px' : undefined}
          borderRight='1px' borderBottom='1px' borderColor='#dadce0'>
            <Text fontSize='md' textAlign='center'>
            {listOfCalendarDays[i * 7 + j].getDate()}
            </Text>
          </Flex>
        )}
        </Flex>
      )}
      </Box>
    )
  }

  return (
    <>
      <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
        <Box p='2'>
          <Heading size='md'>CalendarApp</Heading>
        </Box>
        <HStack spacing={8}>
          <ButtonGroup variant='outline' spacing='3'>
            <Button onClick={setPrevCalendarMonth}>PREV</Button>
            <Button onClick={setNextCalnedarMonth}>NEXT</Button>
          </ButtonGroup>
          <Text fontSize='4xl'>{calendarMonth[0]}年{calendarMonth[1] + 1}月</Text>
          {ShowModal()}
        </HStack>
        <Spacer />
      </Flex>
      {showTable()}
    </>
  )
}

export default Calendar