import { useAllRoleQuery } from "@/app/services/roles/rolesApi";
import { Table, Button } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteRole from "../modals/delete/DeleteRole";
import { useState } from "react";
import UpdateRole from "../modals/update/UpdateRole";
import RolesGuard from "../layout/RolesGuard";
import { useGetModalsInfo } from "@/hooks/useGetModalsInfo";

type Props = {
  page: number;
  setPage(page: number): void;
  limit: number;
  setLimit(page: number): void;
};

const RolesData: React.FC<Props> = ({ page, setPage, limit, setLimit }) => {
  const { data, isLoading } = useAllRoleQuery({ page, limit });
  const [isOpen, setOpen] = useState(false);
  const { getInfo, itemInfo } = useGetModalsInfo(setOpen);
  const [roleTypeId, setRoleTypeId] = useState("");
  const dataSource = (data?.data?.roles ?? []).map((item) => {
    return {
      key: item.id,
      name: item.name,
      typeName: item.typeName,
      descriptions: item.descriptions,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_roles"}>
            <Button
              color="primary"
              size="small"
              variant="outlined"
              icon={<EditOutlined />}
              onClick={() => {
                setRoleTypeId(item.typeId);
                getInfo(item, "UPDATE");
              }}
            >
              изменить
            </Button>
          </RolesGuard>
          <RolesGuard access={"delete_roles"}>
            <Button
              color="danger"
              size="small"
              variant="outlined"
              icon={<DeleteOutlined />}
              onClick={() => getInfo(item, "DELETE")}
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
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Тип",
      dataIndex: "typeName",
      key: "typeName",
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
    <div>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: limit,
          total: data?.data?.total ?? 1,
          current: page,
          onChange: (page, limit) => {
            setPage(page);
            setLimit(limit);
          },
          showSizeChanger: true,
        }}
      />
      <DeleteRole
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        id={id}
        modalType={modalType}
        limit={limit}
        page={page}
      />

      <UpdateRole
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        id={id}
        modalType={modalType}
        limit={limit}
        page={page}
        descriptions={descriptions ?? ""}
        roleTypeId={roleTypeId}
        loading={isLoading}
      />
    </div>
  );
};

export default RolesData;
