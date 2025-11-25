import RolesData from "@/components/data/RolesData";
import { useEffect, useState } from "react";
import { useLazyAllRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";
import AddRole from "@/components/modals/add/AddRole";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";

const Roles = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const [triggerData, { data }] = useLazyAllRolesTypeQuery();

  const roleTypes = (data?.data ?? []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  useEffect(() => {
    if (isOpen) {
      triggerData();
    }
  }, [isOpen]);

  return (
    <RolesGuard access={"view_roles"}>
      <RolesGuard access={"create_roles"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddRole
          isOpen={isOpen}
          page={page}
          limit={limit}
          setOpen={setOpen}
          roleTypes={roleTypes}
        />
      </RolesGuard>
      <RolesData
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
      />
    </RolesGuard>
  );
};

export default Roles;
