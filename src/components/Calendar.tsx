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
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  AddIcon
} from '@chakra-ui/icons'
import { Link } from 'react-router-dom'
import axios from 'axios'


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

  interface NewEventData {
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

  const navbarHeight = 60
  const baseUrl = 'http://localhost:8000'

  const today = new Date()
  const weekName = ["日", "月", "火", "水", "木", "金", "土"]

  const [calendarMonth, setCalendarMonth] = useState<CalendarMonth>({year: today.getFullYear(), month: today.getMonth()})
  const [calendarRowsNum, setCalendarRowsNum] = useState<number>(5)
  const [calendarEvents, setCalendarEvents] = useState<EventData[][]>(Array(7 * calendarRowsNum).fill([]) as EventData[][])
  const [userData, setUserData] = useState<UserData[]>([] as UserData[])
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight)


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

  function loadEvents() {
    const calendarFirstDay = getFirstSquareOfCalendar(new Date(calendarMonth.year, calendarMonth.month, 1))
    axios(`${baseUrl}/event/${calendarFirstDay.getFullYear()}/${calendarFirstDay.getMonth() + 1}/${calendarFirstDay.getDate()}`, {
      params: {days: 7 * calendarRowsNum}
    })
      .then((r) => r.data)
      .then((r) => setCalendarEvents(r['events']))
  }

  async function updateEvent(event: EventData) {
    await axios.put(`${baseUrl}/event`, event)
  }

  async function deleteEvent(eventId: number) {
    await axios.delete(`${baseUrl}/event/${eventId}`)
  }

  async function addEvent(event: NewEventData) {
    await axios.post(`${baseUrl}/event`, event)
  }

  useEffect(() => {
    window.onresize = () => setInnerHeight(window.innerHeight)
  }, [])

  // ユーザー情報取得
  useEffect(() => {
    axios(`${baseUrl}/user`)
      .then((r) => r.data)
      .then((r) => setUserData(r['users']))
  }, [])

  // イベント情報取得
  useEffect(() => {
    loadEvents()
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

    const updateButton = async () => {
      const start_datetime = date + 'T' + time
      const user_id = userData.filter((e) => (e.name === user))[0]['id']
      const newData: EventData = {
        id: event.id,
        start_datetime: start_datetime,
        content: content,
        is_timed: isTimed,
        user_id: user_id,
      }
      await updateEvent(newData)
      loadEvents()
    }

    const deleteButton = async () => {
      await deleteEvent(event['id'])
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
                onClick={updateButton}
              >
                更新
              </Button>
              <Button
                colorScheme={'red'}
                onClick={deleteButton}
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
      is_timed: true,
    })

    const isReadyToSubmit = (): boolean => {
      return (
        form.user !== '' &&
        form.date !== '' &&
        form.content !== ''
      )
    }

    const addButton = async () => {
      const start_datetime = form.date + 'T' + form.time
      const user_id = userData.filter((e) => (e.name === form.user))[0]['id']
      const newData: NewEventData = {
        start_datetime: start_datetime,
        content: form.content,
        is_timed: form.is_timed,
        user_id: user_id,
      }
      await addEvent(newData)
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
          >イベントを追加</Button>
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
                onChange={(e) => setForm({...form, user: e.target.value})}
              >
                <option hidden>ユーザーを選択してください</option>
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
                  onChange={(e) => setForm({...form, date: e.target.value})}
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
                  defaultValue={form.time}
                  onChange={(e) => setForm({...form, time: e.target.value})}
                ></input>
              </Box>
            </Box>
            <Box pb={6}>
              <Checkbox
                defaultChecked={false}
                onChange={(e) => setForm({...form, is_timed: e.target.checked})}
              >時間表示</Checkbox>
            </Box>
            <FormControl>
              <FormLabel>イベント内容</FormLabel>
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
                追加
              </Button>
            </PopoverFooter>
          </PopoverContent>
        </Portal>
      </Popover>
    )
  }


  const CalendarNavbar = () => {
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
          <Text fontSize='3xl' >{calendarMonth.year} 年 {calendarMonth.month + 1} 月</Text>

          <EventAddButton />
        </HStack>

        <Spacer />

        <HStack spacing={8} pr={4}>

        <Link to='/setting'>
          <Button
            leftIcon={<SettingsIcon />}
            colorScheme='blue'
            variant='outline'
          >
            設定
          </Button>
        </Link>

        </HStack>

      </Flex>
    )
  }

  return (
    <>
      <CalendarNavbar />
      <CalendarTable />
    </>
  )
}

export default Calendar