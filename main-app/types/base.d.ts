declare interface IBaseModel {
  _id?: string;
  createdBy?: TUser | string;
  site?: TSite | string; // site _id
  organization?: TOrganization | string; // organization _id
  serviceProvider?: TServiceProvider | string; // service provider _id
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare type TSearchFilter = {
  pageParam?: number;
  limitParam?: number;
  searchParam?: string;
  filterParam?: string;
  filterType?: string;
  filterStatus?: string;
  startDateParam?: string | Date;
  endDateParam?: string | Date;
  organization?: string;
  site?: string;
  serviceProvider?: string;
  createdBy?: string;
  checklistId?: string;
  history?: string;
  userId?: string;
  getOnlyByUser?: boolean;
  appParam?: string;
};

declare type TPaginatedResponse<T> = {
  items: T[];
  pageRange: string;
  pages: number;
};

declare type TCreateResponse = {
  acknowledged: boolean;
  insertedId: string;
};

declare type TDeleteResponse = {
  acknowledged: boolean;
  deletedCount: number;
};

declare type TUpdateResponse = {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: null;
  upsertedCount: number;
  matchedCount: number;
};

declare type TAuthUserResponse = {
  accessToken: string;
  refreshToken: string;
};

declare type TErrorResponse = {
  name: string;
  message: string;
};

declare type TComment = {
  _id?: string;
  comment: string;
  attachments?: TAttachment[];
  createdBy: string;
  workOrder: string;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
  createdByType?: string;
};

declare interface Area {
  areaId: string;
  units: Unit[];
}

declare interface ToiletLocation {
  toiletId: string;
  units: Unit[];
}

declare interface Unit {
  unit_id: string;
  name: string;
  approve: boolean;
  reject: boolean;
  filledBy?: string;
  details?: Details;
}

declare interface Details {
  attachments: string[];
  remarks: string;
  workOrder: WorkOrder;
}

declare interface WorkOrder {
  location: string;
  description: string;
  service: string;
  provider: string;
  subject: string;
  status: string;
}
declare interface TGeolocation {
  latitude: number;
  longitude: number;
}

declare type TUpdateResponse = {
  acknowledged: boolean;
  modifiedCount: number;
  upsertedId: null;
  upsertedCount: number;
  matchedCount: number;
};
