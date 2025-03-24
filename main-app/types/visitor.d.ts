interface IBaseVisitor {
  _id: string;
  name: string;
  firstName: string;
  lastName: string;
  type: string;
  contractorType?: string;
  nric: string;
  phoneNumber: string;
  email: string;
  checkIn?: string;
  checkOut?: string;
  remarks: string;
  registeredAt?: string;
  updatedAt?: Date;
  organization?: string;
  site?: string;

  pickupDropoffType?: string;
  members?: any[];
  deliveryType?: string;

  optionAccessCard?: string;
}

declare interface IGuest extends IBaseVisitor {
  companyName?: string;
  block?: string;
  unit?: string;
  visitorPass?: string;
  plateNumber?: string;
  passNumber?: string;
  passKeyNumber?: string;
  parkingBlock?: string;
  parkingUnit?: string;
}

interface IPass {
  _id: string; // inpreparation if we add status of keys received or returned
  name: string; // key.name
  code: string; // key.code
  passReceivedDate?: Date;
  passReturnDate?: Date; //
  isPassReturned?: boolean; // visitor pass should returned to the guard
}
interface IKeys {
  _id: string; // inpreparation if we add status of keys received or returned
  name: string; // key.name
  code: string; // key.code
  keyReceivedDate?: Date;
  keyReturnDate?: Date;
  isPKeyReturned?: boolean; // visitor key should returned to the guard
}
declare interface IContractor extends IBaseVisitor {
  companyName?: string;
  visitorPass?: string; // key.name
  plateNumber?: string;
  passNumber?: string; // key.passId
  passKeyNumber?: string; // key.code
  passReceivedDate?: string;
  keyReceivedDate?: string;
  passReturnDate?: string;
  keyReturnDate?: string;
  isPassReturned?: boolean; // visitor pass should returned to the guard
  isKeyReturned?: boolean; // pass key should returned to the guard
  passKeys?: string[]; // [key.code]
  // passKeys?: IPass[] | IKeys[]; // in preparation only
  isStatusCleared?: boolean; // if contractor returned all keys and passes he/she should be cleared
}

declare interface IDelivery extends IBaseVisitor {
  companyName?: string;
  visitorPass?: string;
  plateNumber?: string;
}

declare interface IWalkIn extends IBaseVisitor {
  block?: string;
  unit?: string;
}

declare interface TVisitor extends IBaseVisitor {
  companyName?: string;
  visitorPass?: TKeyLog | any;
  plateNumber?: string;
  passNumber?: string;
  passKeyNumber?: string;
  parkingBlock?: string;
  parkingUnit?: string;
  passReceivedDate?: string;
  keyReceivedDate?: string;
  passReturnDate?: string;
  keyReturnDate?: string;
  isPassReturned: boolean; // visitor pass should returned to the guard
  isKeyReturned: boolean; // pass key should returned to the guard
  passKeys?: string[]; // [key.code]
  // passKeys?: IPass[] | IKeys[]; // in preparation only
  isStatusCleared?: boolean; // if contractor returned all keys and passes he/she should be cleared
  block?: string;
  unit?: string;
  blockLevel?: string;
  emailSending: any;
  actualCheckIn?: string;
  actualCheckOut?: string;
}

declare type TVisitorResponse = {
  items: TVisitor[];
  pageRange: string;
  pages: number;
};

declare type TGetVisitorsByPageSearchResponse = {
  items: TVisitor[];
  pageRange: string;
  pages: number;
};
