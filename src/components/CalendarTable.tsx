import { Flex, Box, HStack, VStack, Badge } from "@chakra-ui/react";
import { UseMutateFunction } from "@tanstack/react-query";
import { DateTime } from "luxon";
import { EventData, UserData, NewEventData } from "./Type";
import { toDateString, isToday } from "./API";
import { navbarHeight } from "./Navbar";
import CalendarEventButton from "./CalendarEventButton";
import CalendarEventAddButton from "./CalendarEventAddButton";

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
                      {isToday(calendarDays[i * 7 + j]) ? (
                        <Badge colorScheme="red">
                          {calendarDays[i * 7 + j].day}
                        </Badge>
                      ) : (
                        <Box textAlign="center" fontSize="sm">
                          {calendarDays[i * 7 + j].day}
                        </Box>
                      )}
                    </HStack>

                    {/* event buttons */}
                    {calendarEvents
                      .filter(
                        (event: EventData) =>
                          event.start_date ===
                          toDateString(calendarDays[i * 7 + j])
                      )
                      .map((event: EventData) => (
                        <CalendarEventButton
                          userData={userData}
                          event={event}
                          key={event.id}
                          mutateModifyEvent={mutateModifyEvent}
                          mutateDeleteEvent={mutateDeleteEvent}
                        />
                      ))}

                    {/* add event trigger space */}
                    <CalendarEventAddButton
                      defaultDate={calendarDays[i * 7 + j]}
                      mutateCreateEvent={mutateCreateEvent}
                      userData={userData}
                    >
                      <Box h="100%" w="100%">
                        {" "}
                      </Box>
                    </CalendarEventAddButton>
                  </VStack>
                </Flex>
              ))}
          </Flex>
        ))}
    </Box>
  );
};

export default CalendarTable;
