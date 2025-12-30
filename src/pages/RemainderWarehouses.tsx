import { useWarehousesRemainderQuery } from "@/app/services/warehouses/warehousesApi";
import { Table } from "antd";
const { Column, ColumnGroup } = Table;

const RemainderWarehouses = () => {
  const { data, isLoading } = useWarehousesRemainderQuery();

  const dataSource = data?.data?.body.map((item) => ({
    key: item.id,
    name: item.name,
    scrapTotal: item.scrapTotal,
    remainder: item.remainder,
    ...item.warehouses.reduce<Record<string, any>>((acc, warehouse) => {
      acc[`countProduct:${warehouse.name}`] = warehouse.countProduct;
      acc[`transit:${warehouse.name}`] = (
        <span
          style={{
            color: warehouse.transit > 0 ? "red" : "",
          }}
        >
          {warehouse.transit}
        </span>
      );
      return acc;
    }, {}),
  }));

  return (
    <Table
      dataSource={dataSource}
      loading={isLoading}
      bordered
      pagination={false}
      scroll={{ x: "max-content" }}
    >
      <Column
        title="Наименование"
        dataIndex="name"
        key="name"
        // width={250}
        fixed="left"
      />
      {data?.data?.header.map((warehouseName) => (
        <ColumnGroup title={warehouseName} key={warehouseName}>
          <Column
            title={<span className="text-[#da1e37]">Не принято</span>}
            dataIndex={`transit:${warehouseName}`}
            key={`transit:${warehouseName}`}
            align="center"
            // width={100}
          />
          <Column
            title={<span className="text-[teal]">Остаток</span>}
            dataIndex={`countProduct:${warehouseName}`}
            key={`countProduct:${warehouseName}`}
            align="center"
            // width={100}
          />
        </ColumnGroup>
      ))}

      <Column
        title="Списано"
        dataIndex="scrapTotal"
        key="scrapTotal"
        align="center"
        fixed="right"
        // width={100}
      />
      <Column
        title="Остаток"
        dataIndex="remainder"
        key="remainder"
        align="center"
        fixed="right"
        // width={100}
      />
    </Table>
  );
};

export default RemainderWarehouses;
