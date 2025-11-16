export type CreateRole = {
  name: string;
  descriptions: string;
  roleTypeId: string;
};

export type Roles = {
  id: string;
  name: string;
  descriptions: string;
  typeName: string;
  typeId: string;
};

export type TemplateRolesItem = {
  id: string;
  type: string;
  descriptions: string;
  roles: {
    name: string;
    descriptions: string;
    id: string;
  }[];
};
