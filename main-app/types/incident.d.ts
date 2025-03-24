declare type TConfirmPayload = {
  _id: string | ObjectId;
  status: string;
  approvedBy: string | ObjectId;
  reasonForReject: string;
  site: string | ObjectId;
};

declare interface IPhotos {
  name: string;
  id: string;
}

interface IBaseModel {
  _id?: ObjectId;
  organization?: string | ObjectId;
  site?: string | ObjectId;
  photos?: IPhotos[];
  createdAt?: string | Date;
  updatedAt?: string | Date;
}
declare interface IIncidentSearch {
  date?: string;
  search?: string;
  page?: number;
  limit?: number;
  organization?: string | ObjectId;
  site?: string | ObjectId;
  status?: string;
}
declare interface IIncidentInformation {
  siteInfo: {
    site: string | ObjectId;
    irNumber: string; // auto generated
    submittedBy: string | ObjectId; // user._Id
    designation: string | ObjectId; // not sure what is this
  };
  placeOfIncident: {
    block?: string | ObjectId; // building._Id
    level?: string | ObjectId; // level._Id
    unit?: string | ObjectId; // unit._Id
    other?: string;
    isOther: boolean;
  };
  incidentTypeAndTime: {
    typeOfIncident?: string; // free text
    incidentStart?: string; // 09:00am
    incidentEnd?: string; // 09:00 pm
  };
  submissionForm: {
    time?: string; // 09:00 am
    timeOfResponse?: string; // 09:00 am
    dateOfReport?: string; // 04/01/2023
  };
  complaintInfo: {
    complainant?: string;
    contact?: string;
    nric?: string;
  };
  recipientOfComplaint: {
    recipient?: string;
    contact?: string;
    nric?: string;
  };
  complaintReceivedTo: {
    receivedVia?: string; // "Phone" | "FCC Counter" | "Walkie Talkie" | "Other->Free text to specify"
    otherDescription?: string;
    briefDescription?: string;
  };
}

declare type TAnyUnitAffected = {
  description?: string;
  block?: string | ObjectId;
  level?: string | ObjectId;
  unit?: string | ObjectId;
  resident?: string | ObjectId;
  contact?: string;
  other?: string;
  isOther?: boolean;
};

declare interface IAffectedInjured {
  name?: string;
  nric?: string;
  contact?: string;
}
declare interface IAnyoneDamageToProperty {
  description?: string;
  block?: string | ObjectId;
  level?: string | ObjectId;
  unit?: string | ObjectId;
  name?: string;
  contact?: string;
  other?: string;
  isOther?: boolean;
}
declare interface IAffectedEntities {
  anyUnitAffectedValue?: string; // Yes, No, Uncertain
  affectedUnit: TAnyUnitAffected;
  anyoneAffectedValue?: string; // Yes, No, Uncertain
  affectedInjured: IAffectedInjured[];
  anyPropertyAffectedValue?: string; // Yes, No, Uncertain
  anyoneDamageToProperty: IAnyoneDamageToProperty[];
}

declare interface IIncidentAuthorities {
  // nameOfShiftIncharge
  personInCharge?: string | ObjectId; // only used in {nameOfShiftIncharge}
  shiftStart?: string; // shift start time {nameOfShiftIncharge} 09:00AM
  shiftEnd?: string; // shift start time {nameOfShiftIncharge} 09:00Pm
  //
  actionTaken?: string;
  status?: string; // drop down in UI? values?
  time?: string;
}
declare interface IAuthoritiesCalled {
  description?: string;
  vehicleNumber?: string | ObjectId;
  personInCharge?: string | ObjectId; // drop down in UI? values?
  caseReportReferenceNumber?: string;
}
declare interface IAuthorities {
  authoritiesValue?: string; // Yes details appended herein | No
  authoritiesCalled: IAuthoritiesCalled[];
  incidentThereAfter: IIncidentAuthorities;
  managementNotified: IIncidentAuthorities;
  incidentResolved: IIncidentAuthorities;
  causeOfIncident: IIncidentAuthorities;
  systemUsed: IIncidentAuthorities;
  cctvRecord: IIncidentAuthorities;
  particularsOwner: IIncidentAuthorities;
  whenIncidentResolve: IIncidentAuthorities;
  nameOfShiftIncharge: IIncidentAuthorities;
  securityImplication: IIncidentAuthorities;
}

declare interface IIncident extends IBaseModel {
  reportId?: string; // auto generated format: IR1, IR2
  incidentInformation: IIncidentInformation;
  affectedEntities: IAffectedEntities;
  authorities: IAuthorities;
  briefSummary: string;
  approvedBy?: string | ObjectId;
  status?: string; // pending || reject || approved
  reasonForReject?: string;
  date?: string | Date;
  site?: string;
}

declare type TIncidentResponse = {
  items: IIncident[];
  pageRange: string;
  pages: number;
};
