export type Login = {
  email: string;
  password: string;
  remember: boolean;
};

export type Register = {
  email: string;
  password: string;
  fullName: string;
  arrayBlockedRoles?: string[];
  arrayAddRoles?: string[];
  roleTemplatesId?: string
};
