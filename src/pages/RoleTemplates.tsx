import RoleTemplatesData from "@/components/data/RoleTemplatesData";
import { Button } from "antd";
import { useState } from "react";
import { PlusOutlined } from "@ant-design/icons";
import AddRoleTemplate from "@/components/modals/add/AddRoleTemplate";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";

const RoleTemplates = () => {
  const [isOpen, setOpen] = useState(false);
  const { data, isLoading } = useAllRoleTemplatesQuery();

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
      <RoleTemplatesData
        templates={data?.data?.templates ?? []}
        isLoading={isLoading}
      />
      <AddRoleTemplate
        isOpen={isOpen}
        setOpen={setOpen}
        roles={data?.data?.roles ?? []}
      />
    </div>
  );
};

export default RoleTemplates;
