declare type TBlockLevelUnit = {
  _id?: string;
  category: string;
  name: string;
  businessName: string;
  email: string;
  contact_number: string;
  resident: string;
  block: string;
  level: string;
  organization?: string;
};

declare type TBlockLevelUnitResponse = {
  items: TUnit[];
  pageRange: string;
  pages: number;
};

declare type TBlockLevelUnitsByPageSearchResponse = {
  items: TUnit[];
  pageRange: string;
  pages: number;
};

declare type TUpdateUnitOptions = {
  _id: string;
  category: string;
  name: string;
  businessName: string;
  email: string;
  contact_number: string;
};

declare type TItemUnits = {
  _id: string;
  name: string;
  businessName: any[];
  email: string;
  category: string;
  contact_number: string;
  organization: string;
  block: string;
  level: string;
  createdAt: Date;
  updatedAt: Date;
};
