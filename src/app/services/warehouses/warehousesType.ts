export type WarehousesApiData = {
  warehouses: {
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
  }[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};
