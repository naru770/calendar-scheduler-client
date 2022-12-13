import { useState, useEffect } from "react";
import {
  Button,
  ButtonGroup,
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
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { CalendarMonth, EventData, UserData } from "./Type";
import {
  fetchEvent,
  fetchUserData,
  createEvent,
  modifyEvent,
  deleteEvent,
} from "./API";
import CalendarTable from "./CalendarTable";
import { queryClient } from "../index";
import CalendarNavbar from "./CalendarNavbar";

const Calendar = () => {
  const today = DateTime.now();
  const weekName = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const weekNameHeight = 20;

  const [calendarMonth, setCalendarMonth] = useState<CalendarMonth>({
    year: today.year,
    month: today.month,
  });
  const [calendarRowsNum, setCalendarRowsNum] = useState<number>(5);
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

  const { data: userData } = useQuery(["userData"], fetchUserData);
  const { data: calendarEvents } = useQuery(
    ["calendarEvents", firstSquare, calendarRowsNum],
    () => fetchEvent(firstSquare, calendarRowsNum * 7)
  );

  const { mutate: mutateModifyEvent } = useMutation(modifyEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["calendarEvents"]);
    },
  });

  const { mutate: mutateCreateEvent } = useMutation(createEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["calendarEvents"]);
    },
  });

  const { mutate: mutateDeleteEvent } = useMutation(deleteEvent, {
    onSuccess: () => {
      queryClient.invalidateQueries(["calendarEvents"]);
    },
  });

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

  return (
    <>
      <CalendarNavbar
        setNextCalnedarMonth={setNextCalnedarMonth}
        setPrevCalendarMonth={setPrevCalendarMonth}
        today={today}
        calendarMonth={calendarMonth}
        setCalendarMonth={setCalendarMonth}
      />
      <CalendarTable
        innerHeight={innerHeight}
        userData={userData === undefined ? [] : userData}
        calendarEvents={calendarEvents === undefined ? [] : calendarEvents}
        weekName={weekName}
        calendarRowsNum={calendarRowsNum}
        weekNameHeight={weekNameHeight}
        calendarDays={calendarDays}
        mutateCreateEvent={mutateCreateEvent}
        mutateModifyEvent={mutateModifyEvent}
        mutateDeleteEvent={mutateDeleteEvent}
      />
    </>
  );
};

export default Calendar;
