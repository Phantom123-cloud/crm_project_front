import RoleTypesData from "@/components/data/RoleTypesData";
import { useState } from "react";
import AddRoleType from "@/components/modals/add/AddRoleType";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";

const RoleTypes = () => {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  return (
    <RolesGuard access={"view_role_types"}>
      <RolesGuard access={"create_role_types"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddRoleType
          isOpen={isOpen}
          setOpen={setOpen}
          page={page}
          limit={limit}
        />
      </RolesGuard>

      <RoleTypesData
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
      />
    </RolesGuard>
  );
};

export default RoleTypes;
