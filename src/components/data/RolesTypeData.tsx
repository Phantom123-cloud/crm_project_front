import { useAllRolesTypeQuery } from "@/app/services/roles-type/rolesTypeApi";
import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteRoleType from "../modals/DeleteRoleType";
import { useState } from "react";
import UpdateRoleType from "../modals/UpdateRoleType";

type TRoleTypeInfo = {
  id: string;
  name: string;
  descriptions?: string;
  modalType: "CHANGE_NAME" | "DELETE";
};

const RolesTypeData = () => {
  const [isOpen, setOpen] = useState(false);
  const [roleTypeInfo, setRoleTypeInfo] = useState<TRoleTypeInfo>({
    id: "",
    name: "",
    descriptions: "",
    modalType: "DELETE",
  });
  const getTypeInfo = (
    item: { id: string; name: string },
    modalType: "CHANGE_NAME" | "DELETE"
  ) => {
    setRoleTypeInfo((prev) => ({ ...prev, ...item, modalType }));
    setOpen(true);
  };
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
            onClick={() => getTypeInfo(item, "CHANGE_NAME")}
          >
            изменить
          </Button>
          <Button
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
            onClick={() => getTypeInfo(item, "DELETE")}
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
