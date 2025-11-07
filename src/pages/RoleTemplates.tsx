import RoleTemplatesData from "@/components/data/RoleTemplatesData";
import { useState } from "react";
import AddRoleTemplate from "@/components/modals/add/AddRoleTemplate";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";
import AddButton from "@/components/UI/buttons/AddButton";

const RoleTemplates = () => {
  const [isOpen, setOpen] = useState(false);
  const { data, isLoading } = useAllRoleTemplatesQuery();
  const templates = data?.data?.templates ?? [];

  return (
    <>
      <AddButton onClick={() => setOpen(true)} text="Добавить" />
      <RoleTemplatesData templates={templates} isLoading={isLoading} />
      <AddRoleTemplate isOpen={isOpen} setOpen={setOpen} />
    </>
  );
};

export default RoleTemplates;
