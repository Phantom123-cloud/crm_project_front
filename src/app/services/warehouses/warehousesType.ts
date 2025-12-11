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
  warehouseFrom: {
    user: {
      email: string;
      employee: {
        fullName: string;
      };
    };
  };
  warehouseTo: {
    user: {
      email: string;
      employee: {
        fullName: string;
      };
    };
  };

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
  stockItems: {
    id: string;
    quantity: boolean;
    product: {
      id: string;
      name: boolean;
    };
  }[];
};
