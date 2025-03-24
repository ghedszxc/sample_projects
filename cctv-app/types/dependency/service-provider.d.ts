declare interface IServiceProviderSearch {
  page?: number;
  limit?: number;
  search?: string;
  organization?: string | ObjectId;
  site?: string | ObjectId;
  service?: string;
  date?: string | Date;
}

declare type TServiceProvider = {
  _id?: string;
  name: string;
  email?: string;
  contactNumber?: string;
  description?: string;
  organization: string;
  site: string | TSite;
  team?: string[];
  service_access?: string[];
  status?: string;
  createdAt?: string;
  updatedAt?: string;
  services?: string[];
  service?: string;
};

declare type TServiceProviderResponse = {
  items: TOrganization[];
  pageRange: string;
  pages: number;
};

declare type TServiceProviderAsOptions = {
  value: string;
  title: string;
};

declare type TUpdateServiceServiceAccessOptions = {
  _id: string;
  service_access: string[];
};

declare type TUpdateServiceProviderNameOptions = {
  _id: string;
  name: string;
};

declare type TUpdateServiceProviderEmailOptions = {
  _id: string;
  email: string;
};

declare type TUpdateServiceProviderContactOptions = {
  _id: string;
  contactNumber: string;
};

declare type TUpdateServiceProviderServicesOptions = {
  _id: string;
  services: string[];
};

declare type TUpdateServiceProviderStatusOptions = {
  _id: string;
  status: string;
};
