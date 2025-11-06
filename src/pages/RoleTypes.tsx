import RoleTypesData from "@/components/data/RoleTypesData";
import { useState } from "react";
import AddRoleType from "@/components/modals/add/AddRoleType";
import AddButton from "@/components/UI/buttons/AddButton";

const RoleTypes = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <RoleTypesData />
      <AddRoleType isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default RoleTypes;
