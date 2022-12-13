import { useState, useRef } from "react";
import {
  Button,
  ButtonGroup,
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
import { NewEventData, UserData, EventData } from "./Type";
import { createEvent, toDateString } from "./API";
import { DateTime } from "luxon";
import { UseMutateFunction } from "@tanstack/react-query";

interface EventAddButtonProps {
  userData: UserData[];
  children: React.ReactNode;
  defaultDate: DateTime;
  mutateCreateEvent: UseMutateFunction<void, unknown, NewEventData, unknown>;
}

const CalendarEventAddButton = ({
  children,
  defaultDate,
  mutateCreateEvent,
  userData,
}: EventAddButtonProps) => {
  interface Form {
    date: string;
    time: string;
    user: string;
    content: string;
    is_timed: boolean;
  }

  const firstFieldRef = useRef(null);

  const [form, setForm] = useState<Form>({
    date: toDateString(defaultDate),
    time: "00:00:00",
    user: "",
    content: "",
    is_timed: false,
  });

  const isReadyToSubmit = (): boolean => {
    return form.date !== "" && form.user !== "" && form.content !== "";
  };

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

  return (
    <Popover placement="right" initialFocusRef={firstFieldRef}>
      {({ isOpen, onClose }) => (
        <>
          <PopoverTrigger>{children}</PopoverTrigger>

          <PopoverContent boxShadow="dark-lg" p={5}>
            <PopoverArrow />
            <PopoverCloseButton />

            <VStack spacing={4}>
              <FormControl>
                <FormLabel>User</FormLabel>
                <Select
                  onChange={(e) => setForm({ ...form, user: e.target.value })}
                >
                  <option hidden>Select user</option>
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
                  defaultValue={toDateString(defaultDate)}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                ></input>
              </FormControl>

              <FormControl>
                <FormLabel htmlFor="changeform-timepicker">
                  <Checkbox
                    defaultChecked={false}
                    onChange={(e) =>
                      setForm({ ...form, is_timed: e.target.checked })
                    }
                  >
                    View Time
                  </Checkbox>
                </FormLabel>
                <input
                  id="changeform-timepicker"
                  type="time"
                  defaultValue={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                  disabled={!form.is_timed}
                ></input>
              </FormControl>

              <FormControl>
                <FormLabel>Content</FormLabel>
                <Input
                  ref={firstFieldRef}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </FormControl>

              <ButtonGroup w="full" display="flex" justifyContent="flex-end">
                <Button
                  colorScheme={"blue"}
                  onClick={async () => {
                    await addButton();
                    onClose();
                  }}
                  disabled={!isReadyToSubmit()}
                >
                  Add
                </Button>
              </ButtonGroup>
            </VStack>
          </PopoverContent>
        </>
      )}
    </Popover>
  );
};

export default CalendarEventAddButton;
