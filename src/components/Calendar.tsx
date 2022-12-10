import { useState, useEffect, useRef } from "react";
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
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  Checkbox,
  Badge,
} from "@chakra-ui/react";
import { useQuery } from "react-query";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
  AddIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import {
  CalendarDate,
  CalendarMonth,
  EventData,
  NewEventData,
  UserData,
} from "./Type";
import {
  fetchEvent,
  createEvent,
  modifyEvent,
  deleteEvent,
  fetchUserData,
  toDateString,
} from "./API";
import { CalendarNavbar, navbarHeight } from "./Navbar";
import { DateTime } from "luxon";

const Calendar = () => {
  const today = DateTime.now();
  const weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekNameHeight = 20;

  const [calendarMonth, setCalendarMonth] = useState<CalendarMonth>({
    year: today.year,
    month: today.month,
  });
  const [calendarRowsNum, setCalendarRowsNum] = useState<number>(5);
  const [calendarEvents, setCalendarEvents] = useState<EventData[]>([]);
  const [userData, setUserData] = useState<UserData[]>([] as UserData[]);
  const [innerHeight, setInnerHeight] = useState<number>(window.innerHeight);

  const getFirstSquareOfCalendar = (month: CalendarMonth): DateTime => {
    const firstDay = DateTime.local(month.year, month.month, 1);
    const firstSquare = firstDay.minus({ days: firstDay.weekday });
    return firstSquare;
  };

  const isToday = (date: DateTime): Boolean =>
    date.year === today.year &&
    date.month === today.month &&
    date.day === today.day;

  const getListOfCalendarDays = (
    date: DateTime,
    calendarRowsNum: number
  ): DateTime[] => {
    const listOfDays = Array(7 * calendarRowsNum)
      .fill(0)
      .map((_, i) => date.plus({ days: i }));
    return listOfDays;
  };

  const loadEvents = async () => {
    const firstSquare = getFirstSquareOfCalendar(calendarMonth);
    await fetchEvent(
      firstSquare.year,
      firstSquare.month,
      firstSquare.day,
      7 * calendarRowsNum
    ).then((r) => setCalendarEvents(r));
  };

  const setNextCalnedarMonth = () => {
    setCalendarMonth((prev: CalendarMonth) => {
      const nextMonth = DateTime.local(prev.year, prev.month, 1).plus({
        months: 1,
      });
      return { year: nextMonth.year, month: nextMonth.month };
    });
  };

  const setPrevCalendarMonth = () => {
    setCalendarMonth((prev: CalendarMonth) => {
      const nextMonth = DateTime.local(prev.year, prev.month, 1).minus({
        months: 1,
      });
      return { year: nextMonth.year, month: nextMonth.month };
    });
  };

  useEffect(() => {
    window.onresize = () => setInnerHeight(window.innerHeight);
  }, []);

  useEffect(() => {
    const firstSquare = getFirstSquareOfCalendar(calendarMonth);

    // finish loading of user data before registering event
    // Promise.all([
    //   fetchUserData().then((r) => setUserData(r)),
    //   fetchEvent(
    //     firstSquare.year,
    //     firstSquare.month,
    //     firstSquare.day,
    //     7 * calendarRowsNum
    //   ),
    // ]).then((r) => setCalendarEvents(r[1]));

    fetchUserData().then((r) => setUserData(r));
    fetchEvent(
      firstSquare.year,
      firstSquare.month,
      firstSquare.day,
      7 * calendarRowsNum
    ).then((r) => setCalendarEvents(r));
  }, [calendarMonth, calendarRowsNum]);

  const CalendarEventButton: React.FC<{ event: EventData }> = ({ event }) => {
    interface Form {
      date: string;
      time: string;
      user: string;
      content: string;
      is_timed: boolean;
    }

    const [form, setForm] = useState<Form>({
      date: event.start_date,
      time: event.start_time,
      user: userData.filter((e) => e.id === event.user_id)[0].name,
      content: event.content,
      is_timed: event.is_timed,
    });

    useEffect(() => {}, []);

    const firstFieldRef = useRef(null); // ref to event box dom

    const updateButton = async () => {
      const user_id = userData.filter((e) => e.name === form.user)[0].id;
      const newData: EventData = {
        id: event.id,
        start_date: form.date,
        start_time: form.time,
        content: form.content,
        is_timed: form.is_timed,
        user_id: user_id,
      };
      await modifyEvent(newData);
      loadEvents();
    };

    const deleteButton = async () => {
      await deleteEvent(event.id);
      loadEvents();
    };

    return (
      <Popover placement="right" initialFocusRef={firstFieldRef}>
        <PopoverTrigger>
          <Box
            as="button"
            bg={userData.filter((data) => data.id === event.user_id)[0].color}
            color="white"
            fontSize="sm"
            borderRadius="sm"
            w="97%"
          >
            {event.is_timed ? event.start_time.slice(0, -3) + " " : ""}
            {event.content}
          </Box>
        </PopoverTrigger>

        <PopoverContent boxShadow="lg" p={5}>
          <PopoverArrow />
          <PopoverCloseButton />

          <VStack spacing={3}>
            <FormControl>
              <FormLabel>User</FormLabel>
              <Select
                onChange={(e) => {
                  setForm({ ...form, user: e.target.value });
                }}
                defaultValue={
                  userData.filter((e) => e.id === event.user_id)[0].name
                }
              >
                {userData.map((data) => (
                  <option key={data.id}>{data.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="changeform-datepicker">Date</FormLabel>
              <input
                id="changeform-datepicker"
                type="date"
                defaultValue={event.start_date}
                onChange={(e) => {
                  setForm({ ...form, date: e.target.value });
                }}
              ></input>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="changeform-timepicker">
                <Checkbox
                  defaultChecked={event.is_timed}
                  onChange={(e) => {
                    setForm({ ...form, is_timed: e.target.checked });
                  }}
                >
                  View Time
                </Checkbox>
              </FormLabel>
              <input
                id="changeform-timepicker"
                type="time"
                defaultValue={event.start_time}
                onChange={(e) => {
                  setForm({ ...form, time: e.target.value });
                }}
                disabled={!form.is_timed}
              ></input>
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Input
                defaultValue={event.content}
                ref={firstFieldRef}
                onChange={(e) => {
                  setForm({ ...form, content: e.target.value });
                }}
              />
            </FormControl>

            <Flex w="full">
              <Button colorScheme={"red"} onClick={deleteButton}>
                Delete
              </Button>
              <Spacer />
              <Button colorScheme={"blue"} onClick={updateButton}>
                Save
              </Button>
            </Flex>
          </VStack>
        </PopoverContent>
      </Popover>
    );
  };

  type Props = {
    children: React.ReactNode;
    defaultDate: DateTime;
  };

  const EventAddButton: React.VFC<Props> = ({ children, defaultDate }) => {
    interface Form {
      date: string;
      time: string;
      user: string;
      content: string;
      is_timed: boolean;
    }

    const firstFieldRef = useRef(null);

    const [form, setForm] = useState<Form>({
      date: defaultDate.toFormat("YYYY-MM-DD"),
      time: "00:00:00",
      user: "",
      content: "",
      is_timed: false,
    });

    const isReadyToSubmit = (): boolean => {
      return form.date !== "" && form.user !== "" && form.content !== "";
    };

    const addButton = async () => {
      const user_id = userData.filter((e) => e.name === form.user)[0].id;
      const newData: NewEventData = {
        start_date: form.date,
        start_time: form.time,
        content: form.content,
        is_timed: form.is_timed,
        user_id: user_id,
      };
      await createEvent(newData);
      loadEvents();
    };

    return (
      <Popover placement="right" initialFocusRef={firstFieldRef}>
        <PopoverTrigger>{children}</PopoverTrigger>

        <PopoverContent boxShadow="dark-lg" p={5}>
          <PopoverArrow />
          <PopoverCloseButton />

          <VStack spacing={4}>
            <FormControl>
              <FormLabel>User</FormLabel>
              <Select
                onChange={(e) => setForm({ ...form, user: e.target.value })}
              >
                <option hidden>Select user</option>
                {userData.map((data) => (
                  <option key={data.id}>{data.name}</option>
                ))}
              </Select>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="changeform-datepicker">Date</FormLabel>
              <input
                id="changeform-datepicker"
                type="date"
                defaultValue={toDateString(defaultDate)}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
              ></input>
            </FormControl>

            <FormControl>
              <FormLabel htmlFor="changeform-timepicker">
                <Checkbox
                  defaultChecked={false}
                  onChange={(e) =>
                    setForm({ ...form, is_timed: e.target.checked })
                  }
                >
                  View Time
                </Checkbox>
              </FormLabel>
              <input
                id="changeform-timepicker"
                type="time"
                defaultValue={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                disabled={!form.is_timed}
              ></input>
            </FormControl>

            <FormControl>
              <FormLabel>Content</FormLabel>
              <Input
                ref={firstFieldRef}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </FormControl>

            <ButtonGroup w="full" display="flex" justifyContent="flex-end">
              <Button
                colorScheme={"blue"}
                onClick={addButton}
                disabled={!isReadyToSubmit()}
              >
                Add
              </Button>
            </ButtonGroup>
          </VStack>
        </PopoverContent>
      </Popover>
    );
  };

  const CalendarTable = () => {
    const firstDay = getFirstSquareOfCalendar(calendarMonth);
    const listOfCalendarDays = getListOfCalendarDays(firstDay, calendarRowsNum);

    return (
      <Box>
        <Flex h={weekNameHeight + "px"}>
          {weekName.map((w, i) => (
            <Flex
              grow={1}
              basis={1}
              justifyContent="center"
              borderLeft={i === 0 ? "1px" : undefined}
              borderRight="1px"
              borderTop="1px"
              borderColor="#dadce0"
              key={w}
            >
              <Box fontSize="sm">{w}</Box>
            </Flex>
          ))}
        </Flex>
        {Array(calendarRowsNum)
          .fill(0)
          .map((_, i) => (
            // calendar row
            <Flex
              h={
                Math.floor(
                  (innerHeight - (navbarHeight + weekNameHeight)) /
                    calendarRowsNum -
                    1
                ) + "px"
              }
              key={i}
            >
              {Array(7)
                .fill(0)
                .map((_, j) => (
                  // calendar cell

                  <Flex
                    grow={1}
                    basis={1}
                    borderLeft={j === 0 ? "1px" : undefined}
                    borderRight="1px"
                    borderBottom="1px"
                    borderColor="#dadce0"
                    key={j}
                  >
                    <VStack w="100%" spacing="0.5">
                      {/* num of day and today badge */}
                      <HStack>
                        <Box textAlign="center" fontSize="sm">
                          {listOfCalendarDays[i * 7 + j].day}
                        </Box>
                        {isToday(listOfCalendarDays[i * 7 + j]) ? (
                          <Badge colorScheme="red">Today</Badge>
                        ) : (
                          ""
                        )}
                      </HStack>

                      {/* event buttons */}
                      {calendarEvents
                        .filter(
                          (event: EventData) =>
                            event.start_date ===
                            toDateString(listOfCalendarDays[i * 7 + j])
                        )
                        .map((event: EventData) => (
                          <CalendarEventButton event={event} key={event.id} />
                        ))}

                      {/* add event trigger space */}
                      <EventAddButton
                        defaultDate={listOfCalendarDays[i * 7 + j]}
                      >
                        <Box h="100%" w="100%">
                          {" "}
                        </Box>
                      </EventAddButton>
                    </VStack>
                  </Flex>
                ))}
            </Flex>
          ))}
      </Box>
    );
  };

  const LocalCalendarNavbar = () => {
    return (
      <CalendarNavbar>
        <HStack spacing={8}>
          <ButtonGroup variant="outline" spacing="3">
            <IconButton
              onClick={setPrevCalendarMonth}
              icon={<ChevronLeftIcon />}
              colorScheme="blue"
              aria-label="go to previous month"
            />
            <IconButton
              onClick={setNextCalnedarMonth}
              icon={<ChevronRightIcon />}
              colorScheme="blue"
              aria-label="go to next month"
            />
          </ButtonGroup>
          <Text fontWeight="bold" fontSize="3xl">
            {calendarMonth.year} - {calendarMonth.month}
          </Text>
          <Button
            onClick={() => {
              setCalendarMonth({
                year: today.year,
                month: today.month,
              });
            }}
            colorScheme="blue"
          >
            Today
          </Button>
        </HStack>

        <Spacer />

        <HStack spacing={8} pr={4}>
          <Box>
            <EventAddButton
              defaultDate={DateTime.local(
                calendarMonth.year,
                calendarMonth.month,
                1
              )}
            >
              <Button leftIcon={<AddIcon />} colorScheme="teal">
                Add Event
              </Button>
            </EventAddButton>
          </Box>
          <Link to="/setting">
            <Button
              leftIcon={<SettingsIcon />}
              colorScheme="blue"
              variant="outline"
            >
              Setting
            </Button>
          </Link>
        </HStack>
      </CalendarNavbar>
    );
  };

  return (
    <>
      <LocalCalendarNavbar />
      <CalendarTable />
    </>
  );
};

export default Calendar;
