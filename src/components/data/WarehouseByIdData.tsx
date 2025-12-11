import { Table } from "antd";
import UpdateWarehouse from "../modals/update/UpdateWarehouse";

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
}) => {
  return (
    <>
      <Table
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <UpdateWarehouse
        isOpen={isOpen}
        setOpen={setOpen}
        name={name}
        id={id as string}
        modalType={modalType}
        loading={loading}
      />
    </>
  );
};

export default WarehouseByIdData;
