declare type TVehicle = {
  _id?: string;
  name: string;
  type: string;
  subscriptionExpiry: string;
  idNumber: string;
  phoneNumber: string;
  plateNumber: string;
  checkIn: string;
  checkOut: string;
  registeredAt: string;
};

declare type TVehicleResponse = {
  items: TVehicle[];
  pageRange: string;
  pages: number;
};

declare type TGetVehiclesByPageSearchResponse = {
  items: TVehicle[];
  pageRange: string;
  pages: number;
};

declare type TUpdateVehiclePlateNumberOptions = {
  _id: string;
  plateNumber: string;
};
