import { useAllRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";
import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteRoleType from "../modals/delete/DeleteRoleType";
import { useState } from "react";
import UpdateRoleType from "../modals/update/UpdateRoleType";
import { useGetRoleModalsInfo } from "@/hooks/useGetRoleModalsInfo";

const RoleTypesData = () => {
  const [isOpen, setOpen] = useState(false);
  const { getInfo, itemInfo } = useGetRoleModalsInfo(setOpen);

  const { data, isLoading } = useAllRolesTypeQuery();
  const dataSource = (data?.data ?? []).map((item) => {
    return {
      key: item.id,
      name: item.name,
      descriptions: item.descriptions,
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
      title: "Имя типа",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Описание",
      dataIndex: "descriptions",
      key: "descriptions",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
  const { name, id, modalType, descriptions } = itemInfo;
  return (
    <>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <DeleteRoleType
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        id={id}
        modalType={modalType}
      />
      <UpdateRoleType
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        descriptions={descriptions ?? ""}
        id={id}
        modalType={modalType}
        loading={isLoading}
      />
    </>
  );
};

export default RoleTypesData;
