import {
  useIsActiveUserMutation,
  useLazyAllUsersQuery,
  useLogoutByUserIdMutation,
} from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Button, Select, Table, Tag } from "antd";
import { useEffect, useState } from "react";

const UsersData = () => {
  const [triggerUsers, { data, isLoading }] = useLazyAllUsersQuery();
  const initQuery = {
    page: 1,
    limit: 20,
    isOnline: undefined,
    isActive: undefined,
  };
  const [query, setQuery] = useState<{
    page: number;
    limit: number;
    isActive?: boolean;
    isOnline?: boolean;
  }>(initQuery);
  const [logoutUser] = useLogoutByUserIdMutation();
  const [isActiveUser] = useIsActiveUserMutation();
  const { callMessage } = useUiContext();

  const onLogout = async (id: string) => {
    try {
      const { message } = await logoutUser(id).unwrap();
      await triggerUsers(query).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  const changeActiveUser = async (id: string) => {
    try {
      const { message } = await isActiveUser(id).unwrap();
      await triggerUsers(query).unwrap();
      callMessage.success(message);
    } catch (err) {
      callMessage.error(errorMessages(err));
    }
  };

  const dataSource = (data?.data?.users ?? []).map((item) => {
    return {
      key: item.id,
      email: item.email,
      fullName: item.fullName,
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
            disabled={!item.isActive}
            onClick={() => {
              onLogout(item.id);
            }}
          >
            выйти
          </Button>
          <Button
            color={item.isActive ? "danger" : "green"}
            variant="outlined"
            size="small"
            onClick={() => {
              changeActiveUser(item.id);
            }}
          >
            {item.isActive ? "забло-ть" : "актив-ть"}
          </Button>
        </div>
      ),
    };
  });

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Имя",
      dataIndex: "fullName",
      key: "fullName",
    },
    {
      title: "Создан",
      dataIndex: "createdAt",
      key: "createdAt",
    },
    {
      title: "Активен?",
      dataIndex: "isActive",
      key: "isActive",
    },
    {
      title: "Онлайн?",
      dataIndex: "isOnline",
      key: "isOnline",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const selectOptions = [
    { value: "all", label: "все" },
    { value: "online", label: "онлайн" },
    { value: "offline", label: "офлайн" },
    { value: "active", label: "активные" },
    { value: "no_active", label: "заблокированные" },
  ];

  const changeSelect = (value: string) => {
    switch (value) {
      case "online":
        setQuery({ ...initQuery, isOnline: true });
        break;
      case "offline":
        setQuery({ ...initQuery, isOnline: false, isActive: true });
        break;
      case "active":
        setQuery({ ...initQuery, isActive: true });
        break;
      case "no_active":
        setQuery({ ...initQuery, isActive: false });
        break;
      case "all":
        setQuery(initQuery);
        break;

      default:
        setQuery(initQuery);
        break;
    }
  };

  useEffect(() => {
    triggerUsers(query);
  }, [query.page, query.limit, query.isActive, query.isOnline]);
  return (
    <>
      <Select
        defaultValue="all"
        style={{ width: 120, marginBottom: 10 }}
        options={selectOptions}
        onChange={changeSelect}
      />
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
    </>
  );
};

export default UsersData;
