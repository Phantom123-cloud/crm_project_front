export type User = {
  id: string;
  email: string;
  fullName: string;
  createdAt: Date;
  isActive: boolean;
  isOnline: boolean;
  employee?: Employee;
};

export type Employee = {
  birthDate: string | null;
  phones: { number: string; option: PhoneSelection }[];
  dateFirstTrip: string | null;
  notes: string | null;
  isHaveChildren: boolean;
  isHaveDriverLicense: boolean;
  isHaveInterPassport: boolean;
  isInMarriage: boolean;
  citizenships: { code: string; localeRu: string; localeEn: string }[];
  tradingСode: string | null;
  drivingExperience: number;
  foreignLanguages: {
    level: LanguageLevel;
    language: {
      localeRu: string;
      localeEn: string;
    };
  }[];
};

export type UsersData = {
  users: User[];
  total: number;
  countPages: number;
  page: number;
  limit: number;
};

type PhoneSelection = "mobile" | "whatsapp" | "telegram";
type LanguageLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "SPOKEN"
  | "NATIVE";
