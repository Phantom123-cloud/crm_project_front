import RoleTypesData from "@/components/data/RoleTypesData";
import AddRoleType from "@/components/modals/add/AddRoleType";
import RolesGuard from "@/components/layout/RolesGuard";
import { usePaginationControle } from "@/hooks/usePaginationControle";

const RoleTypes = () => {
  const { onChange, page, limit } = usePaginationControle();

  return (
    <RolesGuard access={"view_role_types"}>
      <AddRoleType page={page} limit={limit} />
      <RoleTypesData page={page} limit={limit} onChange={onChange} />
    </RolesGuard>
  );
};

export default RoleTypes;
