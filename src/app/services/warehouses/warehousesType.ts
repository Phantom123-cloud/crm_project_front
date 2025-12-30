export type Warehouse = {
  isActive: boolean;
  id: string;
  name: string;
  type: "CENTRAL" | "PERSONAL" | "TRIP";
  createdAt: Date;
  user: {
    email: string;
    id: string;
  };
  countTransit: number;
};
export type StockMovementType =
  | "GOODS_RECEIPT"
  | "STOCK_TRANSFER"
  | "OUTBOUND_DELIVERY"
  | "SCRAP"
  | "DELIVERY"
  | "SALE"
  | "GIFT";

export type StockMovement = {
  id: string;
  product: {
    id: string;
    name: string;
  };
  reason: string;
  toWhomOrFromWhere: "SPV" | "SUPPLER" | "CLIENT";
  quantity: number;
  warehouseFrom: { id: string; name: string };
  warehouseTo: { id: string; name: string };
  status: "TRANSIT" | "RECEIVED" | "CANCELLED";
  stockMovementType: StockMovementType;
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

export type WarehousesRemainder = {
  body: {
    id: string;
    name: string;
    remainder: number;
    scrapTotal: number;
    warehouses: {
      name: string;
      countProduct: number;
      warehouseId: string;
      transit: number;
      scrap: number;
    }[];
  }[];
  header: string[];
};
