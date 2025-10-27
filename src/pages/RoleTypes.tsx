import RolesTypeData from "@/components/data/RolesTypeData";
import { Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useState } from "react";
import AddRoleType from "@/components/modals/AddRoleType";

const RoleTypes = () => {
  const [isOpen, setOpen] = useState(false);

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
      <RolesTypeData />
      <AddRoleType isOpen={isOpen} setOpen={setOpen} />
    </div>
  );
};

export default RoleTypes;
