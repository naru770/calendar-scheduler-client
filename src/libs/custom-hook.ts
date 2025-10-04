import React from "react";

export function useDisclosure(initialState = false) {
  const [isOpen, setIsOpen] = React.useState(initialState);
  const onOpen = React.useCallback(() => setIsOpen(true), []);
  const onClose = React.useCallback(() => setIsOpen(false), []);
  return { isOpen, onOpen, onClose };
}
