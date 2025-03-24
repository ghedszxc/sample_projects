declare type TFacility = {
  _id?: ObjectId;
  name: string;
  featuredImage: { _id: string; name: string } | null;
  site: string;
  gallery: { _id: string | ObjectId; name: string }[];
  monday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  tuesday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  wednesday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  thursday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  friday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  saturday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  sunday: {
    isEnabled: boolean;
    startTime: string;
    endTime: string;
    timeSlots: { _id: string | ObjectId; slot: string }[];
  };
  description: string;
  about: string;
  maintenanceDates: Date[];
  maintenanceWeekly: string[];
  maintenanceMonthly: string[];
  createdAt?: Date;
  updatedAt?: Date;
  status?: string;
  rulesAndPolicies?: string;
  icon?: string;
  hourInterval?: number;
};

declare type TFacilityResponse = {
  items: TFacility[];
  pageRange: string;
  pages: number;
};

declare type TFacilitiesByPageSearchResponse = {
  items: TFacility[];
  pageRange: string;
  pages: number;
};

declare type TUpdateFacilityNameOptions = {
  _id: string;
  name: string;
};

declare type TItemFacility = {
  _id: string;
  name: string;
  units: any[];
  createdAt: string;
  updatedAt: string;
  organization: string;
  site: string;
};
