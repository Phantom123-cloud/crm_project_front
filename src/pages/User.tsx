import { useUserByIdQuery } from "@/app/services/users/usersApi";
import EmployeeData from "@/components/data/EmployeeForm";
import EmployeePassport from "@/components/data/EmployeePassport";
import EmpoleePassports from "@/components/data/EmpoleePassports";
import UserAccount from "@/components/data/UserAccount";
import { Tabs } from "antd";
import { useParams } from "react-router-dom";

const User = () => {
  const { id } = useParams();
  const { data } = useUserByIdQuery(id as string);

  const items = [
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
    {
      label: "Сканы документов",
      children: (
        <EmpoleePassports
          userId={id as string}
          passports={data?.data?.passports ?? []}
        />
      ),
    },
    {
      label: "Аккаунт",
      children: (
        <UserAccount
          userId={id as string}
          email={data?.data?.user?.email as string}
        />
      ),
    },
  ];

  return (
    <>
      <Tabs
        // onChange={onChange}
        defaultActiveKey="0"
        type="card"
        items={items.map((item, index) => {
          return {
            ...item,
            key: `${index}`,
            forceRender: true,
          };
        })}
      />
    </>
  );
};

export default User;
