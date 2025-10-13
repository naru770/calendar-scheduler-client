import { create } from "zustand";

type State = {
  isOpen: boolean;
  message: string;
  duration: number;
};

type Actions = {
  open: (input: Partial<Omit<State, "open">>) => void;
  close: () => void;
};

const DEFAULT_SNACKBAR_STATE: State = {
  isOpen: false,
  message: "",
  duration: 3000,
};

export const useStore = create<State & Actions>((set) => ({
  ...DEFAULT_SNACKBAR_STATE,
  open: (input) => set({ ...DEFAULT_SNACKBAR_STATE, ...input, isOpen: true }),
  close: () => set({ isOpen: false }),
}));
