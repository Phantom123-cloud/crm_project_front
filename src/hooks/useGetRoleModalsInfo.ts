import { useState, type Dispatch, type SetStateAction } from "react";

type TModal = "UPDATE" | "DELETE";

type TRoleTypeInfo = {
  id: string;
  name: string;
  descriptions?: string;
  modalType: TModal;
};

export const useGetRoleModalsInfo = (
  setOpen: Dispatch<SetStateAction<boolean>>
) => {
  const [roleTypeInfo, setRoleTypeInfo] = useState<TRoleTypeInfo>({
    id: "",
    name: "",
    descriptions: "",
    modalType: "DELETE",
  });

  const getInfo = (item: { id: string; name: string }, modalType: TModal) => {
    setRoleTypeInfo((prev) => ({ ...prev, ...item, modalType }));
    setOpen(true);
  };

  return { getInfo, roleTypeInfo };
};
