import { useUserByIdQuery } from "@/app/services/users/usersApi";
import EmployeeData from "@/components/data/EmployeeForm";
import EmployeePassport from "@/components/data/EmployeePassport";
import EmployeeDocuments from "@/components/data/EmployeeDocuments";
import UserAccount from "@/components/data/UserAccount";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";
import { useUiContext } from "@/UIContext";

const User = () => {
  const { id } = useParams();
  const { data } = useUserByIdQuery(id as string);
  const { isAcces } = useUiContext();

  const items = [
    ...(isAcces("view_users")
      ? [
          {
            label: "Анкета",
            children: (
              <EmployeeData
                userId={id as string}
                employee={data?.data?.user?.employee}
              />
            ),
          },
          {
            label: "Паспортные данные",
            children: (
              <EmployeePassport
                userId={id as string}
                employee={data?.data?.user?.employee}
              />
            ),
          },
        ]
      : []),

    ...(isAcces("view_employee_passports")
      ? [
          {
            label: "Сканы документов",
            children: (
              <EmployeeDocuments
                userId={id as string}
                passports={data?.data?.passports ?? []}
              />
            ),
          },
        ]
      : []),

    ...(isAcces("update_accounts")
      ? [
          {
            label: "Аккаунт",
            children: (
              <UserAccount
                userId={id as string}
                email={data?.data?.user?.email as string}
                roleTemplatesId={data?.data?.user?.roleTemplatesId ?? ""}
              />
            ),
          },
        ]
      : []),
  ];

  return (
    <Tabs
      defaultActiveKey="0"
      type="card"
      items={items.map((item, index) => {
        return {
          ...item,
          key: `${index}`,
        };
      })}
    />
  );
};

export default User;
