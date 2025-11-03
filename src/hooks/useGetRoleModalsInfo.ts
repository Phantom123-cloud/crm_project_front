import { useState, type Dispatch, type SetStateAction } from "react";

type TModal = "UPDATE" | "DELETE";

type TitemInfo = {
  id: string;
  name?: string;
  modalType: TModal;
  descriptions?: string;
};

export const useGetRoleModalsInfo = (
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  const [itemInfo, setItemInfo] = useState<TitemInfo>({
    id: "",
    name: "",
    descriptions: "",
    modalType: "DELETE",
  });

  const getInfo = (item: { id: string; name: string }, modalType: TModal) => {
    setItemInfo((prev) => ({ ...prev, ...item, modalType }));
    setOpen(true);
  };

  return { getInfo, itemInfo };
};
