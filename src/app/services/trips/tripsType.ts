export type TripsData = {
  trips: {
    isActive: boolean;
    id: string;
    name: string;
    dateFrom: string;
    dateTo: string;
    createdAt: Date;
    warehouses: {
      id: string;
    };
    tripTypes: {
      name: string;
    };
  }[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};
