declare type TFacilityBooking = {
  _id?: ObjectId;
  facility: string;
  site: string;
  timeSlots: string[];
  user: string;
  date: string;
  pax: number;
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
};

declare type TFacilityBookingsByPageSearchResponse = {
  items: TFacilityBooking[];
  pageRange: string;
  pages: number;
};

declare type TItemFacilityBooking = {
  _id: string;
  facility: string;
  site: string;
  timeSlots: string[];
  user: string;
  date: string;
  pax: number;
  createdAt: string;
  updatedAt: string;
};
