import { useState, useEffect, useRef, createRef } from 'react'
import {
  Button,
  ButtonGroup,
  Flex,
  Box,
  Heading,
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
  Checkbox
} from '@chakra-ui/react'
import axios from 'axios'

import {
  ChevronLeftIcon,
  ChevronRightIcon
} from '@chakra-ui/icons'


const Calendar = () => {

  interface CalendarMonth {
    year: number,
    month: number,
  }

  interface EventData {
    id: number,
    content: string,
    user_id: number,
    start_datetime: string,
    is_timed: boolean,
  }

  interface UserData {
    id: number,
    name: string,
    color: string,
  }


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


  async function updateEvent(event: EventData) {
    await axios.put(`${baseUrl}/event`, event)
      .then(() => console.log('updated event'))
  }

  async function deleteEvent(eventId: number) {
    await axios.delete(`${baseUrl}/event/${eventId}`)
      .then(() => console.log('deleted event'))
  }


  const baseUrl = 'http://localhost:8000'

  const today = new Date()
  const weekName = ["日", "月", "火", "水", "木", "金", "土"]

  const [calendarMonth, setCalendarMonth] = useState<CalendarMonth>({year: today.getFullYear(), month: today.getMonth()})
  const [calendarRowsNum, setCalendarRowsNum] = useState<number>(5)
  const [calendarEvents, setCalendarEvents] = useState<EventData[][]>(Array(7 * calendarRowsNum).fill([]) as EventData[][])
  const [userData, setUserData] = useState<UserData[]>([] as UserData[])

  // ユーザー情報取得
  useEffect(() => {
    axios(`${baseUrl}/user`)
      .then((r) => r.data)
      .then((r) => {
        setUserData(r['users'])
      })
  }, [])

  // イベント情報取得
  useEffect(() => {
    const calendarFirstDay = getFirstSquareOfCalendar(new Date(calendarMonth.year, calendarMonth.month, 1))
    axios(`${baseUrl}/event/${calendarFirstDay.getFullYear()}/${calendarFirstDay.getMonth() + 1}/${calendarFirstDay.getDate()}`, {
      params: {
        days: 7 * calendarRowsNum
      }
    })
      .then((r) => r.data)
      .then((r) => {
        setCalendarEvents(r['events'])
      })
    return () => {}
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

    const firstFieldRef = useRef(null)
    const [date, setDate] = useState<string>(event['start_datetime'].split('T')[0])
    const [time, setTime] = useState<string>(event['start_datetime'].split('T')[1])
    const [user, setUser] = useState<string>(userData.filter((e) => e.id === event['user_id'])[0]['name'])
    const [content, setContent] = useState<string>(event['content'])
    const [isTimed, setIsTimed] = useState<boolean>(event['is_timed'])
    
    return (
      <Popover
        placement='right'
        initialFocusRef={firstFieldRef}
      >
        <PopoverTrigger>
          <Box
            as='button'
            p='0.4'
            pl='2'
            bg={userData.filter((data) => (data.id === event.user_id))[0].color}
            color='white'
            fontSize='xs'
            borderRadius='sm'
            w='97%'
          >
            {(event['is_timed'])
              ? event['start_datetime'].split('T')[1].slice(0,'00:00'.length) + ' '
              : ''
            }{event['content']}
          </Box>
        </PopoverTrigger>

        <Portal>
          <PopoverContent>
            <PopoverArrow />
            <PopoverHeader>イベント編集</PopoverHeader>
            <PopoverCloseButton />
            <PopoverBody>
            <FormControl pb={6}>
              <FormLabel>ユーザー</FormLabel>
              <Select
                onChange={(e) => {setUser(e.target.value)}}
                defaultValue={userData.filter((e) => (e['id'] === event['user_id']))[0]['name']}
              >
                {userData.map((data) => <option key={data.id}>{data['name']}</option>)}
              </Select>
            </FormControl>
            <Box pb={6}>
              <Box pb={1}>
                <label htmlFor="changeform-datepicker">日付</label>
              </Box>
              <Box>
                <input
                  id='changeform-datepicker'
                  type='date'
                  defaultValue={event['start_datetime'].split('T')[0]}
                  onChange={(e) => {setDate(e.target.value)}}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Box pb={1}>
                <label htmlFor="changeform-timepicker">時間</label>
              </Box>
              <Box>
                <input
                  id='changeform-timepicker'
                  type='time'
                  defaultValue={event['start_datetime'].split('T')[1]}
                  onChange={(e) => {setTime(e.target.value)}}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Checkbox
                defaultChecked={event['is_timed']}
                onChange={(e) => {setIsTimed(e.target.checked)}}
              >時間表示</Checkbox>
            </Box>
            <FormControl>
              <FormLabel>イベント内容</FormLabel>
              <Input
                defaultValue={event['content']}
                ref={firstFieldRef}
                onChange={(e) => {setContent(e.target.value)}}
              />
            </FormControl>
            </PopoverBody>
            <PopoverFooter>
              <Button
                colorScheme={'blue'}
                mr={3}
                onClick={async () => {
                  const start_datetime = date + 'T' + time
                  const user_id = userData.filter((e) => (e.name == user))[0].id
                  const newData: EventData = {
                    id: event.id,
                    start_datetime: start_datetime,
                    content: content,
                    is_timed: isTimed,
                    user_id: user_id,
                  }
                  await updateEvent(newData)
                  const newCalendarEvents = calendarEvents
                    .map((eventsOneDay: EventData[]) => eventsOneDay
                      .map((e: EventData) => {
                        return (e['id'] === event['id'])
                          ? newData
                          : e
                      }))
                  setCalendarEvents(newCalendarEvents)
                }}
              >
                更新
              </Button>
              <Button
                colorScheme={'red'}
                onClick={async () => {
                  await deleteEvent(event['id'])
                  const newCalendarEvents = calendarEvents
                    .map((eventsOneDay: EventData[]) => eventsOneDay
                      .filter((e: EventData) => e['id'] !== event['id']))
                  setCalendarEvents(newCalendarEvents)
                }}
              >
                削除
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    )
  }

  const CalendarTable = () => {

    const firstDay = getFirstSquareOfCalendar(new Date(calendarMonth.year, calendarMonth.month, 1))
    const listOfCalendarDays = getListOfCalendarDays(firstDay, calendarRowsNum)
    
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
            key={i}
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
          h={Math.floor((window.innerHeight - 50 - 20) / calendarRowsNum) + 'px'}
          key={i}
        >
        {Array(7).fill(0).map((_, j) =>
          // calendar square
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
              <Box textAlign='center' fontSize='sm'>
                {listOfCalendarDays[i * 7 + j].getDate()}
              </Box>

              {calendarEvents[i * 7 + j].map((event: EventData) => <CalendarEventButton event={event} key={event.id} />)}
            </VStack>
          </Flex>
        )}
        </Flex>
      )}
      </Box>
    )
  }


  const CalendarNavBar = () => {
    return (
      <Flex h='50px' alignItems={'center'} justifyContent={'space-between'}>
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
          <Text fontSize='3xl'>{calendarMonth.year}年{calendarMonth.month + 1}月</Text>
        </HStack>
        <Spacer />
      </Flex>
    )
  }

  return (
    <>
      <CalendarNavBar />
      <CalendarTable />
    </>
  )
}

export default Calendar