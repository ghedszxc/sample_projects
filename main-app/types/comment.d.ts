declare type TComment = {
  seenByNames: string;
  _id?: string;
  comment: string;
  attachments?: TAttachment[];
  createdBy: string;
  workOrder: string;
  createdAt?: string;
  updatedAt?: string;
  createdByName?: string;
  createdByType?: string;
  justify?: string;
};

declare type TCommentResponse = {
  items: TComment[];
  pageRange: string;
  pages: number;
};

declare type TCommentPaginated = {
  items: TComment[];
  pageRange: string;
  pages: number;
};
