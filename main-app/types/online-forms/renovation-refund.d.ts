declare type TRenovationRefund = {
  _id?: ObjectId;
  typeOfForm: string; // Pet Records Form
  // Dear...
  unitNumber: string;
  dateOfCompletion: string | Date; // Date of completion of Renovation / A & A works
  dateOfJointInspection: string | Date;
  remarks: string;
  // Submitted By
  submittedByApplicant: string; // Name of Applicant Name of MA Staff (Subsidiary Proprietor)
  signedByApplicant: string; // Signature of Applicant Name of MA Staff (Subsidiary Proprietor)
  dateOfRefund: string | Date;
  // Certified By
  certifiedByStaff: string; // Name of MA Staff
  signedByStaff: string; // Signature of MA Staff
  chequeNumber: string;
  // Received By
  receivedBy: string;
  signedByReceiver: string;
  signatureDate: string | Date;
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

declare type TGetAllRenovationRefund = {
  items: TRenovationRefund[];
  pageRange: string;
  pages: number;
};
