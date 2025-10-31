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

export type Templates = {
  id: string;
  name: string;
  roles: Role[];
};

export type AllRoleTemplates = {
  templates: Templates[];
  roles: RolesAddObj[];
};

export type UpdateRoleTemplates = {
  id: string;
  arrayConnect?: string[];
  arrayDisconnect?: string[];
  name?: string;
};

export type TemplateDataById = {
  roles: {
    id: string;
    type: string;
    roles: {
      name: string;
      descriptions: string;
      id: string;
    }[];
    descriptions: string;
  }[];
};
