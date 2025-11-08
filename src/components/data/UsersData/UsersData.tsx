import { authState } from "@/app/features/authSlice";
import {
  useIsActiveUserMutation,
  useLazyAllUsersQuery,
  useLogoutByUserIdMutation,
} from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Button, Flex, Segmented, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { columnsData } from "./utils";
import { useChangeUserDataSelect } from "@/hooks/useChangeUserDataSelect";

const UsersData = () => {
  const [isFullData, setIsFullData] = useState<boolean>(() => {
    return localStorage.getItem("segmentedValue") === "fullData";
  });
  const handleChangeSegmented = () => setIsFullData(!isFullData);
  const { query, changeSelect, setQuery } = useChangeUserDataSelect(isFullData);

  const [triggerUsers, { data, isLoading }] = useLazyAllUsersQuery();
  const [logoutUser] = useLogoutByUserIdMutation();
  const [isActiveUser] = useIsActiveUserMutation();
  const { callMessage } = useUiContext();
  const { meData } = useSelector(authState);

  const onActions = async (id: string, type: "logout" | "active") => {
    try {
      const { message } = await (type === "active"
        ? isActiveUser(id)
        : logoutUser(id)
      ).unwrap();
      await triggerUsers(query).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };
  const dataSource = (data?.data?.users ?? []).map((item) => {
    const isMe = meData?.id === item.id;

    return {
      key: item.id,
      email: <Link to={`/user/${item.id}`}>{item.email}</Link>,
      fullName: (
        <Flex gap={isMe ? 5 : 0}>
          {item.fullName}
          <span className="text-red-700">{isMe ? "(Я)" : ""}</span>
        </Flex>
      ),
      createdAt: new Date(item.createdAt).toLocaleDateString(),
      isActive: (
        <Tag color={item.isActive ? "green" : "volcano"}>
          {item.isActive ? "Да" : "Нет"}
        </Tag>
      ),

      isOnline: (
        <Tag color={item.isOnline ? "green" : "volcano"}>
          {item.isOnline ? "Да" : "Нет"}
        </Tag>
      ),
      actions: (
        <div className="flex gap-5">
          <Button
            color="default"
            variant="outlined"
            size="small"
            disabled={!item.isActive || isMe}
            onClick={() => {
              onActions(item.id, "logout");
            }}
          >
            выйти
          </Button>
          <Button
            color={item.isActive ? "danger" : "green"}
            variant="outlined"
            size="small"
            disabled={isMe}
            onClick={() => {
              onActions(item.id, "active");
            }}
          >
            {item.isActive ? "забло-ть" : "актив-ть"}
          </Button>
        </div>
      ),
    };
  });
  const columns = columnsData(isFullData);
  const selectOptions = [
    { value: "all", label: "все" },
    { value: "online", label: "онлайн" },
    { value: "offline", label: "офлайн" },
    { value: "active", label: "активные" },
    { value: "no_active", label: "заблокированные" },
  ];

  useEffect(() => {
    localStorage.setItem(
      "segmentedValue",
      isFullData ? "fullData" : "baseData"
    );
  }, [isFullData]);

  useEffect(() => {
    triggerUsers({ ...query, isFullData });
  }, [query.page, query.limit, query.isActive, query.isOnline, isFullData]);

  return (
    <>
      <Flex justify="space-between" style={{ marginBottom: 10 }}>
        <Select
          defaultValue="all"
          style={{ width: 120 }}
          options={selectOptions}
          onChange={changeSelect}
        />

        <Segmented
          defaultValue={isFullData ? "fullData" : "baseData"}
          options={[
            { value: "baseData", label: "Аккаунт" },
            { value: "fullData", label: "Полная" },
          ]}
          onChange={handleChangeSegmented}
        />
      </Flex>
      <div className="min-w-full overflow-y-auto">
        <Table
          loading={isLoading}
          dataSource={dataSource}
          columns={columns}
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
      </div>
    </>
  );
};

export default UsersData;
