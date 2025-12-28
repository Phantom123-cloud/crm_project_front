import { Table } from "antd";
import DeleteReferenceItem from "../modals/delete/DeleteReferenceItem";
import RolesGuard from "../layout/RolesGuard";
import UpdateReferenceItem from "../modals/update/UpdateReferenceItem";

const columns = [
  {
    title: "Код",
    dataIndex: "code",
    key: "code",
  },
  {
    title: "Название (ру)",
    dataIndex: "localeRu",
    key: "localeRu",
  },
  {
    title: "Название (eng)",
    dataIndex: "localeEn",
    key: "localeEn",
  },
  {
    title: "Действия",
    dataIndex: "actions",
    key: "actions",
  },
];

type Props = {
  page: number;
  limit: number;
  onChange: (page: number, pageSize: number) => void;
  access: { update: string; delete: string };
  data: {
    id: string;
    code: string;
    localeRu: string;
    localeEn: string;
  }[];
  isLoading: boolean;
  total: number;
  type: "citizenship" | "languages";
};

const ReferenceItemData: React.FC<Props> = ({
  page,
  limit,
  onChange,
  access,
  data,
  isLoading,
  total,
  type,
}) => {
  const dataSource = data.map((item) => {
    return {
      key: item.id,
      code: item.code,
      localeRu: item.localeRu,
      localeEn: item.localeEn,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={access.update}>
            <UpdateReferenceItem
              item={item}
              loading={isLoading}
              page={page}
              limit={limit}
              type={type}
            />
          </RolesGuard>
          <RolesGuard access={access.delete}>
            <DeleteReferenceItem
              localeRu={item.localeRu}
              id={item.id}
              page={page}
              limit={limit}
              type={type}
            />
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
        total,
        current: page,
        onChange,
        showSizeChanger: true,
      }}
       // locale={{ emptyText: "Нет данных" }}
    />
  );
};

export default ReferenceItemData;
