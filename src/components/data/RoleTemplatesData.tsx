import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetRoleModalsInfo } from "@/hooks/useGetRoleModalsInfo";
import { useState } from "react";
import type {
  RolesObj,
  Templates,
} from "@/app/services/role-templates/roleTemplatesTypes";
import DeleteRoleTemplate from "../modals/delete/DeleteRoleRoleTemplate";
import UpdateRoleTemplate from "../modals/update/UpdateRoleTemplate";

type Props = {
  templates: Templates[];
  roles: RolesObj[];
  isLoading: boolean;
};
const RoleTemplatesData: React.FC<Props> = ({
  templates,
  isLoading,
  roles,
}) => {
  const [isOpen, setOpen] = useState(false);
  const { getInfo, itemInfo } = useGetRoleModalsInfo(setOpen);
  const dataSource = (templates ?? []).map((item) => {
    return {
      key: item.id,
      template: item.name,
      actions: (
        <div className="flex gap-5">
          <Button
            color="primary"
            variant="outlined"
            icon={<EditOutlined />}
            onClick={() => getInfo(item, "UPDATE")}
            size="small"
          >
            изменить
          </Button>
          <Button
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
            onClick={() => getInfo(item, "DELETE")}
            size="small"
          >
            удалить
          </Button>
        </div>
      ),
    };
  });
  const columns = [
    {
      title: "Шаблон",
      dataIndex: "template",
      key: "template",
    },

    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const { name, id, modalType } = itemInfo;

  return (
    <div>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <DeleteRoleTemplate
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        id={id}
        modalType={modalType}
      />

      {isOpen && (
        <UpdateRoleTemplate
          isOpen={isOpen}
          setOpen={setOpen}
          name={name ?? ""}
          id={id}
          modalType={modalType}
          roleTypes={[]}
          roles={roles}
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default RoleTemplatesData;
