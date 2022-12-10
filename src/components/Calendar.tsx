import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
  Box,
  Spacer,
  HStack,
  Text,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  SettingsIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { CalendarMonth, EventData, UserData } from "./Type";
import { fetchEvent, fetchUserData } from "./API";
import { CalendarNavbar } from "./Navbar";
import { DateTime } from "luxon";
import CalendarTable from "./CalendarTable";

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

  const firstDay: DateTime = DateTime.local(
    calendarMonth.year,
    calendarMonth.month,
    1
  );
  const firstSquare: DateTime = firstDay.minus({ days: firstDay.weekday });
  const calendarDays: DateTime[] = Array(7 * calendarRowsNum)
    .fill(0)
    .map((_, i) => firstSquare.plus({ days: i }));

  const loadEvents = () => {
    fetchEvent(firstSquare, 7 * calendarRowsNum).then((r) =>
      setCalendarEvents(r)
    );
  };

  const loadUser = () => {
    fetchUserData().then((res) => {
      setUserData(res);
    });
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
    // finish loading of user data before registering event
    (async () => {
      if (userData.length === 0) {
        console.log("fetchUserData!");
        setUserData(await fetchUserData());
      }

      // setTimeout(loadEvents, 2000);
      loadEvents();
    })();
  }, [calendarMonth, calendarRowsNum]);

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
          <VStack spacing={0}>
            <Text fontWeight="bold" fontSize="sm">
              {calendarMonth.year}年
            </Text>
            <Text fontWeight="bold" fontSize="2xl">
              {calendarMonth.month}月
            </Text>
          </VStack>
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
      <CalendarTable
        innerHeight={innerHeight}
        userData={userData}
        calendarEvents={calendarEvents}
        weekName={weekName}
        calendarRowsNum={calendarRowsNum}
        weekNameHeight={weekNameHeight}
        calendarDays={calendarDays}
        loadEvents={loadEvents}
      />
    </>
  );
};

export default Calendar;
