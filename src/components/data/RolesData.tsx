import { useAllRoleQuery } from "@/app/services/roles/rolesApi";
import { Table } from "antd";
import DeleteRole from "../modals/delete/DeleteRole";
import UpdateRole from "../modals/update/UpdateRole";
import RolesGuard from "../layout/RolesGuard";

type Props = {
  page: number;
  limit: number;
  onChange: (page: number, pageSize: number) => void;
};
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

const RolesData: React.FC<Props> = ({ page, limit, onChange }) => {
  const { data, isLoading } = useAllRoleQuery({ page, limit });
  const dataSource = (data?.data?.roles ?? []).map((item) => {
    const { id, name, typeId, typeName, descriptions } = item;
    return {
      key: id,
      name,
      typeName,
      descriptions,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_roles"}>
            <UpdateRole
              name={name ?? ""}
              id={id}
              limit={limit}
              page={page}
              descriptions={descriptions ?? ""}
              roleTypeId={typeId}
              loading={isLoading}
            />
          </RolesGuard>
          <RolesGuard access={"delete_roles"}>
            <DeleteRole name={name ?? ""} id={id} limit={limit} page={page} />
          </RolesGuard>
        </div>
      ),
    };
  });

  return (
    <Table
      loading={isLoading}
      dataSource={dataSource}
      columns={columns}
      pagination={{
        pageSize: limit,
        total: data?.data?.total ?? 1,
        current: page,
        onChange,
        showSizeChanger: true,
      }}
    />
  );
};

export default RolesData;
