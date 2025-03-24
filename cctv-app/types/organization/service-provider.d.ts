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
