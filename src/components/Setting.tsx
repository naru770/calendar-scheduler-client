import { Add, CalendarMonth, Delete, Edit } from "@mui/icons-material";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDisclosure } from "../libs/custom-hook";
import { createUserData, deleteUserData, fetchUserData, modifyUserData } from "./API";
import { Navbar } from "./Navbar";
import type { NewUserData, UserData } from "./Type";

const Setting = () => {
  const [userData, setUserData] = useState<UserData[]>([]);
  const [newUserData, setNewUserData] = useState<NewUserData>({
    name: "",
    color: "",
  });
  const signupForm = useDisclosure();
  const editForm = useDisclosure();
  const deleteUserAlert = useDisclosure();
  const [deleteUserId, setDeleteUserId] = useState<string>("");
  const [editFormData, setEditFormData] = useState<UserData>({
    id: "",
    name: "",
    color: "",
  });

  const loadUserData = useCallback(async () => {
    setUserData(await fetchUserData());
  }, []);

  useEffect(() => {
    loadUserData();
  }, [loadUserData]);

  return (
    <>
      <Navbar justifyContent="right">
        <IconButton onClick={signupForm.onOpen} color="primary">
          <Add />
        </IconButton>

        <Link to="/">
          <IconButton color="primary">
            <CalendarMonth />
          </IconButton>
        </Link>
      </Navbar>

      <Container maxWidth="md">
        <Box sx={{ marginTop: 4, marginBottom: 4 }}>
          <Typography variant="h4">User Administration</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Username</TableCell>
                <TableCell>Color</TableCell>
                <TableCell />
              </TableRow>
            </TableHead>
            <TableBody>
              {userData.map((userData: UserData) => (
                <TableRow key={userData.id}>
                  <TableCell>{userData.id.slice(0, 4)}...</TableCell>
                  <TableCell>{userData.name}</TableCell>
                  <TableCell>{userData.color}</TableCell>
                  <TableCell>
                    <Box>
                      <IconButton
                        color="primary"
                        onClick={() => {
                          editForm.onOpen();
                          setEditFormData(userData);
                        }}
                      >
                        <Edit />
                      </IconButton>

                      <IconButton
                        onClick={() => {
                          setDeleteUserId(userData.id);
                          deleteUserAlert.onOpen();
                        }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Container>

      <Dialog open={editForm.isOpen} onClose={editForm.onClose} fullWidth maxWidth="sm">
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            <TextField
              label="Username"
              defaultValue={editFormData.name}
              onChange={(e) => {
                setEditFormData((data) => ({
                  ...data,
                  name: e.target.value,
                }));
              }}
            />
            <TextField
              label="Color"
              defaultValue={editFormData.color}
              onChange={(e) => {
                setEditFormData((data) => ({
                  ...data,
                  color: e.target.value,
                }));
              }}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={editForm.onClose}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              await modifyUserData(editFormData);
              loadUserData();
              editForm.onClose();
            }}
          >
            Submit
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={deleteUserAlert.isOpen} onClose={deleteUserAlert.onClose} fullWidth maxWidth="sm">
        <DialogTitle>Warning</DialogTitle>
        <DialogContent>
          {userData.find((user) => user.id === deleteUserId)?.name}{" "}
          のユーザーとイベントは全て削除されます。よろしいですか？
        </DialogContent>
        <DialogActions>
          <Button onClick={deleteUserAlert.onClose}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={async () => {
              await deleteUserData(deleteUserId);
              loadUserData();
              deleteUserAlert.onClose();
            }}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={signupForm.isOpen} onClose={signupForm.onClose} fullWidth maxWidth="sm">
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ marginTop: 2 }}>
            <TextField
              label="Username"
              onChange={(e) => {
                setNewUserData((data) => ({ ...data, name: e.target.value }));
              }}
            />
            <TextField label="Color" onChange={(e) => setNewUserData((data) => ({ ...data, color: e.target.value }))} />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={signupForm.onClose}>Cancel</Button>
          <Button
            color="primary"
            variant="contained"
            onClick={async () => {
              await createUserData(newUserData);
              loadUserData();
              signupForm.onClose();
            }}
          >
            Register
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Setting;
