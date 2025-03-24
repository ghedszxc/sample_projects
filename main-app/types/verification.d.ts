declare interface IVerificationSearch {
  page?: number;
  limit?: number;
  search?: string;
  date?: string | Date;
  userType?: string;
  organization?: string;
  site?: string;
  serviceProvider?: string;
  serviceProviderGroup?: string;
  createdBy?: string;
}
declare interface TVerification extends IBaseModel {
  email?: string;
  type?: string;
  userType?: string;
  givenName?: string;
  middleName?: string;
  surname?: string;
  site?: string | TSite;
  organization?: string | TOrganization;
  serviceProvider?: string | TServiceProvider;
  serviceProviderGroup?: string | TSPGroup;
  expiresAt?: string;
}

declare type TVerificationResponse = {
  items: TVerification[];
  pageRange: string;
  pages: number;
};
