type TAddress = {
  country: string;
  address1: string;
  address2: string;
  city: string;
  province: string;
  postalCode: string;
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
  role: string | TRole;
  createdAt?: string;
  updatedAt?: string;
  organization?: string | TOrganization;
  site: string | TSite;
  serviceProvider: string | TServiceProvider;
  serviceProviderGroup?: string | TSPGroup;
  sites?: string[];
  status: string;
  // resident
  dateOfBirth?: Date | string;
  nric?: string;
  vehicleModel?: string;
  vehicleNo?: string;
  vehicleColor?: string;
  block?: string;
  level?: string;
  unitNumber?: string;
  tenantDocument?: Array<Record<string, { _id: string; name: string }>>;
  profilePicture?: string;
  residentType?: string;
  isAdmin?: boolean;
  notificationSettings: TUserNotificationSettings;
  remarks?: string;
  deletionRequested?: boolean;
};

declare interface TUserSearchFilter extends TSearchFilter {
  type?: string;
  site?: string;
  organization?: string;
  serviceProvider?: string;
}
