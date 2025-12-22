import {
  useAcceptProductMutation,
  useLazyAllStockMovementsQuery,
  useLazyWarehouseByIdApiQuery,
} from "@/app/services/warehouses/warehousesApi";
import { useUiContext } from "@/UIContext";
import { isDate } from "@/utils/is-date";
import { errorMessages } from "@/utils/is-error-message";
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
  queryWarehouse: {
    id: string;
    page: number;
    limit: number;
  };
  warehouseId: string;
};

const StockItemsData: React.FC<Props> = ({
  query,
  changeSelect,
  setQuery,
  warehouseId,
  queryWarehouse,
}) => {
  const [triggerStockMove, { data: stockData, isLoading: stockIsLoading }] =
    useLazyAllStockMovementsQuery();

  const translateStatuses = (
    status: "TRANSIT" | "RECEIVED" | "CANCELLED" | "SCRAP"
  ): { text: string; color: "orange" | "green" | "red" | "red-inverse" } => {
    switch (status) {
      case "TRANSIT":
        return { text: "В процессе", color: "orange" };
      case "RECEIVED":
        return { text: "Принято", color: "green" };
      case "CANCELLED":
        return { text: "Отменено", color: "red" };
      case "SCRAP":
        return { text: "Списание-брак", color: "red-inverse" };

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
      | "SALE"
      | "GIFT"
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
      case "SALE":
        return "Продажа";
      case "GIFT":
        return "Подарок к договору";

      default:
        return "Приход";
    }
  };

  const translatetFromSuppler = (from: "SPV" | "SUPPLER" | "CLIENT") => {
    switch (from) {
      case "SPV":
        return "СПВ";
      case "SUPPLER":
        return "Поставщик";
      case "CLIENT":
        return "Клиент";

      default:
        return "-";
    }
  };

  const [acceptProduct] = useAcceptProductMutation();
  const [triggerWarehouseById] = useLazyWarehouseByIdApiQuery();
  const { callMessage } = useUiContext();
  const onProductMigration = async (stockMovementsId: string) => {
    try {
      const { message } = await acceptProduct({
        stockMovementsId,
        warehouseId,
      }).unwrap();

      await triggerStockMove({ ...query, warehouseId }).unwrap();
      await triggerWarehouseById(queryWarehouse).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  const dataSourceStockData = (stockData?.data?.stockMovements ?? []).map(
    (item) => {
      const { color, text } = translateStatuses(item.status);
      const isDisabled = item.status !== "TRANSIT";

      return {
        key: item.id,
        name: item.product.name,
        createdAt: isDate(item.createdAt),
        reason: item.reason,
        from:
          item?.warehouseFrom?.name ??
          translatetFromSuppler(item?.toWhomOrFromWhere),
        to:
          item?.warehouseTo?.name ??
          translatetFromSuppler(item?.toWhomOrFromWhere),
        type: translatetType(item.stockMovementType),
        status: <Tag color={color}>{text}</Tag>,
        quantity: item.quantity,

        actions: (
          <Button
            color={
              item?.warehouseFrom?.id === warehouseId ? "danger" : "primary"
            }
            variant="solid"
            size="small"
            disabled={isDisabled}
            onClick={() => onProductMigration(item.id)}
          >
            {item?.warehouseFrom?.id === warehouseId
              ? "отменить"
              : "подтвердить"}
          </Button>
        ),
      };
    }
  );

  const columnsStockData = [
    {
      title: "Дата операции",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Продукт",
      dataIndex: "name",
      key: "name",
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
      title: "Основание",
      dataIndex: "reason",
      key: "reason",
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
    triggerStockMove({ ...query, warehouseId });
  }, [query.page, query.limit, query.status]);
  return (
    <>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Select
          defaultValue="ALL"
          style={{ minWidth: 120 }}
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
