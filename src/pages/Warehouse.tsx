import { useWarehouseByIdApiQuery } from "@/app/services/warehouses/warehousesApi";
import AddButton from "@/components/UI/buttons/AddButton";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import UpdateWarehouse from "@/components/modals/update/UpdateWarehouse";
import AddProductsByWarehouse from "@/components/modals/add/AddProductsByWarehouse";
import { Table } from "antd";

const Warehouse = () => {
  const { id } = useParams();
  const { data, isLoading } = useWarehouseByIdApiQuery(id as string);
  const isTrip = data?.data?.warehouse.type === "TRIP";
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"UPDATE" | "ADD">("UPDATE");

  const openModal = (type: "UPDATE" | "ADD") => {
    setModalType(type);
    setOpen(true);
  };

  const dataSource = (data?.data?.warehouse?.stockItems ?? []).map((item) => {
    return {
      key: item.id,
      name: item.product.name,
      quantity: item.quantity,
      // actions: (
      //   <div className="flex gap-5">
      //     <RolesGuard access={"update_languages"}>
      //       <Button
      //         color="primary"
      //         variant="outlined"
      //         icon={<EditOutlined />}
      //         onClick={() => getInfo(item, "UPDATE")}
      //         size="small"
      //       >
      //         изменить
      //       </Button>
      //     </RolesGuard>
      //     <RolesGuard access={"delete_languages"}>
      //       <Button
      //         color="danger"
      //         variant="outlined"
      //         icon={<DeleteOutlined />}
      //         onClick={() => getInfo(item, "DELETE")}
      //         size="small"
      //       >
      //         удалить
      //       </Button>{" "}
      //     </RolesGuard>
      //   </div>
      // ),
    };
  });

  const columns = [
    {
      title: "Наименование",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "К-во",
      dataIndex: "quantity",
      key: "quantity",
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1">
          <Title level={3}>{data?.data?.warehouse.name}</Title>
          {!isTrip && <EditOutlined onClick={() => openModal("UPDATE")} />}
        </div>
        {!isTrip && (
          <>
            <AddButton
              onClick={() => openModal("ADD")}
              text="Внести поставку товара"
            />
            <AddProductsByWarehouse
              isOpen={open}
              setOpen={setOpen}
              warehouseId={id as string}
              modalType={modalType}
            />
          </>
        )}
      </div>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <UpdateWarehouse
        isOpen={open}
        setOpen={setOpen}
        name={data?.data?.warehouse.name ?? ""}
        id={id as string}
        modalType={modalType}
        loading={isLoading}
      />
    </div>
  );
};

export default Warehouse;
