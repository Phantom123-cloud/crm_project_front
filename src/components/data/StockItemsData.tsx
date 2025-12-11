import { useLazyAllStockMovementsQuery } from "@/app/services/warehouses/warehousesApi";
import { isDate } from "@/utils/is-date";
import { Button, Flex, Select, Table, Tag } from "antd";
import { useEffect, type Dispatch, type SetStateAction } from "react";

type Props = {
  query: {
    page: number;
    limit: number;
    status?: "TRANSIT" | "RECEIVED" | "CANCELLED";
  };
  changeSelect: (value: string) => void;
  setQuery: Dispatch<
    SetStateAction<{
      page: number;
      limit: number;
      status?: "TRANSIT" | "RECEIVED" | "CANCELLED" | undefined;
    }>
  >;

  toWarehouseId: string;
};

const StockItemsData: React.FC<Props> = ({
  query,
  changeSelect,
  setQuery,
  toWarehouseId,
}) => {
  const [triggerStockMove, { data: stockData, isLoading: stockIsLoading }] =
    useLazyAllStockMovementsQuery();

  const translateStatuses = (
    status: "TRANSIT" | "RECEIVED" | "CANCELLED"
  ): { text: string; color: "orange" | "green" | "danger" } => {
    switch (status) {
      case "TRANSIT":
        return { text: "В процессе", color: "orange" };
      case "RECEIVED":
        return { text: "Принято", color: "green" };
      case "CANCELLED":
        return { text: "Отменено", color: "danger" };

      default:
        return { text: "В процессе", color: "orange" };
    }
  };

  const translatetType = (
    stockMovementType:
      | "GOODS_RECEIPT"
      | "STOCK_TRANSFER"
      | "OUTBOUND_DELIVERY"
      | "SCRAP"
  ) => {
    switch (stockMovementType) {
      case "GOODS_RECEIPT":
        return "Приход";
      case "STOCK_TRANSFER":
        return "Перемещение";
      case "OUTBOUND_DELIVERY":
        return "Доставка";
      case "SCRAP":
        return "Списание-брак";

      default:
        return "Приход";
    }
  };

  const dataSourceStockData = (stockData?.data?.stockMovements ?? []).map(
    (item) => {
      const { color, text } = translateStatuses(item.status);
      return {
        key: item.id,
        name: item.product.name,
        createdAt: isDate(item.createdAt),
        from: item?.warehouseFrom?.user?.email ?? "-",
        to: item?.warehouseTo?.user?.email ?? "",
        type: translatetType(item.stockMovementType),
        status: <Tag color={color}>{text}</Tag>,
        quantity: item.quantity,

        actions: (
          <Button
            color="primary"
            variant="solid"
            size="small"
            disabled={item.status !== "TRANSIT"}
          >
            потвердить
          </Button>
        ),
      };
    }
  );

  const columnsStockData = [
    {
      title: "Продукт",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Дата операции",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "К-во",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Отправитель",
      dataIndex: "from",
      key: "from",
    },
    {
      title: "Получатель",
      dataIndex: "to",
      key: "to",
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Статус",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Действие",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const selectOptions = [
    { value: "ALL", label: "все" },
    { value: "TRANSIT", label: "для получения" },
    { value: "RECEIVED", label: "полученные" },
    { value: "CANCELLED", label: "отменённые" },
  ];

  useEffect(() => {
    triggerStockMove({ ...query, toWarehouseId });
  }, [query.page, query.limit, query.status]);
  return (
    <>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Select
          defaultValue="ALL"
          style={{ width: 120 }}
          options={selectOptions}
          onChange={changeSelect}
        />
      </Flex>
      <Table
        scroll={{ x: true }}
        loading={stockIsLoading}
        dataSource={dataSourceStockData}
        columns={columnsStockData}
        bordered
        pagination={{
          pageSize: query.limit,
          total: stockData?.data?.total ?? 1,
          current: query.page,
          onChange: (page, limit) => {
            setQuery((prev) => ({ ...prev, page, limit }));
          },
          showSizeChanger: true,
        }}
      />
    </>
  );
};

export default StockItemsData;
