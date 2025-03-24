declare type TVehicleRegistration = {
  _id?: string;
  typeOfForm: string;
  management: string;
  date: string;
  // Unit Owner's Particulars
  unitOwner: string;
  ownerNRIC: string;
  ownerContactNumber: string;
  unitNumber: string;
  // Vehicle Information
  carOwner?: string;
  carPlateNumber?: string;
  make?: string;
  model?: string;
  colour?: string;
  // Agreement
  isAgreeToAbideRules: boolean;
  isAgreeToUnderstandVehicleRisk: boolean;
  isAgreeToParkProperly: boolean;
  isAgreeToBallotingCar: boolean;
  isAgreeToSubsCarApplication: boolean;
  //Acknowledgement of Application (Organization)
  recipientSignature: string;
  recipientSignedDate: string;
  // Common fields:
  site: string;
  siteName: string;
  attachments?: string[];
  createdBy: string;
  createdByName: string;
  status?: string;
  reason?: string;
};

declare type TVehicleRecordsUpdateSignature = {
  recipientSignature: string;
  recipientSignedDate: string | Date;
  updatedAt: string | Date;
  status: string;
}

declare type TGetAllTVehicleRegistration = {
  items: TVehicleRegistration[];
  pageRange: string;
  pages: number;
};
