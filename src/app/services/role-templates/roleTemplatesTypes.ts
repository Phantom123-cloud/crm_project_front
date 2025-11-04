export type RoleItem = {
  name: string;
  descriptions: string;
  id: string;
};

export type RolesObj = {
  id: string;
  type: string;
  roles: RoleItem[];
  descriptions: string;
};

export type Templates = {
  id: string;
  name: string;
};

export type AllRoleTemplates = { roles: RolesObj[]; templates: Templates[] };

export type UpdateRoleTemplates = {
  id: string;
  arrayConnect?: string[];
  arrayDisconnect?: string[];
  name?: string;
};

