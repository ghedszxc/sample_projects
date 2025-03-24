declare type TSiteSettings = {
  _id?: string; // Site ID
  anpr?: boolean;
  qrCode?: boolean;
  manualCheckIn?: boolean;
  pickUpdropOffCompanyList?: string[];
  deliveryCompanyList?: string[];
  seasonPassType?: string[];
  taxiHireCompanies?: string[];
  privateHireCompanies?: string[];
};

declare type TSite = {
  _id?: string;
  name: string;
  address: string;
  services?: string[];
  email?: string;
  contactNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  status?: string;
  organization?: string;
  team?: number;
  residents?: number;
  serviceProviders?: number;
};

declare type TSiteResponse = {
  items: TSite[];
  pageRange: string;
  pages: number;
};

declare type TUpdateSiteNameOptions = {
  _id: string;
  name: string;
};

declare type TUpdateSiteEmailOptions = {
  _id: string;
  email: string;
};

declare type TUpdateSiteContactOptions = {
  _id: string;
  contactNumber: string;
};

declare type TUpdateSiteStatusOptions = {
  _id: string;
  status: string;
};
