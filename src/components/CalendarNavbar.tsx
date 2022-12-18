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
  StarIcon,
} from "@chakra-ui/icons";
import { Link } from "react-router-dom";
import { CalendarMonth } from "./Type";

import { Navbar } from "./Navbar";
import { DateTime } from "luxon";

interface CalendarNavbarProps {
  setPrevCalendarMonth: () => void;
  setNextCalnedarMonth: () => void;
  today: DateTime;
  calendarMonth: CalendarMonth;
  setCalendarMonth: React.Dispatch<React.SetStateAction<CalendarMonth>>;
}

const CalendarNavbar = ({
  setPrevCalendarMonth,
  setNextCalnedarMonth,
  today,
  calendarMonth,
  setCalendarMonth,
}: CalendarNavbarProps) => {
  return (
    <Navbar>
      <HStack spacing={{ base: 2, md: 8 }}>
        <IconButton
          variant="outline"
          onClick={setPrevCalendarMonth}
          icon={<ChevronLeftIcon />}
          colorScheme="blue"
          aria-label="go to previous month"
        />

        <VStack spacing={0}>
          <Text fontWeight="bold" fontSize="sm">
            {calendarMonth.year}年
          </Text>
          <Text fontWeight="bold" fontSize={{ base: "sm", lg: "2xl" }}>
            {calendarMonth.month}月
          </Text>
        </VStack>

        <IconButton
          variant="outline"
          onClick={setNextCalnedarMonth}
          icon={<ChevronRightIcon />}
          colorScheme="blue"
          aria-label="go to next month"
        />

        <IconButton
          onClick={() => {
            setCalendarMonth({
              year: today.year,
              month: today.month,
            });
          }}
          variant="outline"
          icon={<StarIcon />}
          colorScheme="blue"
          aria-label="go to setting"
        />
      </HStack>

      <Spacer />

      <HStack spacing={8} pr={4}>
        <Link to="/setting">
          <IconButton
            variant="outline"
            icon={<SettingsIcon />}
            colorScheme="blue"
            aria-label="go to setting"
          />
        </Link>
      </HStack>
    </Navbar>
  );
};

export default CalendarNavbar;
