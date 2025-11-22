import RoleTypesData from "@/components/data/RoleTypesData";
import { useState } from "react";
import AddRoleType from "@/components/modals/add/AddRoleType";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";

const RoleTypes = () => {
  const [isOpen, setOpen] = useState(false);

  return (
    <RolesGuard access={"view_role_types"}>
      <RolesGuard access={"create_role_types"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddRoleType isOpen={isOpen} setOpen={setOpen} />
      </RolesGuard>

      <RoleTypesData />
    </RolesGuard>
  );
};

export default RoleTypes;
