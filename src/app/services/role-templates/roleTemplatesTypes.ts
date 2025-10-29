export type Role = {
  name: string;
  descriptions: string;
  id: string;
};

export type RolesAddObj = {
  id: string;
  type: string;
  roles: Role[];
  descriptions: string;
};

export type AllRoleTemplates = {
  templates: {
    id: string;
    name: string;
    roles: Role[];
  }[];

  roles: RolesAddObj[];
};

export type UpdateRoleTemplates = {
  id: string;
  key?: "connect" | "disconnect";
  array?: string[];
  name?: string;
};
