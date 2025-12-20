import { Table } from "antd";
import DeleteTripType from "../modals/delete/DeleteTripType";
import UpdateTripType from "../modals/update/UpdateTripType";
type Props = {
  tripTypes: { id: string; name: string }[];
  isLoading: boolean;
  page: number;
  limit: number;
  total: number;
  onChange: (page: number, pageSize: number) => void;
};

const TripTypesData: React.FC<Props> = ({
  tripTypes,
  isLoading,
  page,
  limit,
  total,
  onChange,
}) => {
  const dataSource = tripTypes.map((item) => {
    return {
      key: item.id,
      name: item.name,
      actions: (
        <div className="flex gap-5">
          {/* <RolesGuard access={"update_role_types"}> */}
          <UpdateTripType
            name={item.name}
            id={item.id}
            loading={isLoading}
            page={page}
            limit={limit}
          />
          {/* </RolesGuard> */}
          {/* <RolesGuard access={"delete_role_types"}> */}
          <DeleteTripType
            name={item.name}
            id={item.id}
            page={page}
            limit={limit}
          />
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
  return (
    <Table
      loading={isLoading}
      dataSource={dataSource}
      columns={columns}
      pagination={{
        pageSize: limit,
        total,
        current: page,
        onChange,
        showSizeChanger: true,
      }}
    />
  );
};

export default TripTypesData;
