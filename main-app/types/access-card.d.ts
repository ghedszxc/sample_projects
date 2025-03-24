declare type TAccessCard = {
  _id?: string;
  userId?: string;
  staffNo: string;
  fullName: string;
  dateOrBirth: Date | string | null;
  dateOfJoin: Date | string | null;
  accessLevel: string | null;
  accessType: string | null;
  cardNo: string;
  pin: string;
  startDate: Date | string | null;
  endDate: Date | string | null;
  isActivated: boolean;
  isAntiPassBack: boolean;
  isLiftCard: boolean;
  liftAccessLevel?: string | null;
  liftAccessStartDate?: Date | string | null;
  liftAccessEndDate?: Date | string | null;
};

declare type TAccessCardByTypeItem = {
  _id: string;
  name: string;
  level: {
    _id: string;
    level: string;
  };
  block: {
    _id: string;
    name: string;
  };
  site: string;
  unit_owner: {
    _id: string;
    givenName: string;
    surname: string;
  };
  available: {
    physical: [];
    non_physical: [];
  }[];
  assigned: {
    physical: [];
    non_physical: [];
  }[];
};

declare type TAccessCardByTypeResult = {
  items: TAccessCardByTypeItem[] | [];
  pages: number;
  pageRange: string;
};

declare enum EAccessCardUserTypes {
  RESIDENT = "Resident/Tenant",
  CONTRACTOR = "Contractor",
  VISITOR = "Visitor",
}
