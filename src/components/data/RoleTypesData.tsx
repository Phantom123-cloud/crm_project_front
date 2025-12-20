import { useAllRolesTypeQuery } from "@/app/services/role-types/roleTypesApi";
import { Table } from "antd";
import DeleteRoleType from "../modals/delete/DeleteRoleType";
import UpdateRoleType from "../modals/update/UpdateRoleType";

type Props = {
  page: number;
  limit: number;
  onChange: (page: number, pageSize: number) => void;
};

const RoleTypesData: React.FC<Props> = ({ page, limit, onChange }) => {
  const { data, isLoading } = useAllRolesTypeQuery({ page, limit });

  const dataSource = (data?.data?.rolesTypeData ?? []).map((item) => {
    return {
      key: item.id,
      name: item.name,
      descriptions: item.descriptions,
      actions: (
        <div className="flex gap-5">
          <UpdateRoleType
            loading={isLoading}
            page={page}
            limit={limit}
            name={item.name}
            descriptions={item.descriptions}
            id={item.id}
          />

          <DeleteRoleType
            name={item.name}
            id={item.id}
            page={page}
            limit={limit}
          />
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

export default RoleTypesData;
