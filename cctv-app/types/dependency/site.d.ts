declare type TSiteSettings = {
  _id?: ObjectId; // Site ID
  anpr?: {
    isEnabled: boolean;
    api: string | null;
    username: string | null;
    password: string | null;
    channel: number | null;
  };
  cctv?: {
    url: string | null;
    username: string | null;
    password: string | null;
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
  siteInformation?: {
    bgImage: string | null;
    description: string | null;
    docs: [];
  };
  visitorContractorNotificationInterval?: {
    isEnabled: boolean;
    value: number;
  };
  virtualPatrolGracePeriod?: number | null;
  virtualPatrolSettings?: TVirtualPatrolSettings;
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

declare type TVirtualPatrolSettings = {
  isScreenshotEnabled: boolean;
  isRecordingEnabled: boolean;
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
