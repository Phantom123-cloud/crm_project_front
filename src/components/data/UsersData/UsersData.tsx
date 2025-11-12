import { authState } from "@/app/features/authSlice";
import {
  useIsActiveUserMutation,
  useLazyAllUsersQuery,
  useLogoutByUserIdMutation,
} from "@/app/services/users/usersApi";
import { useUiContext } from "@/UIContext";
import { errorMessages } from "@/utils/is-error-message";
import { Flex, Segmented, Select, Table } from "antd";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { columnsData } from "./columns";
import { useChangeUserDataSelect } from "@/hooks/useChangeUserDataSelect";
import ActionsButton from "../../UI/buttons/ActionsButton";
import TagBoolean from "../../UI/TagBoolean";
import { isDate } from "@/utils/is-date";

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
    const employeeData = item.employee;

    return {
      key: item.id,
      email: <Link to={`/user/${item.id}`}>{item.email}</Link>,
      fullName: (
        <Flex gap={isMe ? 5 : 0}>
          {employeeData?.fullName}
          <span className="text-red-700">{isMe ? "(Я)" : ""}</span>
        </Flex>
      ),
      createdAt: isDate(item.createdAt),

      ...(employeeData && {
        tradingСode: employeeData.tradingСode ?? "-",
        birthDate: isDate(employeeData.birthDate),

        phones: (
          <div className="grid">
            {employeeData.phones.map((phone) => (
              <div className="whitespace-nowrap text-[12px]">
                {phone.number}-{phone.option}
              </div>
            ))}
          </div>
        ),

        dateFirstTrip: isDate(employeeData.dateFirstTrip),

        isHaveChildren: <TagBoolean isBool={employeeData.isHaveChildren} />,
        isHaveDriverLicense: (
          <TagBoolean isBool={employeeData.isHaveDriverLicense} />
        ),

        drivingExperience: employeeData.drivingExperience,
        isHaveInterPassport: (
          <TagBoolean isBool={employeeData.isHaveInterPassport} />
        ),
        isInMarriage: <TagBoolean isBool={employeeData.isInMarriage} />,

        citizenships: (
          <div className="grid">
            {employeeData.citizenships.map((citizen) => (
              <div className="whitespace-nowrap">{citizen.localeRu}</div>
            ))}
          </div>
        ),
        registrationAddress: employeeData.registrationAddress ?? "-",
        actualAddress: employeeData.actualAddress ?? "-",
        foreignLanguages: (
          <div className="grid">
            {employeeData.foreignLanguages.map((l) => (
              <div className="whitespace-nowrap">
                {`${l.language.localeRu}-${l.level}`}
              </div>
            ))}
          </div>
        ),
      }),

      isActive: <TagBoolean isBool={item.isActive} />,
      isOnline: <TagBoolean isBool={item.isOnline} />,
      actions: (
        <ActionsButton
          disabledLogout={!item.isActive || isMe}
          disabledActions={isMe}
          onClickLogout={() => {
            onActions(item.id, "logout");
          }}
          onClickActions={() => onActions(item.id, "active")}
          isActive={item.isActive}
        />
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
