import { ChevronLeft, ChevronRight, Settings } from "@mui/icons-material";
import { Box, Button, IconButton, Stack, Typography } from "@mui/material";
import type { DateTime } from "luxon";
import { Link } from "react-router-dom";

import { Navbar } from "./Navbar";
import type { CalendarMonth } from "./Type";

interface CalendarNavbarProps {
  setPrevCalendarMonth: () => void;
  setNextCalendarMonth: () => void;
  today: DateTime;
  calendarMonth: CalendarMonth;
  setCalendarMonth: React.Dispatch<React.SetStateAction<CalendarMonth>>;
}

const CalendarNavbar = ({
  setPrevCalendarMonth,
  setNextCalendarMonth,
  today,
  calendarMonth,
  setCalendarMonth,
}: CalendarNavbarProps) => {
  return (
    <Navbar justifyContent="space-between">
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Stack direction="row" spacing={0}>
          <IconButton onClick={setPrevCalendarMonth} color="primary">
            <ChevronLeft />
          </IconButton>
          <IconButton onClick={setNextCalendarMonth} color="primary">
            <ChevronRight />
          </IconButton>
        </Stack>

        <Typography variant="h5" sx={{ marginLeft: 2, width: "9rem" }}>
          {calendarMonth.year}年 {calendarMonth.month}月
        </Typography>

        <Button
          color="primary"
          variant="outlined"
          sx={{ marginLeft: 2 }}
          onClick={() => {
            setCalendarMonth({
              year: today.year,
              month: today.month,
            });
          }}
        >
          今日
        </Button>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Link to="/setting">
          <IconButton color="primary">
            <Settings />
          </IconButton>
        </Link>
      </Box>
    </Navbar>
  );
};

export default CalendarNavbar;
