import { useState, useRef } from "react";
import {
  Button,
  Flex,
  Box,
  Spacer,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Popover,
  PopoverArrow,
  PopoverTrigger,
  PopoverContent,
  PopoverCloseButton,
  Checkbox,
} from "@chakra-ui/react";
import { EventData, UserData } from "./Type";
import { modifyEvent, deleteEvent } from "./API";

interface CalendarEventButtonProps {
  event: EventData;
  userData: UserData[];
  loadEvents: () => void;
}

const CalendarEventButton = ({
  event,
  userData,
  loadEvents,
}: CalendarEventButtonProps) => {
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
    await modifyEvent(newData);
    loadEvents();
  };

  const deleteButton = async () => {
    await deleteEvent(event.id);
    loadEvents();
  };

  return (
    <Popover placement="right" initialFocusRef={firstFieldRef}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>
            <Box
              as="button"
              bg={userData.filter((data) => data.id === event.user_id)[0].color}
              color="white"
              fontSize="sm"
              borderRadius="sm"
              w="97%"
            >
              {event.is_timed ? event.start_time.slice(0, -3) + " " : ""}
              {event.content}
            </Box>
          </PopoverTrigger>

          <PopoverContent boxShadow="lg" p={5}>
            <PopoverArrow />
            <PopoverCloseButton />

            <VStack spacing={3}>
              <FormControl>
                <FormLabel>User</FormLabel>
                <Select
                  onChange={(e) => {
                    setForm({ ...form, user: e.target.value });
                  }}
                  defaultValue={
                    userData.filter((e) => e.id === event.user_id)[0].name
                  }
                >
                  {userData.map((data) => (
                    <option key={data.id}>{data.name}</option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="changeform-datepicker">Date</FormLabel>
                <input
                  id="changeform-datepicker"
                  type="date"
                  defaultValue={event.start_date}
                  onChange={(e) => {
                    setForm({ ...form, date: e.target.value });
                  }}
                ></input>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="changeform-timepicker">
                  <Checkbox
                    defaultChecked={event.is_timed}
                    onChange={(e) => {
                      setForm({ ...form, is_timed: e.target.checked });
                    }}
                  >
                    View Time
                  </Checkbox>
                </FormLabel>
                <input
                  id="changeform-timepicker"
                  type="time"
                  defaultValue={event.start_time}
                  onChange={(e) => {
                    setForm({ ...form, time: e.target.value });
                  }}
                  disabled={!form.is_timed}
                ></input>
              </FormControl>

              <FormControl>
                <FormLabel>Content</FormLabel>
                <Input
                  defaultValue={event.content}
                  ref={firstFieldRef}
                  onChange={(e) => {
                    setForm({ ...form, content: e.target.value });
                  }}
                />
              </FormControl>

              <Flex w="full">
                <Button
                  colorScheme={"red"}
                  onClick={async () => {
                    await deleteButton();
                    onClose();
                  }}
                >
                  Delete
                </Button>
                <Spacer />
                <Button
                  colorScheme={"blue"}
                  onClick={async () => {
                    await updateButton();
                    onClose();
                  }}
                >
                  Save
                </Button>
              </Flex>
            </VStack>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default CalendarEventButton;
