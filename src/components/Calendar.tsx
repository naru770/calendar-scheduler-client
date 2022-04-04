import { useState, useEffect } from 'react'
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
  VStack,
  IconButton
} from '@chakra-ui/react'

import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@chakra-ui/icons'

function getFirstSquareOfCalendar(today: Date) {
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
  const diff = firstDay.getDay() * 86400 * 1000
  return new Date(firstDay.getTime() - diff)
}

function getListOfCalendarDays(firstDay: Date, calendarRowsNum: number) {
  const listOfDays = Array(7 * calendarRowsNum).fill(0)
    .map((_, i) => new Date(firstDay.getTime() + i * 86400 * 1000))
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

  const [calendarRowsNum, setCalendarRowsNum] = useState(5)

  const [calendarEvents, setCalendarEvents] = useState([])

  useEffect(() => {
    fetch('http://localhost:8000/')
      .then((r) => r.json())
      .then((r) => {
        setCalendarEvents(r)
        console.log(r)
      })
    return () => {console.log("END!")}
  }, calendarMonth)

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
    const listOfCalendarDays = getListOfCalendarDays(firstDay, calendarRowsNum)
    
    return (
      <Box>

        <Flex h='2vh'>
        {weekName.map((w, i) =>
          <Flex
            grow={1}
            basis={1}
            justifyContent='center'
            borderLeft={(i === 0) ? '1px' : undefined}
            borderRight='1px'
            borderTop='1px'
            borderColor='#dadce0'
          >
            <Box fontSize='sm'>
              {w}
            </Box>
          </Flex>
        )}
        </Flex>

      {Array(calendarRowsNum).fill(0).map((_, i) =>
        <Flex h={90 / calendarRowsNum + 'vh'}>
        {Array(7).fill(0).map((_, j) => 
          <Flex
            grow={1}
            basis={1}
            borderLeft={(j === 0) ? '1px' : undefined}
            borderRight='1px'
            borderBottom='1px'
            borderColor='#dadce0'
          >
            <VStack
              w='100%'
              spacing='0.5'
            >
              <Box textAlign='center' fontSize='sm'>
                {listOfCalendarDays[i * 7 + j].getDate()}
              </Box>
              <Box
                h='1.5em'
                bg='#4dabf5'
                color='white'
                fontSize='sm'
                borderRadius='sm'
                w='97%'
              >
                予定１
              </Box>
              <Box
                h='1.5em'
                fontSize='sm'
                borderRadius='sm'
                w='97%'
              >
                予定２
              </Box>
              <Box>
                {/* {calendarEvents} */}
              </Box>
            </VStack>
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
            <IconButton
              onClick={setPrevCalendarMonth}
              icon={<ChevronLeftIcon />}
              aria-label='go to previous month'
            />
            <IconButton
              onClick={setNextCalnedarMonth}
              icon={<ChevronRightIcon />}
              aria-label='go to next month'
            />
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