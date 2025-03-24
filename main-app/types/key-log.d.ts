declare type TKeyLog = {
  _id?: string;
  name?: string;
  codes?: string[];
  passType?: string; // Visitor Pass || Pass Key
  passId?: string;
  code?: string; // **deprecated**
  site?: string;
  status?: string;
  organization?: string;
  serviceProvider?: string;
  createdAt?: any;
  updatedAt?: string;
  location?: string;
  description?: string;
  qty?: number;
  nextNumber?: number;
  prefix?: string;
  keyNo?: number;
};

declare type TKeyLogResponse = {
  items: TKeyLog[];
  pageRange: string;
  pages: number;
};
