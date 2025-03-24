declare type TPetRecords = {
  _id?: string;
  typeOfForm: string; // Pet Records Form
  management: string; // management name
  date: string | Date; // editable date
  // Details of Pet:
  nameOfPet: string;
  typeOfPet: string;
  breed?: string;
  licenseNumber?: string;
  // Owner's Particulars:
  nameOfOwner: string;
  unitId: string;
  unitNumber: string; // full unit name for indexing example: 28 / 30 / 02
  residentType?: string;
  contactNumber: string;
  email: string;
  correspondenceAddress: string;
  signature: string;
  signedDate: string | Date;
  isAgree: boolean;
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

declare type TPetRecordsUpdateSignature = {
  signature: string;
  signedDate: string | Date;
  updatedAt: string | Date;
  status: string;
};

declare type TGetAllPetRecords = {
  items: TPetRecords[];
  pageRange: string;
  pages: number;
};
