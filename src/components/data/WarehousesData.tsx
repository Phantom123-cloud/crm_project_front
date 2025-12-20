import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Button, Flex, Select, Table } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { isDate } from "@/utils/is-date";
import TagBoolean from "../UI/TagBoolean";
import { useChangeTripDataSelect } from "@/hooks/useChangeTripDataSelect";
import {
  useIsActiveWarehouseMutation,
  useLazyAllWarehousesApiQuery,
} from "@/app/services/warehouses/warehousesApi";
import AddWarehouse from "../modals/add/AddWarehouse";

type Props = {
  isOpen: boolean;
  onCancel: () => void;
};

const WarehousesData: React.FC<Props> = ({ isOpen, onCancel }) => {
  const { query, changeSelect, setQuery } = useChangeTripDataSelect();

  const [triggerWarehouses, { data, isLoading }] =
    useLazyAllWarehousesApiQuery();
  const [isActiveWarehouse] = useIsActiveWarehouseMutation();
  const { callMessage } = useUiContext();

  const onActions = async (id: string) => {
    try {
      const { message } = await isActiveWarehouse(id).unwrap();
      callMessage.success(message);
      await triggerWarehouses(query).unwrap();
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  const trnslateTypes = (type: "CENTRAL" | "PERSONAL" | "TRIP") => {
    switch (type) {
      case "CENTRAL":
        return "Центральный";
      case "PERSONAL":
        return "Личный";
      case "TRIP":
        return "Для выезда";

      default:
        return "-";
    }
  };

  const dataSource = (data?.data?.warehouses ?? []).map((item) => {
    return {
      key: item.id,
      name: (
        <Link to={`/warehouse/${item.id}`} className="flex items-center gap-1">
          {item.name}
        </Link>
      ),
      createdAt: isDate(item.createdAt),
      ownerUser: item.user.employee?.fullName ?? "-",
      type: trnslateTypes(item.type),
      isActive: <TagBoolean isBool={item.isActive} />,
      actions: (
        <Button
          color={item.isActive ? "danger" : "green"}
          variant="outlined"
          size="small"
          onClick={() => onActions(item.id)}
          disabled={item.type === "CENTRAL"}
        >
          {item.isActive ? "забло-ть" : "актив-ть"}
        </Button>
      ),
    };
  });

  const columns = [
    {
      title: "Название",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Добавлен",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Ответственный",
      dataIndex: "ownerUser",
      key: "ownerUser",
    },
    {
      title: "Тип",
      dataIndex: "type",
      key: "type",
    },
    {
      title: "Активен?",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
  const selectOptions = [
    { value: "all", label: "все" },
    { value: "active", label: "активные" },
    { value: "no_active", label: "заблокированные" },
  ];

  useEffect(() => {
    triggerWarehouses(query);
  }, [query.page, query.limit, query.isActive]);

  return (
    <>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Select
          defaultValue="active"
          style={{ width: 120 }}
          options={selectOptions}
          onChange={changeSelect}
        />
      </Flex>
      <Table
        scroll={{ x: true }}
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        bordered
        pagination={{
          pageSize: query.limit,
          total: data?.data?.total ?? 1,
          current: query.page,
          onChange: (page, limit) => {
            setQuery((prev) => ({ ...prev, page, limit }));
          },
          showSizeChanger: true,
        }}
      />

      <AddWarehouse
        query={query}
        isExistCentral={dataSource.length > 0}
        isOpen={isOpen}
        onCancel={onCancel}
      />
    </>
  );
};

export default WarehousesData;
