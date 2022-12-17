import { useState, useEffect, useRef } from "react";
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
  IconButton,
} from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { AddIcon, CalendarIcon, EditIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  deleteUserData,
  fetchUserData,
  createUserData,
  modifyUserData,
} from "./API";
import { UserData, NewUserData } from "./Type";
import { Navbar } from "./Navbar";

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

  const cancelRef = useRef<HTMLButtonElement>(null);

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
      <Navbar>
        <HStack spacing={8} pr={4}>
          <Spacer />
          <IconButton
            onClick={signupForm.onOpen}
            icon={<AddIcon />}
            colorScheme="blue"
            aria-label="go to next month"
          />

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
            <IconButton
              variant="outline"
              icon={<CalendarIcon />}
              colorScheme="blue"
              aria-label="go to next month"
            />
          </Link>
        </HStack>
      </Navbar>

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
              {userData.map((userData: UserData, i) => (
                <Tr key={userData.id}>
                  <Td>{userData.id.slice(0, 4)}...</Td>
                  <Td>{userData.name}</Td>
                  <Td>{userData.color}</Td>
                  <Td>
                    <ButtonGroup>
                      <IconButton
                        onClick={() => {
                          onOpenEditModal(userData.id);
                          setUpdatedUserData(userData);
                        }}
                        icon={<EditIcon />}
                        colorScheme="teal"
                        aria-label="go to next month"
                      />

                      <Modal
                        isOpen={userData.id === openEditModalId}
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
                                defaultValue={userData.name}
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
                                defaultValue={userData.color}
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

                      <IconButton
                        onClick={() => onOpenAlert(userData.id)}
                        icon={<DeleteIcon />}
                        colorScheme="red"
                        aria-label="go to next month"
                      />

                      <AlertDialog
                        isOpen={userData.id === openAlertId}
                        onClose={onCloseAlert}
                        leastDestructiveRef={cancelRef}
                        autoFocus={false}
                        isCentered
                      >
                        <AlertDialogOverlay>
                          <AlertDialogContent>
                            <AlertDialogHeader>Warning</AlertDialogHeader>

                            <AlertDialogBody>
                              Are you sure all {userData.name}'s events will be
                              deleted?
                            </AlertDialogBody>

                            <AlertDialogFooter>
                              <ButtonGroup>
                                <Button onClick={onCloseAlert} ref={cancelRef}>
                                  Cancel
                                </Button>
                                <Button
                                  colorScheme="red"
                                  onClick={() => {
                                    deleteUserData(userData.id).then(() =>
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
