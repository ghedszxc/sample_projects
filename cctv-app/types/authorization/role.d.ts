declare enum EModuleListType {
  ADMIN = "admin",
  MA = "organization",
  SITE = "site",
  SERVICE_PROVIDER = "service-provider",
  SERVICE_PROVIDER_MEMBER = "service-provider-member",
}

declare enum EModuleType {
  MAIN = "main",
  SERVICE = "service",
}

declare type TPermission = {
  name?: string;
  slug?: string;
  isEnabled?: boolean;
};

declare type TModule = {
  name?: string;
  moduleType?: EModuleType;
  slug?: string;
  read?: TPermission[];
  create?: TPermission[];
  update?: TPermission[];
  delete?: TPermission[];
};

declare type TRole = {
  _id?: string;
  roleName?: string;
  userId?: string;
  type?: EModuleListType;
  modules?: TModule[];
  organization?: string;
  site?: string;
  serviceProvider?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

declare class MRole implements TRole {
  _id?: string;
  roleName?: string;
  userId?: string;
  type?: EModuleListType;
  modules?: TModule[];
  organization?: string;
  site?: string;
  serviceProvider?: string;
  createdAt?: Date;
  updatedAt?: Date;

  constructor({
    _id,
    roleName = "",
    userId,
    type = EModuleListType.ADMIN,
    modules = [],
    organization = "",
    site = "",
    serviceProvider = "",
    createdAt = new Date(),
    updatedAt,
  }: Partial<TRole> = {}) {
    this._id = _id;
    this.roleName = roleName;
    this.userId = userId;
    this.type = type;
    this.modules = modules;
    this.organization = organization;
    this.site = site;
    this.serviceProvider = serviceProvider;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }
}
