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
