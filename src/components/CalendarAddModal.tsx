import {
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import type { UseMutateFunction } from "@tanstack/react-query";
import dayjs from "dayjs";
import "dayjs/locale/ja";
import type { DateTime } from "luxon";
import { useEffect, useId, useRef, useState } from "react";
import { toDateString } from "./API";
import * as Snackbar from "./Snackbar";
import type { NewEventData, UserData } from "./Type";

interface CalendarAddModalProps {
  isOpenAddForm: boolean;
  onCloseAddForm: () => void;
  userData: UserData[];
  defaultDate: DateTime;
  mutateCreateEvent: UseMutateFunction<void, unknown, NewEventData, unknown>;
}

const CalendarAddModal = ({
  isOpenAddForm,
  onCloseAddForm,
  userData,
  defaultDate,
  mutateCreateEvent,
}: CalendarAddModalProps) => {
  interface Form {
    date: string;
    time: string;
    user: string;
    content: string;
    is_timed: boolean;
  }

  const openSnackbar = Snackbar.useStore((state) => state.open);

  const [form, setForm] = useState<Form>({
    date: toDateString(defaultDate),
    time: "00:00",
    user: userData[0]?.name ?? "",
    content: "",
    is_timed: false,
  });

  useEffect(() => {
    setForm({
      date: toDateString(defaultDate),
      time: "00:00",
      user: userData[0]?.name ?? "",
      content: "",
      is_timed: false,
    });
  }, [defaultDate, userData]);

  const isReadyToSubmit = (): boolean => {
    return form.date !== "" && form.user !== "" && form.content !== "";
  };

  const firstFieldRef = useRef(null); // ref to event box dom

  const addButton = async () => {
    const user_id = userData.filter((e) => e.name === form.user)[0].id;
    const newData: NewEventData = {
      start_date: form.date,
      start_time: form.time,
      content: form.content,
      is_timed: form.is_timed,
      user_id: user_id,
    };
    mutateCreateEvent(newData);
  };

  const useSelectLabelId = useId();

  return (
    <Dialog open={isOpenAddForm} onClose={onCloseAddForm} fullWidth maxWidth="sm">
      <DialogTitle>Add Event</DialogTitle>
      <DialogContent>
        <Box sx={{ paddingTop: 2 }}>
          <Stack spacing={4}>
            <FormControl>
              <InputLabel id={useSelectLabelId}>User</InputLabel>
              <Select
                labelId={useSelectLabelId}
                label="Select user"
                defaultValue={userData[0]?.name ?? ""}
                onChange={(e) => {
                  if (typeof e.target.value !== "string") {
                    return;
                  }
                  setForm({ ...form, user: e.target.value });
                }}
              >
                {userData.map((data) => (
                  <MenuItem key={data.id} value={data.name}>
                    {data.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs} dateFormats={{ year: "YYYY年" }}>
              <DatePicker
                label="Date"
                format="YYYY-MM-DD"
                value={dayjs(form.date)}
                onChange={(pickerValue) => {
                  const stringValue = pickerValue?.format("YYYY-MM-DD");
                  if (stringValue) {
                    setForm({ ...form, date: stringValue });
                  }
                }}
              />
            </LocalizationProvider>
            <Box>
              <FormControlLabel
                control={<Checkbox onChange={(e) => setForm({ ...form, is_timed: e.target.checked })} />}
                label="View Time"
              />
              <input
                type="time"
                defaultValue={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
                disabled={!form.is_timed}
              />
            </Box>

            <TextField
              label="Content"
              ref={firstFieldRef}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button variant="text" onClick={onCloseAddForm}>
          Cancel
        </Button>
        <Button
          variant="contained"
          onClick={async () => {
            await addButton();
            openSnackbar({
              message: "Event Added",
            });
            onCloseAddForm();
          }}
          disabled={!isReadyToSubmit()}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarAddModal;
