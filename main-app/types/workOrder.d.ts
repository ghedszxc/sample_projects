declare interface ISearchWorkOrder {
  page?: number;
  limit?: number;
  search?: string;
  startDate?: string | Date;
  endDate?: string | Date;
  status?: string;
  organization?: string;
  site?: string;
  provider?: string;
}

declare type TWorkOrder = {
  _id?: string;
  description: string;
  service: string;
  subject: string;
  provider: string;
  providerName?: string;
  status?: string;
  assignee?: string | TUser;
  assigneeName?: string;
  attachments?: string[];
  createdBy?: string | TUser;
  createdByName?: string;
  site: string;
  organization: string;
  location?: string;
  comments?: TComment[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
  feedback?: string;
};

declare type TWorkOrderResponse = {
  items: TWorkOrder[];
  pageRange: string;
  pages: number;
};
