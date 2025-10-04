import { Close } from "@mui/icons-material";
import { IconButton, Snackbar } from "@mui/material";
import { useStore } from "./store";

export const Component = () => {
  const { isOpen, close, message, duration } = useStore();
  const action = (
    <>
      <IconButton size="small" aria-label="close" color="inherit" onClick={close}>
        <Close />
      </IconButton>
    </>
  );
  return <Snackbar message={message} open={isOpen} autoHideDuration={duration} onClose={close} action={action} />;
};
