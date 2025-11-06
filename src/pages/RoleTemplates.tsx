import RoleTemplatesData from "@/components/data/RoleTemplatesData";
import { useState } from "react";
import AddRoleTemplate from "@/components/modals/add/AddRoleTemplate";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";
import AddButton from "@/components/UI/buttons/AddButton";

const RoleTemplates = () => {
  const [isOpen, setOpen] = useState(false);
  const { data, isLoading } = useAllRoleTemplatesQuery();
  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <RoleTemplatesData
        templates={data?.data?.templates ?? []}
        isLoading={isLoading}
        roles={data?.data?.roles ?? []}
      />
      <AddRoleTemplate
        isOpen={isOpen}
        setOpen={setOpen}
        roles={data?.data?.roles ?? []}
      />
    </>
  );
};

export default RoleTemplates;
