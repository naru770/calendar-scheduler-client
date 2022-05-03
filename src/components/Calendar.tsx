import { useState, useEffect, useRef } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  Box,
  Spacer,
  HStack,
  Text,
  VStack,
  IconButton,
  FormControl,
  FormLabel,
  Input,
  Select,
  Portal,
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverFooter,
  PopoverBody,
  PopoverCloseButton,
  Checkbox,
  Badge
} from '@chakra-ui/react'
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  AddIcon
} from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import {
  CalendarMonth,
  CalendarDate,
  EventData,
  NewEventData,
  UserData
} from './Type'
import {
  fetchEvent,
  createEvent,
  modifyEvent,
  deleteEvent,
  fetchUserData,
  toDateString,
} from './API'
import {
  CalendarNavbar,
  navbarHeight,
} from './CalendarNavbar'


const Calendar = () => {

  const today = new Date()
  // const weekName = ["日", "月", "火", "水", "木", "金", "土"]
  const weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

  const [calendarMonth, setCalendarMonth] = useState<CalendarMonth>({
    year: today.getFullYear(),
    month: today.getMonth()
  })
  const [calendarRowsNum, setCalendarRowsNum] = useState<number>(5)
  const [calendarEvents, setCalendarEvents] = useState<EventData[]>([] as EventData[])
  const [userData, setUserData] = useState<UserData[]>([] as UserData[])
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight)

  const getFirstSquareOfCalendar = (year: number, month: number): number[] => {
    const firstDay = new Date(year, month, 1)
    const diff = firstDay.getDay() * 86400 * 1000
    const calendarFirstDay = new Date(firstDay.getTime() - diff)
    return [
      calendarFirstDay.getFullYear(),
      calendarFirstDay.getMonth(),
      calendarFirstDay.getDate()
    ]
  }

  const isToday = (date: Date): Boolean => {
    const today = new Date()
    return (date.getFullYear() === today.getFullYear() &&
      date.getMonth() === today.getMonth() &&
      date.getDate() === today.getDate())
  }
  
  const getListOfCalendarDays = (year: number, month: number, day: number, calendarRowsNum: number) => {
    const firstDay = new Date(year, month, day)
    const listOfDays = Array(7 * calendarRowsNum).fill(0)
      .map((_, i) => new Date(firstDay.getTime() + i * 86400 * 1000))
    return listOfDays
  }

  const loadEvents = async () => {
    const [year, month, day] = getFirstSquareOfCalendar(calendarMonth.year, calendarMonth.month)
    await fetchEvent(year, month + 1, day, 7 * calendarRowsNum)
      .then((r) => setCalendarEvents(r))
  }

  useEffect(() => {
    window.onresize = () => setInnerHeight(window.innerHeight)
  }, [])

  useEffect(() => {
    (async () => {
      await fetchUserData().then((r) => setUserData(r))
      loadEvents()
    })()
  }, [calendarMonth, calendarRowsNum])

  const setNextCalnedarMonth = () => {
    setCalendarMonth((prev: CalendarMonth) => {
      const year = prev.year + Math.floor((prev.month + 1) / 12)
      const month = (prev.month + 1) % 12
      return {year: year, month: month}
    })
  }

  const setPrevCalendarMonth = () => {
    setCalendarMonth((prev: CalendarMonth) => {
      const year = prev.year + Math.floor((prev.month - 1) / 12)
      const month = (prev.month + 12 - 1) % 12
      return {year: year, month: month}
    })
  }


  const CalendarEventButton: React.FC<{event: EventData}> = ({event}) => {

    interface Form {
      date: string,
      time: string,
      user: string,
      content: string,
      is_timed: boolean,
    }

    const [form, setForm] = useState<Form>({
      date: event.start_date,
      time: event.start_time,
      user: userData.filter((e) => (e.id === event.user_id))[0].name,
      content: event.content,
      is_timed: event.is_timed,
    })

    useEffect(() => {

    }, [])

    console.log(event)

    const firstFieldRef = useRef(null)

    const updateButton = async () => {
      const user_id = userData.filter((e) => (e.name === form.user))[0]['id']
      const newData: EventData = {
        id: event.id,
        start_date: form.date,
        start_time: form.time,
        content: form.content,
        is_timed: form.is_timed,
        user_id: user_id,
      }
      await modifyEvent(newData)
      loadEvents()
    }

    const deleteButton = async () => {
      await deleteEvent(event.id)
      loadEvents()
    }
    
    return (
      <Popover
        placement='right'
        initialFocusRef={firstFieldRef}
      >
        <PopoverTrigger>
          <Box
            as='button'
            bg={(userData.length === 0) ? 'white'
              : userData.filter((data) => (data.id === event.user_id))[0].color}
            color='white'
            fontSize='xs'
            borderRadius='sm'
            w='97%'
          >
            {(event.is_timed)
              ? event.start_time + ' '
              : ''}
            {event.content}
          </Box>
        </PopoverTrigger>

        <Portal>
          <PopoverContent boxShadow='lg'>
            <PopoverArrow />
            <PopoverHeader>Edit Event</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
            <FormControl pb={6}>
              <FormLabel>User</FormLabel>
              <Select
                onChange={(e) => {setForm({...form, user: e.target.value})}}
                defaultValue={userData.filter((e) => (e['id'] === event['user_id']))[0]['name']}
              >
                {userData.map((data) => <option key={data.id}>{data['name']}</option>)}
              </Select>
            </FormControl>
            <Box pb={6}>
              <Box pb={1}>
                <label htmlFor="changeform-datepicker">Date</label>
              </Box>
              <Box>
                <input
                  id='changeform-datepicker'
                  type='date'
                  defaultValue={event.start_date}
                  onChange={(e) => {setForm({...form, date: e.target.value})}}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Box pb={1}>
                <label htmlFor="changeform-timepicker">Time</label>
              </Box>
              <Box>
                <input
                  id='changeform-timepicker'
                  type='time'
                  defaultValue={event.start_time}
                  onChange={(e) => {setForm({...form, time: e.target.value})}}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Checkbox
                defaultChecked={event['is_timed']}
                onChange={(e) => {setForm({...form, is_timed: e.target.checked})}}
              >View Time</Checkbox>
            </Box>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Input
                defaultValue={event['content']}
                ref={firstFieldRef}
                onChange={(e) => {setForm({...form, content: e.target.value})}}
              />
            </FormControl>
            </PopoverBody>
            <PopoverFooter>
              <Button
                colorScheme={'blue'}
                mr={3}
                onClick={updateButton}
              >
                Update
              </Button>
              <Button
                colorScheme={'red'}
                onClick={deleteButton}
              >
                Delete
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    )
  }

  const CalendarTable = () => {

    const firstDay = getFirstSquareOfCalendar(calendarMonth.year, calendarMonth.month)
    const listOfCalendarDays = getListOfCalendarDays(firstDay[0], firstDay[1], firstDay[2], calendarRowsNum)
    
    return (
      <Box>
        <Flex h={'20px'}>
        {weekName.map((w, i) =>
          <Flex
            grow={1}
            basis={1}
            justifyContent='center'
            borderLeft={(i === 0) ? '1px' : undefined}
            borderRight='1px'
            borderTop='1px'
            borderColor='#dadce0'
            key={w}
          >
            <Box fontSize='sm'>
              {w}
            </Box>
          </Flex>
        )}
        </Flex>
      {Array(calendarRowsNum).fill(0).map((_, i) =>
        // calendar row
        <Flex
          h={Math.floor((innerHeight - navbarHeight - 20) / calendarRowsNum) + 'px'}
          key={i}
        >
        {Array(7).fill(0).map((_, j) =>
          // calendar cell
          <Flex
            grow={1}
            basis={1}
            borderLeft={(j === 0) ? '1px' : undefined}
            borderRight='1px'
            borderBottom='1px'
            borderColor='#dadce0'
            key={j}
          >
            <VStack
              w='100%'
              spacing='0.5'
            >
              <HStack>
              <Box
                textAlign='center'
                fontSize='sm'
              >
                {listOfCalendarDays[i * 7 + j].getDate()}
              </Box>
              {(isToday(listOfCalendarDays[i * 7 + j])) ? <Badge colorScheme='red'>Today</Badge> : ''}
              </HStack>
              {calendarEvents
                .filter((e) => e.start_date === toDateString(listOfCalendarDays[i * 7 + j]))
                .map((event: EventData) =>
                <CalendarEventButton event={event} key={event.id} />
              )}
            </VStack>
          </Flex>
        )}
        </Flex>
      )}
      </Box>
    )
  }

  const EventAddButton = () => {

    interface Form {
      date: string,
      time: string,
      user: string,
      content: string,
      is_timed: boolean,
    }

    const firstFieldRef = useRef(null)

    const [form, setForm] = useState<Form>({
      date: '',
      time: '00:00',
      user: '',
      content: '',
      is_timed: false,
    })

    const isReadyToSubmit = (): boolean => {
      return (
        form.user !== '' &&
        form.date !== '' &&
        form.content !== ''
      )
    }

    const addButton = async () => {
      const user_id = userData.filter((e) => (e.name === form.user))[0].id
      const newData: NewEventData = {
        start_date: form.date,
        start_time: form.time,
        content: form.content,
        is_timed: form.is_timed,
        user_id: user_id,
      }
      await createEvent(newData)
      loadEvents()
    }
    
    return (
      <Popover
        placement='bottom'
        initialFocusRef={firstFieldRef}
      >
        <PopoverTrigger>
          <Button
            leftIcon={<AddIcon />}
            colorScheme='teal'
            variant='solid'
          >New Event</Button>
        </PopoverTrigger>

        <Portal>
          <PopoverContent boxShadow='lg'>
            <PopoverArrow />
            <PopoverHeader>Edit Event</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
            <FormControl pb={6}>
              <FormLabel>User</FormLabel>
              <Select
                onChange={(e) => setForm({...form, user: e.target.value})}
              >
                <option hidden>Select User</option>
                {userData.map((data) => <option key={data.id}>{data['name']}</option>)}
              </Select>
            </FormControl>
            <Box pb={6}>
              <Box pb={1}>
                <label htmlFor="changeform-datepicker">Date</label>
              </Box>
              <Box>
                <input
                  id='changeform-datepicker'
                  type='date'
                  value={toDateString(new Date(calendarMonth.year, calendarMonth.month, 1))}
                  onChange={(e) => setForm({...form, date: e.target.value})}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Box pb={1}>
                <label htmlFor="changeform-timepicker">Time</label>
              </Box>
              <Box>
                <input
                  id='changeform-timepicker'
                  type='time'
                  defaultValue={form.time}
                  onChange={(e) => setForm({...form, time: e.target.value})}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Checkbox
                defaultChecked={false}
                onChange={(e) => setForm({...form, is_timed: e.target.checked})}
              >View Time</Checkbox>
            </Box>
            <FormControl>
              <FormLabel>Content</FormLabel>
              <Input
                ref={firstFieldRef}
                onChange={(e) => setForm({...form, content: e.target.value})}
              />
            </FormControl>
            </PopoverBody>
            <PopoverFooter>
              <Button
                colorScheme={'blue'}
                mr={3}
                onClick={addButton}
                disabled={!isReadyToSubmit()}
              >
                Add
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    )
  }

  const LocalCalendarNavbar = () => {
    return (
      <CalendarNavbar>
        <HStack spacing={8}>
          <ButtonGroup variant='outline' spacing='3'>
            <IconButton
              onClick={setPrevCalendarMonth}
              icon={<ChevronLeftIcon />}
              colorScheme='blue'
              aria-label='go to previous month'
            />
            <IconButton
              onClick={setNextCalnedarMonth}
              icon={<ChevronRightIcon />}
              colorScheme='blue'
              aria-label='go to next month'
            />
          </ButtonGroup>
          <Text fontWeight='bold' fontSize='3xl'>
            {calendarMonth.year} {' '} - {' '} {calendarMonth.month + 1}
          </Text>
          <Button
            onClick={() => {
              setCalendarMonth({year: today.getFullYear(), month: today.getMonth()})}
            }
            colorScheme='blue'
          >Today</Button>
        </HStack>

        <Spacer />

        <HStack spacing={8} pr={4}>
          <Box>
            <EventAddButton />
          </Box>
          <Link to='/setting'>
            <Button
              leftIcon={<SettingsIcon />}
              colorScheme='blue'
              variant='outline'
            >
              Setting
            </Button>
          </Link>

        </HStack>
      </CalendarNavbar>
    )
  }


  return (
    <>
      <LocalCalendarNavbar />
      <CalendarTable />
    </>
  )
}

export default Calendar