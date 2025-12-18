import RolesData from "@/components/data/RolesData";
import AddRole from "@/components/modals/add/AddRole";
import RolesGuard from "@/components/layout/RolesGuard";
import { usePaginationControle } from "@/hooks/usePaginationControle";

const Roles = () => {
  const { onChange, page, limit } = usePaginationControle();

  return (
    <RolesGuard access={"view_roles"}>
      <AddRole page={page} limit={limit} />
      <RolesData page={page} limit={limit} onChange={onChange} />
    </RolesGuard>
  );
};

export default Roles;
