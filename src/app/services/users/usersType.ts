export type User = {
  id: string;
  email: string;
  roleTemplatesId: string;
  createdAt: Date;
  isActive: boolean;
  isOnline: boolean;
  employee?: Employee;
};

export type Employee = {
  birthDate: string | null;
  fullName: string;
  passportNumber: string;
  notes: string | null;
  registrationAddress: string | null;
  actualAddress: string | null;
  phones: { number: string; option: PhoneSelection; id: string }[];
  dateFirstTrip: string | null;
  isHaveChildren: boolean;
  isHaveDriverLicense: boolean;
  isHaveInterPassport: boolean;
  isInMarriage: boolean;
  citizenships: {
    id: string;
    code: string;
    localeRu: string;
    localeEn: string;
  }[];
  tradingСode: string | null;
  drivingExperience: string;
  foreignLanguages: {
    level: LanguageLevel;
    id: string;
    language: {
      id: string;
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

export type PhoneSelection = "mobile" | "whatsapp" | "telegram";
export type LanguageLevel =
  | "A1"
  | "A2"
  | "B1"
  | "B2"
  | "C1"
  | "C2"
  | "SPOKEN"
  | "NATIVE";
