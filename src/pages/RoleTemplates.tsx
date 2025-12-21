import RoleTemplatesData from "@/components/data/RoleTemplatesData";
import AddRoleTemplate from "@/components/modals/add/AddRoleTemplate";
import RolesGuard from "@/components/layout/RolesGuard";
import { usePaginationState } from "@/hooks/usePaginationState";

const RoleTemplates = () => {
  const { onChange, page, limit } = usePaginationState();

  return (
    <RolesGuard access={"view_templates"}>
      <AddRoleTemplate page={page} limit={limit} />
      <RoleTemplatesData page={page} limit={limit} onChange={onChange} />
    </RolesGuard>
  );
};

export default RoleTemplates;
