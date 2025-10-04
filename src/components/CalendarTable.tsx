import { Box, Chip, Stack, Typography } from "@mui/material";
import type { UseMutateFunction } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { useState } from "react";
import { useDisclosure } from "../libs/custom-hook";
import { isToday, toDateString } from "./API";
import CalendarAddModal from "./CalendarAddModal";
import CalendarEditModal from "./CalendarEditModal";
import { navbarHeight } from "./Navbar";
import type { EventData, NewEventData, UserData } from "./Type";

interface CalendarTableProps {
  calendarDays: DateTime[];
  weekNameHeight: number;
  innerHeight: number;
  weekName: string[];
  calendarRowsNum: number;
  calendarEvents: EventData[];
  userData: UserData[];
  mutateCreateEvent: UseMutateFunction<void, unknown, NewEventData, unknown>;
  mutateModifyEvent: UseMutateFunction<void, unknown, EventData, unknown>;
  mutateDeleteEvent: UseMutateFunction<void, unknown, string, unknown>;
}

const CalendarTable = ({
  calendarDays,
  weekNameHeight,
  weekName,
  calendarRowsNum,
  calendarEvents,
  userData,
  innerHeight,
  mutateCreateEvent,
  mutateModifyEvent,
  mutateDeleteEvent,
}: CalendarTableProps) => {
  const { isOpen: isOpenEditForm, onOpen: onOpenEditForm, onClose: onCloseEditForm } = useDisclosure();
  const { isOpen: isOpenAddForm, onOpen: onOpenAddForm, onClose: onCloseAddForm } = useDisclosure();

  const [editFormData, setEditFormData] = useState<EventData | undefined>(undefined);
  const [defaultDate, setDefaultDate] = useState<DateTime | undefined>(undefined);

  return (
    <>
      <Box sx={{ display: "flex", height: `${weekNameHeight}px` }}>
        {weekName.map((w, i) => (
          <Box
            sx={{
              display: "flex",
              flexGrow: 1,
              flexBasis: 1,
              borderLeft: i === 0 ? "1px" : undefined,
              borderRight: "1px",
              borderBottom: "1px",
              borderColor: "#dadce0",
              justifyContent: "center",
              alignItems: "center",
            }}
            key={w}
          >
            <Box fontSize="sm">{w}</Box>
          </Box>
        ))}
      </Box>
      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        border="1px solid #e8e8e8"
        sx={{ height: innerHeight - navbarHeight - weekNameHeight }}
      >
        {Array.from({ length: calendarRowsNum * 7 }).map((_, i) => (
          <Stack
            sx={{
              width: "100%",
              flex: 1,
              minWidth: 0,
              height: (innerHeight - navbarHeight - weekNameHeight) / calendarRowsNum - 1,
            }}
            border="1px solid #e8e8e8"
            key={crypto.randomUUID()}
          >
            {/* num of day and today badge */}
            {isToday(calendarDays[i]) ? (
              <Box textAlign="center" fontSize="sm">
                <Chip label={calendarDays[i].day} />
              </Box>
            ) : (
              <Box textAlign="center" fontSize="sm">
                {calendarDays[i].day}
              </Box>
            )}
            {/* event buttons */}
            {calendarEvents
              .filter((event: EventData) => event.start_date === toDateString(calendarDays[i]))
              .map((event: EventData) => (
                <Box
                  sx={{
                    maxWidth: "100%",
                    cursor: "pointer",
                    backgroundColor: userData.filter((data) => data.id === event.user_id)[0].color,
                    color: "white",
                    borderRadius: "4px",
                    width: "97%",
                    marginTop: "2px",
                  }}
                  onClick={() => {
                    setEditFormData(event);
                    onOpenEditForm();
                  }}
                  key={event.id}
                >
                  <Typography
                    noWrap
                    sx={{ fontSize: { xs: "12px", sm: "14px" }, overflow: "hidden", textOverflow: "ellipsis" }}
                  >
                    {event.is_timed ? `${event.start_time.slice(0, -3)} ` : ""}
                    {event.content}
                  </Typography>
                </Box>
              ))}

            {/* add event trigger space */}
            <Box
              sx={{
                width: "100%",
                height: "100%",
              }}
              onClick={() => {
                setDefaultDate(DateTime.local(calendarDays[i].year, calendarDays[i].month, calendarDays[i].day));
                onOpenAddForm();
              }}
            >
              {" "}
            </Box>
          </Stack>
        ))}
      </Box>

      {editFormData !== undefined && userData !== undefined ? (
        <CalendarEditModal
          isOpenEditForm={isOpenEditForm}
          onCloseEditForm={onCloseEditForm}
          event={editFormData}
          userData={userData}
          mutateModifyEvent={mutateModifyEvent}
          mutateDeleteEvent={mutateDeleteEvent}
        />
      ) : undefined}

      {defaultDate !== undefined && userData !== undefined ? (
        <CalendarAddModal
          isOpenAddForm={isOpenAddForm}
          onCloseAddForm={onCloseAddForm}
          userData={userData}
          defaultDate={defaultDate}
          mutateCreateEvent={mutateCreateEvent}
        />
      ) : undefined}
    </>
  );
};

export default CalendarTable;
