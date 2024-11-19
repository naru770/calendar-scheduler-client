import { useState } from "react";
import { Flex, Box, HStack, VStack, Badge, Text, useDisclosure } from "@chakra-ui/react";
import type { UseMutateFunction } from "@tanstack/react-query";
import { DateTime } from "luxon";
import type { EventData, UserData, NewEventData } from "./Type";
import { toDateString, isToday } from "./API";
import { navbarHeight } from "./Navbar";
import CalendarEditModal from "./CalendarEditModal";
import CalendarAddModal from "./CalendarAddModal";

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
    <Box>
      <Flex h={`${weekNameHeight}px`}>
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
          // biome-ignore lint/suspicious/noArrayIndexKey: カレンダーの行配列は静的であるため
          <Flex h={`${Math.floor((innerHeight - (navbarHeight + weekNameHeight)) / calendarRowsNum - 1)}px`} key={i}>
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
                  // biome-ignore lint/suspicious/noArrayIndexKey: カレンダーの列配列は静的であるため
                  key={j}
                >
                  <VStack w="100%" spacing="0.5">
                    {/* num of day and today badge */}
                    <HStack>
                      {isToday(calendarDays[i * 7 + j]) ? (
                        <Badge colorScheme="red">{calendarDays[i * 7 + j].day}</Badge>
                      ) : (
                        <Box textAlign="center" fontSize="sm">
                          {calendarDays[i * 7 + j].day}
                        </Box>
                      )}
                    </HStack>

                    {/* event buttons */}
                    {calendarEvents
                      .filter((event: EventData) => event.start_date === toDateString(calendarDays[i * 7 + j]))
                      .map((event: EventData) => (
                        <Box
                          as="button"
                          bg={userData.filter((data) => data.id === event.user_id)[0].color}
                          color="white"
                          fontSize={{ base: "12px", md: "sm" }}
                          borderRadius="sm"
                          w="97%"
                          onClick={() => {
                            setEditFormData(event);
                            onOpenEditForm();
                          }}
                          key={event.id}
                        >
                          <Text noOfLines={2} lineHeight={1.25}>
                            {event.is_timed ? `${event.start_time.slice(0, -3)} ` : ""}
                            {event.content}
                          </Text>
                        </Box>
                      ))}

                    {/* add event trigger space */}
                    <Box
                      h="100%"
                      w="100%"
                      onClick={() => {
                        setDefaultDate(
                          DateTime.local(
                            calendarDays[i * 7 + j].year,
                            calendarDays[i * 7 + j].month,
                            calendarDays[i * 7 + j].day,
                          ),
                        );
                        onOpenAddForm();
                      }}
                    >
                      {" "}
                    </Box>
                  </VStack>
                </Flex>
              ))}
          </Flex>
        ))}
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
    </Box>
  );
};

export default CalendarTable;
