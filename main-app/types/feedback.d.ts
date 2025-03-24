declare type TFeedback = {
  _id?: string;
  description?: string;
  subject?: string;
  service?: string;
  provider?: string;
  location: string;
  status?: string;
  createdBy?: string;
  createdByName?: string;
  creaetdByEmail?: string;
  attachments?: TAttachment[];
  workOrders?: object[];
  organization: string;
  site: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  app: string;
  assigneeName?: string;
};

declare type TGetFeedbacksByPageSearchResponse = {
  items: TFeedback[];
  pageRange: string;
  pages: number;
};

declare type TAssignee = {
  _id: string;
  givenName: string;
  middleName: string;
  surname: string;
  organization: string;
  role: string;
};

declare type TCreatedBy = {
  _id: string;
  givenName: string;
  middleName: string;
  surname: string;
  organization: string;
  role: string;
};

declare type TUpdateFeedbackDescriptionOptions = {
  _id: string;
  description: string;
};
