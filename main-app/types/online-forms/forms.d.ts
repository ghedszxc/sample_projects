declare type TForm = {
  _id?: string;
  typeOfForm: string; // Pet Records Form
  management: string; // management name
  date: string | Date; // editable date
  // Other Details
  unitNumber: string; // full unit name for indexing example: 28 / 30 / 02
  // Common fields:
  organization?: string;
  site: string;
  siteName: string; // full site name for indexing
  createdBy: string;
  createdByName: string; // use indexing here
  approvedBy?: string;
  approvedByName?: string; // full name
  attachments?: string[];
  createdAt?: string | Date; // timestamp
  updatedAt?: string | Date;
  status?: string;
  reason?: string;
};

declare type TUpdateFormStatus = {
  status: string;
  approvedBy: string;
  approvedName: string;
  updatedAt?: string | Date;
  reason?: string;
};

declare type TUpdateManagementInfo = {
  chequeNumber?: string;
  tagNumber?: string;
  approvedBy?: string;
  approvedName?: string;
  approvedDate?: string | Date;
  status?: string;
  reason?: string;
};

declare type TGetFormByPageSearchResponse = {
  items: TForm[];
  pageRange: string;
  pages: number;
};
