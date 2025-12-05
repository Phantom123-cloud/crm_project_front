import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Button, Flex, Select, Table } from "antd";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { isDate } from "@/utils/is-date";
import {
  useIsActiveTripMutation,
  useLazyAllTripsQuery,
} from "@/app/services/trips/tripsApi";
import TagBoolean from "../UI/TagBoolean";
import { useChangeTripDataSelect } from "@/hooks/useChangeTripDataSelect";

const TripsData = () => {
  const { query, changeSelect, setQuery } = useChangeTripDataSelect();

  const [triggerTrips, { data, isLoading }] = useLazyAllTripsQuery();
  const [isActiveTrip] = useIsActiveTripMutation();
  const { callMessage } = useUiContext();

  const onActions = async (id: string) => {
    try {
      const { message } = await isActiveTrip(id).unwrap();
      callMessage.success(message);
      await triggerTrips(query).unwrap();
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  const dataSource = (data?.data?.trips ?? []).map((item) => {
    return {
      key: item.id,
      name: (
        <Link to={`${item.id}`} className="flex items-center gap-1">
          {item.name}
        </Link>
      ),
      createdAt: isDate(item.createdAt),
      dateFrom: isDate(item.dateFrom),
      dateTo: isDate(item.dateTo),
      tripTypes: item.tripTypes.name,
      isActive: <TagBoolean isBool={item.isActive} />,
      actions: (
        <Button
          color={item.isActive ? "danger" : "green"}
          variant="outlined"
          size="small"
          onClick={() => onActions(item.id)}
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
      title: "Дата начала",
      dataIndex: "dateFrom",
      key: "dateFrom",
    },
    {
      title: "Дата конца",
      dataIndex: "dateTo",
      key: "dateTo",
    },
    {
      title: "Тип выезда",
      dataIndex: "tripTypes",
      key: "tripTypes",
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
    triggerTrips(query);
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
    </>
  );
};

export default TripsData;
