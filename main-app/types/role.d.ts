declare interface ISearchRole {
  page?: number;
  limit?: number;
  search?: string;
  type?: string;
  organization?: string;
  site?: string;
  userId?: string;
  serviceProvider?: string;
}

declare type Permission = {
  name: string;
  slug: string;
  isEnabled: boolean;
};

declare type Module = {
  name: string;
  moduleType: string;
  slug: string;
  application?: string;
  read: Permission[];
  create?: Permission[];
  update?: Permission[];
  delete?: Permission[];
};

declare type TRole = {
  _id?: string;
  roleName: string;
  name: string;
  permissions: Module[];
  createdBy: string;
  description?: string;
  organization?: string;
  site?: string;
  serviceProvider?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
};

declare type RoleData = {
  roleName: string;
  modules: Module[];
};

declare type TRoleResponse = {
  items: TRole[];
  pageRange: string;
  pages: number;
};
