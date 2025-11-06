import RolesData from "@/components/data/RolesData";
import { useState } from "react";
import { useAllRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";
import AddRole from "@/components/modals/add/AddRole";
import AddButton from "@/components/UI/buttons/AddButton";

const Roles = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [isOpen, setOpen] = useState(false);
  const { data } = useAllRolesTypeQuery();

  const roleTypes = (data?.data ?? []).map((item) => {
    return {
      value: item.id,
      label: item.name,
    };
  });

  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <RolesData
        page={page}
        setPage={setPage}
        limit={limit}
        setLimit={setLimit}
        roleTypes={roleTypes}
      />
      <AddRole
        isOpen={isOpen}
        page={page}
        limit={limit}
        setOpen={setOpen}
        roleTypes={roleTypes}
      />
    </>
  );
};

export default Roles;
