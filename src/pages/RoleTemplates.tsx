import RoleTemplatesData from "@/components/data/RoleTemplatesData";
import { useState } from "react";
import AddRoleTemplate from "@/components/modals/add/AddRoleTemplate";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";

const RoleTemplates = () => {
  const [isOpen, setOpen] = useState(false);
  const { data, isLoading } = useAllRoleTemplatesQuery();
  const templates = data?.data?.templates ?? [];

  return (
    <RolesGuard access={"view_templates"}>
      <RolesGuard access={"create_templates"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddRoleTemplate isOpen={isOpen} setOpen={setOpen} />
      </RolesGuard>

      <RoleTemplatesData templates={templates} isLoading={isLoading} />
    </RolesGuard>
  );
};

export default RoleTemplates;
