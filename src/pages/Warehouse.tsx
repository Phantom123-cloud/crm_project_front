import { useLazyWarehouseByIdApiQuery } from "@/app/services/warehouses/warehousesApi";
import Title from "antd/es/typography/Title";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AddProductsByWarehouse from "@/components/modals/add/AddProductsByWarehouse";
import { Tabs } from "antd";
import WarehouseByIdData from "@/components/data/WarehouseByIdData";
import { useChangeStockItemsSelect } from "@/hooks/useChangeStockItemsSelect";
import StockItemsData from "@/components/data/StockItemsData";
import StockMovementsModal from "@/components/modals/StockMovements";
import UpdateWarehouse from "@/components/modals/update/UpdateWarehouse";
import ScrapProduct from "@/components/modals/ScrapProduct";

const Warehouse = () => {
  const { id } = useParams();
  const initQuery = {
    page: 1,
    limit: 10,
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
  const {
    query: queryStockMove,
    changeSelect,
    setQuery,
  } = useChangeStockItemsSelect();
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
          dataSource={dataSourceWarehouse}
          columns={columnsWarehouse}
          loading={isLoading}
          query={queryWarehouse}
          total={data?.data?.total ?? 1}
          setQuery={setQueryWarehouse}
        />
      ),
    },
    {
      key: "stockItem",
      label: "Перемещения",
      children: (
        <StockItemsData
          query={queryStockMove}
          changeSelect={changeSelect}
          setQuery={setQuery}
          warehouseId={id as string}
          queryWarehouse={queryWarehouse}
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
          {!isTrip && (
            <UpdateWarehouse
              loading={isLoading}
              name={data?.data?.warehouse.name ?? ""}
              id={id as string}
              queryStockMove={queryWarehouse}
            />
          )}
        </div>
        <div className="flex items-center gap-2">
          <StockMovementsModal
            queryStockMove={queryStockMove}
            queryWarehouse={queryWarehouse}
            stockItems={data?.data?.stockItems ?? []}
          />
          {!isTrip && (
            <ScrapProduct
              queryWarehouse={queryWarehouse}
              stockItems={data?.data?.stockItems ?? []}
              queryStockMove={queryStockMove}
            />
          )}
          {!isTrip && (
            <AddProductsByWarehouse
              queryWarehouse={queryWarehouse}
              queryStockMove={queryStockMove}
            />
          )}
        </div>
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
