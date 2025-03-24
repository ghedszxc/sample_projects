declare interface IGroupSearch {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  date?: string | Date;
  serviceProvider?: string;
  site?: string;
}
declare interface TSPGroup extends IBaseModel {
  _id?: string;
  groupName: string;
  serviceProvider: string | TServiceProvider;
  site?: string | TSite;
  status?: string;
  members?: number;
  countryCode?: string; // PH or SG
  siteCollab?: TSiteCollab;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare type TSPGroupResponse = {
  items: TSPGroup[];
  pageRange: string;
  pages: number;
};
