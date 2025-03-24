declare interface TOccurrence extends IBaseModel {
  _id?: ObjectId;
  organization?: ObjectId;
  occurrenceId: string;
  date: string;
  totalInput: number;
  status: string;
  entryCounter?: number;
  closedAt?: string;
}

declare type TOccurrenceResponse = {
  items: TOccurrence[];
  pageRange: string;
  pages: number;
};
