declare type TEvent = {
  _id?: string;
  title?: string;
  description?: string;
  serviceType?: string;
  start?: string;
  end?: string;
  duration?: number;
  organization?: string;
  site?: string;
  serviceProvider?: string;
  serviceProviderGroup?: string;
  serviceProviderMember?: string;
  serviceProviderGroupName?: string;
  serviceProviderMemberName?: string;
  // assignee: TAssignee;
  // createdBy: TCreatedBy;
};

declare type TGetEventsByPageSearchResponse = {
  data: TEvent[];
};

declare type TGetEventsByDateResponse = {
  items: TEvent[];
  pageRange: string;
  pages: number;
};

// declare type TAssignee = {
//   _id: string;
//   givenName: string;
//   middleName: string;
//   surname: string;
//   organization: string;
//   role: string;
// }

// declare type TCreatedBy = {
//   _id: string;
//   givenName: string;
//   middleName: string;
//   surname: string;
//   organization: string;
//   role: string;
// }
