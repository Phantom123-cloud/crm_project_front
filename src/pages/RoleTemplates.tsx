import RoleTemplatesData from "@/components/data/RoleTemplatesData";
import { useState } from "react";
import AddRoleTemplate from "@/components/modals/add/AddRoleTemplate";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";
import AddButton from "@/components/UI/buttons/AddButton";
import RolesGuard from "@/components/layout/RolesGuard";

const RoleTemplates = () => {
  const [isOpen, setOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const { data, isLoading } = useAllRoleTemplatesQuery({ page, limit });

  const templates = data?.data?.templates ?? [];

  return (
    <RolesGuard access={"view_templates"}>
      <RolesGuard access={"create_templates"}>
        <AddButton onClick={() => setOpen(true)} text="Добавить" />
        <AddRoleTemplate
          isOpen={isOpen}
          setOpen={setOpen}
          page={page}
          limit={limit}
        />
      </RolesGuard>

      <RoleTemplatesData
        templates={templates}
        isLoading={isLoading}
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        total={data?.data?.total ?? 1}
      />
    </RolesGuard>
  );
};

export default RoleTemplates;
