declare interface TSearchOccurrenceEntry extends IBaseModel {
  occurrenceId: number;
  serialNumber: string;
  version: string;
  date: string;
  subject: TLogSubject;
  occurrence: string;
  signature: TUser;
  attachmentReport: IIncident;
}

declare type TSearchOccurrenceEntryResponse = {
  items: TSearchOccurrenceEntry[];
  pageRange: string;
  pages: number;
};

declare interface TOccurrenceEntry extends IBaseModel {
  organization?: ObjectId;
  site?: ObjectId;
  dailyOccurrenceBookId: ObjectId;
  serialNumber: string;
  subject?: string | TLogSubject;
  date: string | Date;
  occurrence: string;
  attachmentReport?: string | IIncident;
  signature?: string | TUser;
  version?: string;
  isCrossOut?: boolean;
}

declare type TOccurrenceEntryResponse = {
  items: TOccurrenceEntry[];
  pageRange: string;
  pages: number;
};
