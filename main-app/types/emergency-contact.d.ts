declare type TEmergencyContact = {
  _id?: string;
  title?: string;
  dialCode?: string;
  phoneNumber?: string;
  category?: string;
  categoryName?: string | null;
  isDefault?: boolean;
  isShown?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
  site?: string;
  organization?: string;
  icon?: string | null;
};

type TEmergencyContactCategory = {
  _id?: string;
  categoryName?: string;
  site?: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type TGetEmergencyContactsByPageSearchResponse = {
  items: TEmergencyContact[];
  pageRange: string;
  pages: number;
};
