declare type TVisitorPass = {
  _id?: string;
  passNumber: string;
  type: string;
  template: string;
  size: string;
  subGroup: string;
  status: string;
  createdAt: Date;
  parameter: string;
  site: string;
};

declare type TVisitorPassByPageSearchResponse = {
  items: TVisitorPass[];
  pageRange: string;
  pages: number;
};

declare type TItemVisitorPass = {
  _id?: string;
  passNumber: string;
  templateName: string;
  subGroup: string[];
  status: string;
  createdAt: Date;
  parameter: string;
};
