export type Login = {
  email: string;
  password: string;
  remember: boolean;
};

export type Register = {
  email: string;
  password: string;
  arrayBlockedRoles?: string[];
  arrayAddRoles?: string[];
  roleTemplatesId: string;
};

export type UpdateAccountCredentialsDto = {
  oldPassword: string;
  newPassword: string;
  email: string;
};
