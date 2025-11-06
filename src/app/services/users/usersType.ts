export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  isActive: boolean;
  isOnline: boolean;
};

export type UsersData = {
  users: User[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};
