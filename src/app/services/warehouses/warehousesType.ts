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

export type WarehousesApiData = {
  warehouses: Warehouse[];
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
