import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useGetRoleModalsInfo } from "@/hooks/useGetRoleModalsInfo";
import { useState } from "react";
import type { Templates } from "@/app/services/role-templates/roleTemplatesTypes";
import DeleteRoleTemplate from "../modals/delete/DeleteRoleTemplate";
import UpdateRoleTemplate from "../modals/update/UpdateRoleTemplate";
import RolesGuard from "../layout/RolesGuard";

type Props = {
  templates: Templates[];
  isLoading: boolean;
};
const RoleTemplatesData: React.FC<Props> = ({ templates, isLoading }) => {
  const [isOpen, setOpen] = useState(false);
  const { getInfo, itemInfo } = useGetRoleModalsInfo(setOpen);
  const dataSource = (templates ?? []).map((item) => {
    return {
      key: item.id,
      template: item.name,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_templates"}>
            <Button
              color="primary"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => getInfo(item, "UPDATE")}
              size="small"
            >
              изменить
            </Button>
          </RolesGuard>
          <RolesGuard access={"delete_templates"}>
            <Button
              color="danger"
              variant="outlined"
              icon={<DeleteOutlined />}
              onClick={() => getInfo(item, "DELETE")}
              size="small"
            >
              удалить
            </Button>
          </RolesGuard>
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
          loading={isLoading}
        />
      )}
    </div>
  );
};

export default RoleTemplatesData;
