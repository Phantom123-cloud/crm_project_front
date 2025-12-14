export type Warehouse = {
  isActive: boolean;
  id: string;
  name: string;
  type: "CENTRAL" | "PERSONAL" | "TRIP";
  createdAt: Date;
  user: {
    employee: {
      fullName: string | null;
    } | null;
  };
};

export type StockMovement = {
  id: string;
  product: {
    id: string;
    name: string;
  };
  quantity: number;
  warehouseFrom: { id: string; name: string };
  warehouseTo: { id: string; name: string };

  status: "TRANSIT" | "RECEIVED" | "CANCELLED";
  stockMovementType:
    | "GOODS_RECEIPT"
    | "STOCK_TRANSFER"
    | "OUTBOUND_DELIVERY"
    | "SCRAP";
  createdAt: Date;
};

export type WarehousesApiData = {
  warehouses: Warehouse[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};

export type StockMovementsData = {
  stockMovements: StockMovement[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};

export type ProductsByWarehouse = {
  id: string;
  quantity: number;
  product: {
    id: string;
    name: string;
  };
};

export type WarehouseById = {
  warehouse: Warehouse;
  countTransitProduct: number;
  stockItems: ProductsByWarehouse[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};
