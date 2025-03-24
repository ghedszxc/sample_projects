declare type TMoving = {
  _id?: string;
  typeOfForm: string;
  management: string;
  date: string;
  // Unit Owner's Particulars
  unitBlock: string;
  unitLevel: string;
  unitNumber: string;
  nameOfOwner: string;
  icPassportNumber: string;
  ownerContactNumber: string;
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
  chequeDate: string;
  // Common fields
  site: string;
  siteName: string;
  createdBy: string;
  createdByName: string;
  status?: string;
  reason?: string;
  isAgree: boolean;
};

declare type TMovingUpdateSignature = {
  signature: string;
  signedDate: string | Date;
  updatedAt: string | Date;
  status: string;
};

declare type TGetAllTMoving = {
  items: TMoving[];
  pageRange: string;
  pages: number;
};
