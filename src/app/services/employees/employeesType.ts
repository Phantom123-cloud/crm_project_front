export type UpdateEmployeeForm = {
  notes: string;
  tradingСode: string;
  birthDate: string;
  dateFirstTrip: string;
  isInMarriage: boolean;
  isHaveChildren: boolean;
  isHaveDriverLicense: boolean;
  drivingExperience: string;
  isHaveInterPassport: boolean;
};

export type UpdateEmployeePassport = {
  fullName: string;
  passportNumber: string;
  citizenships: string[];
  birthDate: string;
  registrationAddress: string;
  actualAddress: string;
};
