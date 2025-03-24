declare type TKeyLog = {
  _id?: string;
  name: string;
  codes?: string[];
  passType?: string; // Visitor Pass || Pass Key
  passId?: string;
  code?: string; // **deprecated**
  site?: string;
  organization?: string;
  serviceProvider?: string;
  createdAt?: string;
  updatedAt?: string;
};

declare type TKeyLogResponse = {
  items: TKeyLog[];
  pageRange: string;
  pages: number;
};
