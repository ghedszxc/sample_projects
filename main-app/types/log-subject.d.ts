declare interface TLogSubject extends IBaseModel {
  _id?: ObjectId;
  organization?: ObjectId;
  subject: string;
  addedBy: string;
  site: string;
  createdAt?: string;
}

declare type TLogSubjectResponse = {
  items: TLogSubject[];
};
