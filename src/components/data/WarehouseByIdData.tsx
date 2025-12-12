import { Table } from "antd";
import UpdateWarehouse from "../modals/update/UpdateWarehouse";
import { type Dispatch, type SetStateAction } from "react";

type Props = {
  loading: boolean;
  dataSource: {
    key: string;
    name: boolean;
    quantity: boolean;
  }[];
  columns: {
    title: string;
    dataIndex: string;
    key: string;
  }[];

  isOpen: boolean;
  setOpen: (value: boolean) => void;
  name: string;
  id: string;
  modalType: "UPDATE" | "ADD";
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
  isOpen,
  setOpen,
  name,
  id,
  modalType,
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
      />
      <UpdateWarehouse
        isOpen={isOpen}
        setOpen={setOpen}
        name={name}
        id={id as string}
        modalType={modalType}
        loading={loading}
        query={query}
      />
    </>
  );
};

export default WarehouseByIdData;
