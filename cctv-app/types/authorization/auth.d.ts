declare type TSignUpForm = {
  givenName: string;
  surname: string;
  email: string;
  type: string;
  organization?: string;
  serviceProvider?: string;
  site?: string;
  role: string;
  isAdmin?: boolean;
};

declare type TSiteInvite = {
  name: string;
  givenName: string;
  surname: string;
  email: string;
  type: string;
  contactNumber?: string;
  organization?: string;
  serviceProvider?: string;
  site?: string;
  role: string;
};

declare type TUserRemoveForm = {
  id: string;
  serviceProviderGroup: string;
  status: string;
};

declare type TAuthUser = {
  accessToken: string;
  refreshToken: string;
};
