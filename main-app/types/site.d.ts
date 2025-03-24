declare type TSiteSettings = {
  _id?: ObjectId; // Site ID
  anpr?: {
    showUnregisteredTransactions: boolean;
    cameras: TANPR[];
  };
  cctv?: {
    url: string | null;
    username: string | null;
    password: string | null;
  };
  virtualPatrolSettings: {
    isScreenshotOrRecordingEnabled: boolean;
  };
  autoCheckOut: boolean;
  qrCode?: boolean;
  manualCheckIn?: boolean;
  pickUpdropOffCompanyList?: string[];
  deliveryCompanyList?: string[];
  seasonPassType?: string[];
  taxiHireCompanies?: string[];
  privateHireCompanies?: string[];
  visitorAllotedTime?: TVisitorAllotedTime;
  contractorAllotedTime?: TContractorAllotedTime;
  siteInformation?: TSiteInformation;
  visitorContractorNotificationInterval?: {
    isEnabled: boolean;
    value: number;
  };
  virtualPatrolGracePeriod?: number | null;
  openBarrierForPickupDropoff: boolean;
  entryPass?: {
    isEnabled: boolean;
    api: string | null;
    port: number | null;
    serviceId: string | null;
  };
  autoCheckoutTimings?: TAutoCheckoutTimings;
  configForms?: TConfigForms[];
};

declare type TVisitorAllotedTime = {
  monday: { isEnabled: boolean; startTime: string; endTime: string };
  tuesday: { isEnabled: boolean; startTime: string; endTime: string };
  wednesday: { isEnabled: boolean; startTime: string; endTime: string };
  thursday: { isEnabled: boolean; startTime: string; endTime: string };
  friday: { isEnabled: boolean; startTime: string; endTime: string };
  saturday: { isEnabled: boolean; startTime: string; endTime: string };
  sunday: { isEnabled: boolean; startTime: string; endTime: string };
};

declare type TContractorAllotedTime = {
  monday: { isEnabled: boolean; startTime: string; endTime: string };
  tuesday: { isEnabled: boolean; startTime: string; endTime: string };
  wednesday: { isEnabled: boolean; startTime: string; endTime: string };
  thursday: { isEnabled: boolean; startTime: string; endTime: string };
  friday: { isEnabled: boolean; startTime: string; endTime: string };
  saturday: { isEnabled: boolean; startTime: string; endTime: string };
  sunday: { isEnabled: boolean; startTime: string; endTime: string };
  visitorContractorNotificationInterval?: number;
};

declare type TAutoCheckoutTimings = {
  monday: { isEnabled: boolean; endTime: string };
  tuesday: { isEnabled: boolean; endTime: string };
  wednesday: { isEnabled: boolean; endTime: string };
  thursday: { isEnabled: boolean; endTime: string };
  friday: { isEnabled: boolean; endTime: string };
  saturday: { isEnabled: boolean; endTime: string };
  sunday: { isEnabled: boolean; endTime: string };
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
  serviceProvider?: string;
  category?: string;
  siteCategory?: string;
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

declare type TSiteInformation = {
  bgImage?: string;
  description?: string;
  docs?: TDocs[];
};

declare type TDocs = {
  id: string;
  name: string;
};

declare type TANPR = {
  isEnabled: boolean;
  api: string | null;
  username: string | null;
  password: string | null;
  channel: number | null;
  type?: "CHECK-IN" | "CHECK-OUT" | "RESIDENTS";
};
