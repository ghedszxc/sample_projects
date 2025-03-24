declare type TBicycleParking = {
  _id: string;
  typeOfForm: string;
  management: string;
  date: string;
  // Unit Owner's Particulars
  unitOwner: string;
  unitNumber: string;
  ownerContactNumber: string;
  ownerHome: string;
  ownerHP: string;
  // Reason for Application
  reasonForApplication: string;
  // Agreement
  isAgreeToAboveCondition: boolean;
  isAgreeToLeaseMoveOut: boolean;
  isAgree: boolean;
  // Signature of Applicant
  ownerSignature: string;
  ownerSignedDate: string | Date;
  ownerEmail: string;
  //Acknowledgement of Application (Organization)
  recipient: string; //Acknowledge By Who
  recipientSignature: string;
  recipientSignedDate: string | Date;
  recipientEmail: string;
  // For Management Use
  tagNumber: string;
  approvedBy: string;
  approvedDate: string;
  // Common fields
  site: string;
  siteName: string;
  createdBy: string;
  createdByName: string;
  status?: string;
  reason?: string;
};

declare type TBicycleParkingSignatureUpdate = {
  recipientSignature: string;
  recipientSignedDate: string | Date;
  updatedAt: string | Date;
  status: string;
};

declare type TGetAllTBicycleParking = {
  items: TBicycleParking[];
  pageRange: string;
  pages: number;
};
