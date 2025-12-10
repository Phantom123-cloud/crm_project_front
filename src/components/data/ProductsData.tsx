import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useState } from "react";
import type { TModal } from "@/types";
import UpdateProducts from "../modals/update/UpdateProducts";
import DeleteProducts from "../modals/delete/DeleteProducts";
import RolesGuard from "../layout/RolesGuard";

type Product = { id: string; name: string };

type Props = {
  products: Product[];
  isLoading: boolean;
  page: number;
  limit: number;
  setPage(page: number): void;
  setLimit(page: number): void;
  total: number;
};

const ProductsData: React.FC<Props> = ({
  products,
  isLoading,
  page,
  limit,
  setPage,
  setLimit,
  total,
}) => {
  const [isOpen, setOpen] = useState(false);
  const [itemInfo, setItemInfo] = useState<Product>({
    id: "",
    name: "",
  });
  const [modalType, setModalType] = useState<TModal>("UPDATE");
  const getInfo = (item: Product, type: TModal) => {
    setItemInfo((prev) => ({ ...prev, ...item }));
    setModalType(type);
    setOpen(true);
  };

  const dataSource = products.map((item) => {
    return {
      key: item.id,
      name: item.name,
      actions: (
        <div className="flex gap-5">
          <RolesGuard access={"update_languages"}>
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
          <RolesGuard access={"delete_languages"}>
            <Button
              color="danger"
              variant="outlined"
              icon={<DeleteOutlined />}
              onClick={() => getInfo(item, "DELETE")}
              size="small"
            >
              удалить
            </Button>{" "}
          </RolesGuard>
        </div>
      ),
    };
  });

  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
  const { id, name } = itemInfo;
  return (
    <>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize: limit,
          total,
          current: page,
          onChange: (page, limit) => {
            setPage(page);
            setLimit(limit);
          },
          showSizeChanger: true,
        }}
      />
      <DeleteProducts
        isOpen={isOpen}
        setOpen={setOpen}
        name={name}
        id={id}
        modalType={modalType}
        page={page}
        limit={limit}
      />
      <UpdateProducts
        isOpen={isOpen}
        setOpen={setOpen}
        name={name}
        id={id}
        modalType={modalType}
        loading={isLoading}
        page={page}
        limit={limit}
      />
    </>
  );
};

export default ProductsData;
