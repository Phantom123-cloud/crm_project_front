import { useLazyWarehouseByIdApiQuery } from "@/app/services/warehouses/warehousesApi";
import AddButton from "@/components/UI/buttons/AddButton";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EditOutlined } from "@ant-design/icons";
import AddProductsByWarehouse from "@/components/modals/add/AddProductsByWarehouse";
import { Tabs } from "antd";
import WarehouseByIdData from "@/components/data/WarehouseByIdData";
import { useChangeStockItemsSelect } from "@/hooks/useChangeStockItemsSelect";
import StockItemsData from "@/components/data/StockItemsData";
import StockMovementsModal from "@/components/modals/StockMovements";

const Warehouse = () => {
  const { id } = useParams();
  const initQuery = {
    page: 1,
    limit: 20,
    id: id as string,
  };
  const [queryWarehouse, setQueryWarehouse] = useState<{
    id: string;
    page: number;
    limit: number;
  }>(initQuery);
  const [triggerWarehouseById, { data, isLoading }] =
    useLazyWarehouseByIdApiQuery();
  const isTrip = data?.data?.warehouse.type === "TRIP";
  const [open, setOpen] = useState(false);
  const [modalType, setModalType] = useState<"UPDATE" | "ADD">("UPDATE");
  const { query, changeSelect, setQuery } = useChangeStockItemsSelect();

  const openModal = (type: "UPDATE" | "ADD") => {
    setModalType(type);
    setOpen(true);
  };

  const dataSourceWarehouse = (data?.data?.stockItems ?? []).map((item) => {
    return {
      key: item.id,
      name: item.product.name,
      quantity: item.quantity,
    };
  });

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
          total={data?.data?.total ?? 1}
          query={queryWarehouse}
          setQuery={setQueryWarehouse}
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

  useEffect(() => {
    triggerWarehouseById(queryWarehouse);
  }, [queryWarehouse.page, queryWarehouse.limit]);

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
              queryWarehouse={queryWarehouse}
              queryStock={query}
              modalType={modalType}
            />
          </>
        )}
      </div>
      <div>
        <StockMovementsModal
          query={{
            page: 0,
            limit: 0,
            isActive: undefined,
          }}
          products={[]}
        />
      </div>
      {/* <span className="mb-2">
        К-во не подтверждённого товара: {data?.data?.countTransitProduct}
      </span> */}

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
