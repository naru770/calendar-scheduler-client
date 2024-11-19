import { useState, useRef, useEffect } from "react";
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
import type { EventData, UserData } from "./Type";
import type { UseMutateFunction } from "@tanstack/react-query";
import { useToast } from "@chakra-ui/react";

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

  const toast = useToast();

  return (
    <Modal isOpen={isOpenEditForm} onClose={onCloseEditForm}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={3}>
            <FormControl>
              <FormLabel>User</FormLabel>
              <Select
                onChange={(e) => {
                  setForm({ ...form, user: e.target.value });
                }}
                defaultValue={userData.filter((e) => e.id === event.user_id)[0].name}
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
              />
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
              />
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
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Flex w="full">
            <Button
              colorScheme={"red"}
              onClick={async () => {
                await deleteButton();
                toast({
                  title: "Event deleted.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                onCloseEditForm();
              }}
            >
              Delete
            </Button>
            <Spacer />
            <Button
              colorScheme={"blue"}
              onClick={async () => {
                await updateButton();
                toast({
                  title: "Event updated.",
                  status: "success",
                  duration: 3000,
                  isClosable: true,
                });
                onCloseEditForm();
              }}
            >
              Save
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default CalendarEditModal;
