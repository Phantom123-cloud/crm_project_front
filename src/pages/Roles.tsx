import RolesData from "@/components/data/RolesData";
import AddRole from "@/components/modals/add/AddRole";
import RolesGuard from "@/components/layout/RolesGuard";
import { usePaginationState } from "@/hooks/usePaginationState";

const Roles = () => {
  const { onChange, page, limit } = usePaginationState();

  return (
    <RolesGuard access={"view_roles"}>
      <AddRole page={page} limit={limit} />
      <RolesData page={page} limit={limit} onChange={onChange} />
    </RolesGuard>
  );
};

export default Roles;
