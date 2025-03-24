declare type TRenovation = {
  _id?: string;
  typeOfForm: string; // Pet Records Form
  management: string; // management name
  date: string | Date; // editable date
  // Unit Owner's Particulars
  nameOfOwner: string;
  unitNumber: string;
  ownerContactNumber: string; // Home
  ownerOfficeNumber?: string;
  ownerMobileNumber?: string;
  // Contractor's Particulars
  companyName: string;
  registrationNumber: string;
  contractorAddress: string;
  contractorPersonInCharge: string;
  contractorContactNumber: string;
  contractorOfficeNumber?: string;
  contractorHomePhone?: string;
  // Summary of Proposed Renovation / Addition & Alteration Works (Attach separate sheet if applicable)
  startDate: string | Date;
  endDate: string | Date;
  hackingPeriodFrom: string | Date;
  hackingPeriodTo: string | Date;
  isAgree: boolean;
  // Signatory
  signatureOfSubsidiaryProprietors: string;
  signatureOfSubsidiaryDate: string | Date;
  signatureOfContractor: string;
  signatureOfContractorDate: string | Date;
  // For Management Used (Optional)
  processedBy?: string;
  processedByName?: string;
  workToBeCompletedDate?: string | Date;
  renovationDeposit?: string; // $$$
  address?: string;
  personInCharge?: string;
  officeNumber?: string;
  mobileNumber?: string;
  homePhone?: string;
  chequePayableTo?: string;
  chequeNumber?: string;
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

declare type TRenovationUpdateSignature = {
  receivedBy: string;
  signedByReceiver: string;
  signatureDate: string | Date;
  updatedAt: string | Date;
  status: string;
};

declare type TGetAllRenovation = {
  items: TRenovation[];
  pageRange: string;
  pages: number;
};
