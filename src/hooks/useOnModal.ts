import { useState } from "react";

export const useOnModal = () => {
  const [isOpen, setOpen] = useState(false);

  const onOpen = () => {
    setOpen(true);
  };

  const onCancel = () => {
    setOpen(false);
  };

  return { onOpen, onCancel, isOpen};
};
