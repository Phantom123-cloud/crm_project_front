type RoleItem = {
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
  roles: RoleItem[];
};

export type AllRoleTemplates = {
  templates: Templates[];
};

export type UpdateRoleTemplates = {
  id: string;
  arrayConnect?: string[];
  arrayDisconnect?: string[];
  name?: string;
};

export type TemplateDataById = {
  roles: RolesObj[];
};
