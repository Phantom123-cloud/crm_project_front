import { useAllRoleQuery } from "@/app/services/role/roleApi";
import { Table, Button } from "antd";
import { useState } from "react";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";

const RolesData = () => {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { data, isLoading } = useAllRoleQuery({ page, limit: pageSize });

  const dataSource = (data?.data?.roles ?? []).map((item) => {
    return {
      key: item.id,
      name: item.name,
      typeName: item.typeName,
      descriptions: item.descriptions,
      actions: (
        <div className="flex gap-5">
          <Button
            color="primary"
            variant="outlined"
            icon={<EditOutlined />}
            //   onClick={() => getTypeInfo(item, "CHANGE_NAME")}
          >
            изменить
          </Button>
          <Button
            color="danger"
            variant="outlined"
            icon={<DeleteOutlined />}
            //   onClick={() => getTypeInfo(item, "DELETE")}
          >
            удалить
          </Button>
        </div>
      ),
    };
  });
  const columns = [
    {
      title: "Имя",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Тип",
      dataIndex: "typeName",
      key: "typeName",
    },
    {
      title: "Описание",
      dataIndex: "descriptions",
      key: "descriptions",
    },
    {
      title: "Действия",
      dataIndex: "actions",
      key: "actions",
    },
  ];

  const total = data?.data?.total ?? 1;
  return (
    <>
      <Table
        loading={isLoading}
        dataSource={dataSource}
        columns={columns}
        pagination={{
          pageSize,
          total,
          current: page,
          onChange: (page, pageSize) => {
            setPage(page);
            setPageSize(pageSize);
          },
          showSizeChanger: true,
        }}
      />
    </>
  );
};

export default RolesData;
