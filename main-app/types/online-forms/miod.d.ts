declare type TMovingInAndOutDeliveries = {
  _id: string;
  typeOfForm: string; // Moving In/Out & Delivery Records Form
  management: string; // management name
  date: string | Date; // editable date
  // Unit Owner's Particulars
  unitBlockId: string;
  unitBlockName: string;
  unitLevelId: string;
  unitLevelName: string;
  unitId: string;
  unitName: string;
  nameOfOwner: string;
  icPassportNumber: string;
  ownerContactNumber: string; // Home
  ownerHP: string;
  ownerOffice: string;
  // Mover's Particulars
  companyName: string;
  office: string;
  hp: string;
  nameOfSupervisor: string;
  iDPassportNumber: string;
  workPermit: string;
  address: string;
  vehicleType: string;
  vehicleRgn: string;
  // Undertakings by Subsidiary Proprietor / Tenant Signatory
  signature: string;
  signedDate: string | Date;
  // For Management Use
  chequeNumber: string;
  approvedBy: string;
  approvedByName: string;
  chequeDate: string | Date;
  // Common fields:
  isAgree: boolean;
  unitNumber: string;
  attachments?: string[];
  site: string;
  siteName: string; // full site name for indexing
  organization?: string;
  createdBy: string;
  createdByName: string; // use indexing here
  createdAt?: string | Date; // timestamp
  updatedAt?: string | Date;
  status?: string;
  reason?: string;
};

declare type TGetAllMiodRecords = {
  items: TMovingInAndOutDeliveries[];
  pageRange: string;
  pages: number;
};
