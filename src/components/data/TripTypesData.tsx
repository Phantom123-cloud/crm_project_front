import { Button, Table } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import DeleteTripType from "../modals/delete/DeleteTripType";
import { useState } from "react";
import UpdateTripType from "../modals/update/UpdateTripType";
import RolesGuard from "../layout/RolesGuard";
import { useGetModalsInfo } from "@/hooks/useGetModalsInfo";
import { useAllTripTypesQuery } from "@/app/services/trip-types/tripTypesApi";

const TripTypesData = () => {
  const [isOpen, setOpen] = useState(false);
  const { getInfo, itemInfo } = useGetModalsInfo(setOpen, false);

  const { data, isLoading } = useAllTripTypesQuery();
  const dataSource = (data?.data ?? []).map((item) => {
    return {
      key: item.id,
      name: item.name,
      actions: (
        <div className="flex gap-5">
          {/* <RolesGuard access={"update_role_types"}> */}
          <Button
            color="primary"
            variant="outlined"
            icon={<EditOutlined />}
            onClick={() => getInfo(item, "UPDATE")}
            size="small"
          >
            изменить
          </Button>
          {/* </RolesGuard> */}
          {/* <RolesGuard access={"delete_role_types"}> */}
          <Button
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
            onClick={() => getInfo(item, "DELETE")}
            size="small"
          >
            удалить
          </Button>
          {/* </RolesGuard> */}
        </div>
      ),
    };
  });

  const columns = [
    {
      title: "Имя типа",
      dataIndex: "name",
      key: "name",
    },

    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];
  const { name, id, modalType, descriptions } = itemInfo;
  return (
    <>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={false}
      />
      <DeleteTripType
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        id={id}
        modalType={modalType}
      />
      <UpdateTripType
        isOpen={isOpen}
        setOpen={setOpen}
        name={name ?? ""}
        descriptions={descriptions ?? ""}
        id={id}
        modalType={modalType}
        loading={isLoading}
      />
    </>
  );
};

export default TripTypesData;
