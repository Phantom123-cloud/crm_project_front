import UpdateProducts from "../modals/update/UpdateProducts";
import DeleteProducts from "../modals/delete/DeleteProducts";
import { Table } from "antd";

type Product = { id: string; name: string };

type Props = {
  products: Product[];
  isLoading: boolean;
  page: number;
  limit: number;
  onChange: (page: number, pageSize: number) => void;
  total: number;
};

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

const ProductsData: React.FC<Props> = ({
  products,
  isLoading,
  page,
  limit,
  total,
  onChange,
}) => {
  const dataSource = products.map((item) => {
    return {
      key: item.id,
      name: item.name,
      actions: (
        <div className="flex gap-5">
          <UpdateProducts
            item={item}
            loading={isLoading}
            page={page}
            limit={limit}
          />
          <DeleteProducts item={item} page={page} limit={limit} />
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
    />
  );
};

export default ProductsData;
