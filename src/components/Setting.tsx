import { useState, useEffect } from "react";
import {
  Box,
  Heading,
  TableContainer,
  Table,
  Thead,
  Tbody,
  Th,
  Tr,
  Td,
  Button,
  ButtonGroup,
  useDisclosure,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalOverlay,
  ModalHeader,
  FormControl,
  FormLabel,
  Input,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
  Spacer,
  HStack,
  Container,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AddIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  deleteUserData,
  fetchUserData,
  createUserData,
  modifyUserData,
} from "./API";
import { UserData, NewUserData } from "./Type";
import { CalendarNavbar } from "./Navbar";

const Setting = () => {
  const [userData, setUserData] = useState<UserData[]>([] as UserData[]);
  const [newUserData, setNewUserData] = useState<NewUserData>({
    name: "",
    color: "",
  });
  const signupForm = useDisclosure();
  const [openAlertId, setOpenAlertId] = useState<string>(""); // 削除警告を開いているユーザID
  const [openEditModalId, setOpenEditModalId] = useState<string>(""); // 編集フォームを開いているユーザID
  const [updatedUserData, setUpdatedUserData] = useState<UserData>({
    id: "",
    name: "",
    color: "",
  });

  const onOpenAlert = (id: string) => setOpenAlertId(id);
  const onCloseAlert = () => setOpenAlertId("");

  const onOpenEditModal = (id: string) => setOpenEditModalId(id);
  const onCloseEditModal = () => setOpenEditModalId("");

  const loadUserData = () => {
    fetchUserData().then((r) => setUserData(r));
  };

  useEffect(() => {
    loadUserData();
  }, []);

  return (
    <>
      <CalendarNavbar>
        <HStack spacing={8} pr={4}>
          <Spacer />
          <Button
            colorScheme="teal"
            leftIcon={<AddIcon />}
            onClick={signupForm.onOpen}
          >
            Add User
          </Button>

          <Modal isOpen={signupForm.isOpen} onClose={signupForm.onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Register Form</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <FormControl pb="6">
                  <FormLabel>Username</FormLabel>
                  <Input
                    onChange={(e) => {
                      setNewUserData({ ...newUserData, name: e.target.value });
                    }}
                  />
                </FormControl>

                <FormControl>
                  <FormLabel>Color</FormLabel>
                  <Input
                    onChange={(e) => {
                      setNewUserData({ ...newUserData, color: e.target.value });
                    }}
                  />
                </FormControl>
              </ModalBody>

              <ModalFooter>
                <ButtonGroup>
                  <Button
                    colorScheme="blue"
                    onClick={() => {
                      createUserData(newUserData).then((e) => {
                        loadUserData();
                        signupForm.onClose();
                      });
                    }}
                  >
                    Register
                  </Button>
                  <Button onClick={signupForm.onClose}>Cancel</Button>
                </ButtonGroup>
              </ModalFooter>
            </ModalContent>
          </Modal>

          <Link to="/">
            <Button
              colorScheme="blue"
              variant="outline"
              leftIcon={<CalendarIcon />}
            >
              Calendar
            </Button>
          </Link>
        </HStack>
      </CalendarNavbar>

      <Container maxW="container.md">
        <Box pt="8" pb="8">
          <Heading color="blue.800">User Administration</Heading>
        </Box>
        <TableContainer>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>ID</Th>
                <Th>Username</Th>
                <Th>Color</Th>
                <Th></Th>
              </Tr>
            </Thead>
            <Tbody>
              {userData.map((user_data: UserData, i) => (
                <Tr key={user_data.id}>
                  <Td>{user_data.id.slice(0, 4)}...</Td>
                  <Td>{user_data.name}</Td>
                  <Td>{user_data.color}</Td>
                  <Td>
                    <ButtonGroup>
                      <Button
                        colorScheme="teal"
                        onClick={() => {
                          onOpenEditModal(user_data.id);
                          setUpdatedUserData(user_data);
                        }}
                      >
                        Edit
                      </Button>

                      <Modal
                        isOpen={user_data.id === openEditModalId}
                        onClose={onCloseEditModal}
                      >
                        <ModalOverlay />
                        <ModalContent>
                          <ModalHeader>Edit Form</ModalHeader>
                          <ModalCloseButton />
                          <ModalBody>
                            <FormControl pb="6">
                              <FormLabel>Username</FormLabel>
                              <Input
                                defaultValue={user_data.name}
                                onChange={(e) => {
                                  setUpdatedUserData({
                                    ...updatedUserData,
                                    name: e.target.value,
                                  });
                                }}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Color</FormLabel>
                              <Input
                                defaultValue={user_data.color}
                                onChange={(e) => {
                                  setUpdatedUserData({
                                    ...updatedUserData,
                                    color: e.target.value,
                                  });
                                }}
                              />
                            </FormControl>
                          </ModalBody>

                          <ModalFooter>
                            <ButtonGroup>
                              <Button
                                colorScheme="blue"
                                onClick={() => {
                                  modifyUserData(updatedUserData).then((e) => {
                                    onCloseEditModal();
                                    loadUserData();
                                  });
                                }}
                              >
                                Save
                              </Button>
                              <Button onClick={onCloseEditModal}>Cancel</Button>
                            </ButtonGroup>
                          </ModalFooter>
                        </ModalContent>
                      </Modal>

                      <Button
                        colorScheme="red"
                        onClick={() => onOpenAlert(user_data.id)}
                      >
                        Del
                      </Button>

                      <AlertDialog
                        isOpen={user_data.id === openAlertId}
                        onClose={onCloseAlert}
                        leastDestructiveRef={undefined}
                        autoFocus={false}
                        isCentered
                      >
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader>Warning</AlertDialogHeader>

                            <AlertDialogBody>
                              Are you sure all {user_data.name}'s events will be
                              deleted?
                            </AlertDialogBody>

                            <AlertDialogFooter>
                              <ButtonGroup>
                                <Button onClick={onCloseAlert}>Cancel</Button>
                                <Button
                                  colorScheme="red"
                                  onClick={() => {
                                    deleteUserData(user_data.id).then(() =>
                                      loadUserData()
                                    );
                                  }}
                                >
                                  Delete
                                </Button>
                              </ButtonGroup>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialogOverlay>
                      </AlertDialog>
                    </ButtonGroup>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </Container>
    </>
  );
};

export default Setting;
