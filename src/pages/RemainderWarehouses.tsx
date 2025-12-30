import { useWarehousesRemainderQuery } from "@/app/services/warehouses/warehousesApi";
import { Checkbox, Table } from "antd";

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
      acc[`scrap:${warehouse.name}`] = warehouse.scrap;
      return acc;
    }, {}),
  }));

  return (
    <Table
      dataSource={dataSource}
      loading={isLoading}
      bordered
      pagination={false}
      scroll={{ x: true }}
    >
      <Column title="Наименование" dataIndex="name" key="name" />
      {data?.data?.header.map((warehouseName) => (
        <ColumnGroup title={warehouseName}>
          <Column
            title={<span className="text-orange-500">Списано</span>}
            dataIndex={`scrap:${warehouseName}`}
            key={`scrap:${warehouseName}`}
            align="center"
          />
          <Column
            title={<span className="text-[#da1e37]">Не принято</span>}
            dataIndex={`transit:${warehouseName}`}
            key={`transit:${warehouseName}`}
            align="center"
          />
          <Column
            title={<span className="text-[teal]">Остаток</span>}
            dataIndex={`countProduct:${warehouseName}`}
            key={`countProduct:${warehouseName}`}
            align="center"
          />
        </ColumnGroup>
      ))}

      <Column
        title="Списано (всего)"
        dataIndex="scrapTotal"
        key="scrapTotal"
        align="center"
      />
      <Column
        title="Остаток"
        dataIndex="remainder"
        key="remainder"
        align="center"
      />
    </Table>
  );
};

export default RemainderWarehouses;
