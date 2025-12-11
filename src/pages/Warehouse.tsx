import { useWarehouseByIdApiQuery } from "@/app/services/warehouses/warehousesApi";
import AddButton from "@/components/UI/buttons/AddButton";
import Title from "antd/es/typography/Title";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import AddProductsByWarehouse from "@/components/modals/add/AddProductsByWarehouse";
import { Tabs } from "antd";
import WarehouseByIdData from "@/components/data/WarehouseByIdData";
import { useChangeStockItemsSelect } from "@/hooks/useChangeStockItemsSelect";
import StockItemsData from "@/components/data/StockItemsData";

const Warehouse = () => {
  const { id } = useParams();
  const { data, isLoading } = useWarehouseByIdApiQuery(id as string);
  const isTrip = data?.data?.warehouse.type === "TRIP";
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"UPDATE" | "ADD">("UPDATE");
  const { query, changeSelect, setQuery } = useChangeStockItemsSelect();
  const openModal = (type: "UPDATE" | "ADD") => {
    setModalType(type);
    setOpen(true);
  };

  const dataSourceWarehouse = (data?.data?.warehouse?.stockItems ?? []).map(
    (item) => {
      return {
        key: item.id,
        name: item.product.name,
        quantity: item.quantity,
      };
    }
  );

  const columnsWarehouse = [
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

  const tabItems = [
    {
      key: "warehouse",
      label: "Склад",
      children: (
        <WarehouseByIdData
          loading={isLoading}
          dataSource={dataSourceWarehouse}
          columns={columnsWarehouse}
          isOpen={open}
          setOpen={setOpen}
          name={data?.data?.warehouse.name ?? ""}
          id={id as string}
          modalType={modalType}
        />
      ),
    },
    {
      key: "stockItem",
      label: "Перемещения",
      children: (
        <StockItemsData
          query={query}
          changeSelect={changeSelect}
          setQuery={setQuery}
          toWarehouseId={id as string}
        />
      ),
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
      <span className="mb-2">
        К-во не подтверждённого товара: {data?.data?.countTransitProduct}
      </span>

      <Tabs
        defaultActiveKey="warehouse"
        items={tabItems.map((item) => {
          return {
            key: item.key,
            label: item.label,
            forceRender: true,
            children: item.children,
          };
        })}
      />
    </div>
  );
};

export default Warehouse;
