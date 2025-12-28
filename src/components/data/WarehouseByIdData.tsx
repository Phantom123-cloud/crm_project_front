import { Table } from "antd";
import { type Dispatch, type SetStateAction } from "react";

type Props = {
  loading: boolean;
  dataSource: {
    key: string;
    name: string;
    quantity: number;
  }[];
  columns: {
    title: string;
    dataIndex: string;
    key: string;
  }[];

  total: number;
  query: {
    id: string;
    page: number;
    limit: number;
  };
  setQuery: Dispatch<
    SetStateAction<{
      id: string;
      page: number;
      limit: number;
    }>
  >;
};

const WarehouseByIdData: React.FC<Props> = ({
  loading,
  dataSource,
  columns,
  total,
  query,
  setQuery,
}) => {
  return (
    <>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: query.limit,
          total,
          current: query.page,
          onChange: (page, limit) => {
            setQuery((prev) => ({ ...prev, page, limit }));
          },
          showSizeChanger: true,
        }}
         // locale={{ emptyText: "Нет данных" }}
      />
    </>
  );
};

export default WarehouseByIdData;
