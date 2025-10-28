import { useAllRolesTypeQuery } from "@/app/services/roles-type/rolesTypeApi";
import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteRoleType from "../modals/DeleteRoleType";
import { useState } from "react";
import UpdateRoleType from "../modals/UpdateRoleType";
import { useGetRoleModalsInfo } from "@/hooks/useGetRoleModalsInfo";

const RolesTypeData = () => {
  const [isOpen, setOpen] = useState(false);
  const { getInfo, roleTypeInfo } = useGetRoleModalsInfo(setOpen);

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
          >
            изменить
          </Button>
          <Button
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
            onClick={() => getInfo(item, "DELETE")}
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
  const { name, id, modalType, descriptions } = roleTypeInfo;
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
        name={name}
        id={id}
        modalType={modalType}
      />
      <UpdateRoleType
        isOpen={isOpen}
        setOpen={setOpen}
        name={name}
        descriptions={descriptions as string}
        id={id}
        modalType={modalType}
      />
    </>
  );
};

export default RolesTypeData;
