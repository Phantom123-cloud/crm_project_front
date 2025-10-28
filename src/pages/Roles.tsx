import RolesData from "@/components/data/RolesData";
import { Button } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import AddRole from "@/components/modals/AddRole";
import { useAllRolesTypeQuery } from "@/app/services/roles-type/rolesTypeApi";

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
    <div>
      <div className="flex justify-end mb-10">
        <Button
          color="cyan"
          variant="solid"
          icon={<PlusOutlined />}
          onClick={() => setOpen(true)}
        >
          Добавить
        </Button>
      </div>
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
    </div>
  );
};

export default Roles;
