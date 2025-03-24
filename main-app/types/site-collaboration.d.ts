declare interface ISiteCollabSearch {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  service?: string;
  date?: string | Date;
  serviceProvider?: string;
  site?: string;
  isNotAssigned?: string;
}

declare interface TSiteCollab extends IBaseModel {
  _id?: string;
  serviceProvider: string | TServiceProvider;
  site: string | TSite;
  status: string; // pending | approved | rejected
  updateStatusBy?: string;
  assignedGroup?: string | TSPGroup;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare type TSiteCollabResponse = {
  items: TSiteCollab[];
  pageRange: string;
  pages: number;
};
