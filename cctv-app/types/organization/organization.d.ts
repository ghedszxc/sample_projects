declare type TOrganization = {
  _id?: string;
  name: string;
  email?: string;
  contactNumber?: string;
  description?: string;
  sites?: string[];
  members?: number;
  isAdmin?: boolean;
  status?: string;
  logo?: {
    id?: string;
    name?: string;
  };
  createdBySpId?: string;
  createdAt?: string;
  updatedAt?: string;
};

declare type TOrganizationResponse = {
  items: TOrganization[];
  pageRange: string;
  pages: number;
};

declare type TUpdateOrgNameOptions = {
  _id: string;
  name: string;
};

declare type TUpdateOrgEmailOptions = {
  _id: string;
  email: string;
};

declare type TUpdateOrgContactOptions = {
  _id: string;
  contactNumber: string;
};

declare type TUpdateOrgStatusOptions = {
  _id: string;
  status: string;
};
