import { Table } from "antd";
import DeleteRoleTemplate from "../modals/delete/DeleteRoleTemplate";
import UpdateRoleTemplate from "../modals/update/UpdateRoleTemplate";
import { useAllRoleTemplatesQuery } from "@/app/services/role-templates/roleTemplatesApi";

type Props = {
  page: number;
  limit: number;
  onChange: (page: number, pageSize: number) => void;
};
const RoleTemplatesData: React.FC<Props> = ({ page, limit, onChange }) => {
  const { data, isLoading } = useAllRoleTemplatesQuery({ page, limit });
  const dataSource = (data?.data?.templates ?? []).map((item) => {
    return {
      key: item.id,
      template: item.name,
      actions: (
        <div className="flex gap-5">
          <UpdateRoleTemplate
            name={item.name ?? ""}
            id={item.id}
            loading={isLoading}
            page={page}
            limit={limit}
          />
          <DeleteRoleTemplate
            name={item.name ?? ""}
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
       // locale={{ emptyText: "Нет данных" }}
    />
  );
};

export default RoleTemplatesData;
