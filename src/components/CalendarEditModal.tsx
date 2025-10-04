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
import dayjs from "dayjs";
import "dayjs/locale/ja";
import type { UseMutateFunction } from "@tanstack/react-query";
import { useEffect, useId, useRef, useState } from "react";
import * as Snackbar from "./Snackbar";
import type { EventData, UserData } from "./Type";

dayjs.locale("ja");

interface CalendarEditModalProps {
  isOpenEditForm: boolean;
  onCloseEditForm: () => void;
  event: EventData;
  userData: UserData[];
  mutateModifyEvent: UseMutateFunction<void, unknown, EventData, unknown>;
  mutateDeleteEvent: UseMutateFunction<void, unknown, string, unknown>;
}

const CalendarEditModal = ({
  isOpenEditForm,
  onCloseEditForm,
  event,
  userData,
  mutateModifyEvent,
  mutateDeleteEvent,
}: CalendarEditModalProps) => {
  interface Form {
    date: string;
    time: string;
    user: string;
    content: string;
    is_timed: boolean;
  }

  const [form, setForm] = useState<Form>({
    date: event.start_date,
    time: event.start_time,
    user: userData.filter((e) => e.id === event.user_id)[0].name,
    content: event.content,
    is_timed: event.is_timed,
  });

  useEffect(() => {
    setForm({
      date: event.start_date,
      time: event.start_time,
      user: userData.filter((e) => e.id === event.user_id)[0].name,
      content: event.content,
      is_timed: event.is_timed,
    });
  }, [event, userData]);

  const firstFieldRef = useRef(null); // ref to event box dom

  const updateButton = async () => {
    const user_id = userData.filter((e) => e.name === form.user)[0].id;
    const newData: EventData = {
      id: event.id,
      start_date: form.date,
      start_time: form.time,
      content: form.content,
      is_timed: form.is_timed,
      user_id: user_id,
    };
    mutateModifyEvent(newData);
  };

  const deleteButton = async () => {
    mutateDeleteEvent(event.id);
  };

  const openSnackbar = Snackbar.useStore((state) => state.open);

  const userSelectId = useId();

  return (
    <Dialog open={isOpenEditForm} onClose={onCloseEditForm} fullWidth>
      <DialogTitle>Edit Event</DialogTitle>
      <DialogContent>
        <Box sx={{ paddingTop: 2 }}>
          <Stack spacing={4}>
            <FormControl sx={{ width: "100%" }}>
              <InputLabel id={userSelectId}>User</InputLabel>
              <Select
                labelId={userSelectId}
                value={form.user}
                label="User"
                onChange={(e) => {
                  setForm({ ...form, user: e.target.value });
                }}
                defaultValue={userData.filter((e) => e.id === event.user_id)[0].name}
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
            <FormControl>
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={event.is_timed}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      setForm({ ...form, is_timed: e.target.checked });
                    }}
                  />
                }
                label="View Time"
              />
              <input
                type="time"
                defaultValue={event.start_time}
                onChange={(e) => {
                  setForm({ ...form, time: e.target.value });
                }}
                disabled={!form.is_timed}
              />
            </FormControl>
            <TextField
              label="Content"
              defaultValue={event.content}
              ref={firstFieldRef}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setForm({ ...form, content: e.target.value });
              }}
            />
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="outlined"
          color="error"
          onClick={async () => {
            await deleteButton();
            openSnackbar({
              message: "Event deleted.",
            });
            onCloseEditForm();
          }}
        >
          Delete
        </Button>
        <Button
          variant="contained"
          color="primary"
          onClick={async () => {
            await updateButton();
            openSnackbar({
              message: "Event updated.",
            });
            onCloseEditForm();
          }}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CalendarEditModal;
