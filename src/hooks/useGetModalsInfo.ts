import { useState, type Dispatch, type SetStateAction } from "react";

type TModal = "UPDATE" | "DELETE";

type TitemInfo = {
  id: string;
  name?: string;
  modalType: TModal;
  descriptions?: string;
};

export const useGetModalsInfo = (
  setOpen: Dispatch<SetStateAction<boolean>>,
  desc: boolean = true
) => {
  const [itemInfo, setItemInfo] = useState<TitemInfo>({
    id: "",
    name: "",
    ...(desc && { descriptions: "" }),
    modalType: "DELETE",
  });

  const getInfo = (item: { id: string; name: string }, modalType: TModal) => {
    setItemInfo((prev) => ({ ...prev, ...item, modalType }));
    setOpen(true);
  };

  return { getInfo, itemInfo };
};
