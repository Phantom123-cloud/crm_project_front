import { useAllRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";
import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteRoleType from "../modals/delete/DeleteRoleType";
import { useState } from "react";
import UpdateRoleType from "../modals/update/UpdateRoleType";
import RolesGuard from "../layout/RolesGuard";
import { useGetModalsInfo } from "@/hooks/useGetModalsInfo";

type Props = {
  page: number;
  limit: number;
  setPage(page: number): void;
  setLimit(page: number): void;
};

const RoleTypesData: React.FC<Props> = ({ page, limit, setPage, setLimit }) => {
  const [isOpen, setOpen] = useState(false);
  const { getInfo, itemInfo } = useGetModalsInfo(setOpen);
  const { data, isLoading } = useAllRolesTypeQuery({ page, limit });

  const dataSource = (data?.data?.rolesTypeData ?? []).map((item) => {
    return {
      key: item.id,
      name: item.name,
      descriptions: item.descriptions,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_role_types"}>
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
          <RolesGuard access={"delete_role_types"}>
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
      <DeleteRoleType
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        id={id}
        modalType={modalType}
        page={page}
        limit={limit}
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
