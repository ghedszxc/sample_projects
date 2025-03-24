declare type TLOUI = {
  _id: string;
  typeOfForm: string;
  management: string;
  date: string;
  // Form details
  unitNumber: string;
  contractor: string;
  contractorOwner: string;
  dateFrom?: string;
  dateTo?: string;
  chequeAmount?: string;
  //Signatory Section
  nameOfSubProp: string;
  signature: string;
  signedDate: string | Date;
  subsidiaryEmail: string;
  renovationId?: string | ObjectId;
  // Common fields:
  isAgree: boolean;
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

declare type TSignaturePayloadTLOUI = {
  nameOfSubProp: string;
  signature: string;
  signedDate: string | Date;
  subsidiaryEmail: string;
  updatedAt: string | Date;
  status: string;
};

declare type TGetAllTLOUI = {
  items: TLOUI[];
  pageRange: string;
  pages: number;
};
