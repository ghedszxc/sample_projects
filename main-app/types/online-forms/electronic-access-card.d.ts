declare type TElectronicAccessCard = {
  _id: string;
  typeOfForm: string;
  management: string;
  date: string;
  // Unit Owner's Particulars
  nameOfOwner: string;
  unitNumber: string;
  accessCardNumber: string;
  ownerNricNumber: string;
  ownerHomePhone: string;
  ownerR: string;
  // Nominator's Particular
  nominatorName?: string;
  nominatorUnitNumber?: string;
  // Nominee's Particulars (IF Applicable)
  tenantResidentType: string;
  tenantAccessCardNumber: string;
  nameOfTenant: string;
  tenancyCommencement: string;
  tenancyExpiry: string;
  tenantICPassportNumber: string;
  tenantContactNumber: string;
  tenantHp: string;
  tenantR: string;
  // Signature of Applicant
  signature: string;
  signedDate: string | Date;
  isAgree: boolean;
  // For Management Use
  applicationFee: string;
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
};

declare type TElectronicAccessCardUpdateSignature = {
  signature: string;
  signedDate: string | Date;
  updatedAt: string | Date;
  status: string;
};

declare type TGetAllTElectronicAccessCard = {
  items: TElectronicAccessCard[];
  pageRange: string;
  pages: number;
};
