import { useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { DateTime } from "luxon";
import type { CalendarMonth, EventData, UserData } from "./Type";
import { fetchEvent, fetchUserData, createEvent, modifyEvent, deleteEvent } from "./API";
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

  const firstDayOfMonth: DateTime = DateTime.local(calendarMonth.year, calendarMonth.month, 1);
  const firstSquare: DateTime = firstDayOfMonth.minus({
    days: firstDayOfMonth.weekday % 7,
  });
  const calendarDays: DateTime[] = Array(7 * calendarRowsNum)
    .fill(0)
    .map((_, i) => firstSquare.plus({ days: i }));

  const { data: userData } = useQuery({
    queryKey: ["userData"],
    queryFn: fetchUserData,
  });
  const { data: calendarEvents } = useQuery({
    queryKey: ["calendarEvents", firstSquare, calendarRowsNum],
    queryFn: () => fetchEvent(firstSquare, calendarRowsNum * 7),
  });

  const { mutate: mutateModifyEvent } = useMutation({
    mutationFn: modifyEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });

  const { mutate: mutateCreateEvent } = useMutation({
    mutationFn: createEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
    },
  });

  const { mutate: mutateDeleteEvent } = useMutation({
    mutationFn: deleteEvent,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["calendarEvents"] });
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
        calendarEvents={calendarEvents === undefined || userData === undefined ? [] : calendarEvents}
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
