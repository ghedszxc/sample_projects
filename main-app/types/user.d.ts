declare type TStripeAccount = {
  _id?: ObjectId;
  stripeAccountId: string;
  status?: ACCOUNT_STATUS;
};

declare type TAddress = {
  country: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
};

type TUserNotificationSettings = {
  "service-provider": boolean;
  resident: boolean;
  facility: boolean;
  form: boolean;
  role: boolean;
  feedback: boolean;
  "work-order": boolean;
  calendar: boolean;
  key: boolean;
  visitor: boolean;
  building: boolean;
  cctv: boolean;
  announcement: boolean;
  "emergency-contact": boolean;
  "daily-occurrence-book": boolean;
  incident: boolean;
};

declare type TUser = {
  _id: string;
  givenName: string;
  middleName?: string;
  surname: string;
  address: TAddress;
  email: string;
  primaryPhone?: string;
  mobilePhone?: string;
  password: string;
  type: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
  organization?: string | TOrganization;
  site: string | TSite;
  serviceProvider: string | TServiceProvider;
  serviceProviderGroup?: string | TSPGroup;
  sites?: string[];
  status: string;
  //resident
  dateOfBirth?: Date | string;
  nric?: string;
  vehicleModel?: string;
  vehicleNo?: string;
  vehicleColor?: string;
  block?: string;
  level?: string;
  unitNumber?: string;
  tenantDocument?: Array<Record<string, { _id: string; name: string }>>;
  carRegistration?: Array<Record<string, { _id: string; name: string }>>;
  profilePicture?: string;
  residentType?: string;
  isAdmin?: boolean;
  notificationSettings: TUserNotificationSettings;
  remarks?: string;
  deletionRequested?: boolean;
  stripeAccount?: TStripeAccount;
};

declare type TGetUsersByPageSearchResponse = {
  items: TUser[];
  pageRange: string;
  pages: number;
};
