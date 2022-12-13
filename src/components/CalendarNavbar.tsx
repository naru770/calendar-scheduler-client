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
    </Navbar>
  );
};

export default CalendarNavbar;
