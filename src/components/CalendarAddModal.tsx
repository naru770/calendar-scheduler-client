import { useState, useRef, useEffect } from "react";
import { UseMutateFunction } from "@tanstack/react-query";
import { DateTime } from "luxon";
import {
  Button,
  Flex,
  Spacer,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Select,
  Checkbox,
  Modal,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalCloseButton,
  ModalFooter,
  ModalOverlay,
} from "@chakra-ui/react";
import { EventData, UserData, NewEventData } from "./Type";
import { toDateString } from "./API";
import { useToast } from "@chakra-ui/react";

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

  const [form, setForm] = useState<Form>({
    date: toDateString(defaultDate),
    time: "00:00",
    user: "",
    content: "",
    is_timed: false,
  });

  useEffect(() => {
    setForm({
      date: toDateString(defaultDate),
      time: "00:00",
      user: "",
      content: "",
      is_timed: false,
    });
  }, [defaultDate]);

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

  const toast = useToast();

  return (
    <Modal isOpen={isOpenAddForm} onClose={onCloseAddForm}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                onChange={(e) => setForm({ ...form, content: e.target.value })}
              />
            </FormControl>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Flex w="full">
            <Spacer />
            <Button
              colorScheme={"blue"}
              onClick={async () => {
                await addButton();
                toast({
                  title: "Event added.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                onCloseAddForm();
              }}
              disabled={!isReadyToSubmit()}
            >
              Add
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CalendarAddModal;
