declare interface IBaseModel {
  _id?: string;
  createdBy?: TUser | string;
  site?: string; // site _id
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

declare type TSearchFilter = {
  pageParam?: number;
  limitParam?: number;
  searchParam?: string;
  startDateParam?: string;
  endDateParam?: string;
  organization?: string;
  createdBy?: string;
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
