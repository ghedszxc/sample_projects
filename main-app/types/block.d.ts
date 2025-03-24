declare type TBlock = {
  _id?: string;
  name: string;
  organization?: string;
  site?: string;
};

declare type TBlockResponse = {
  items: TBlock[];
  pageRange: string;
  pages: number;
};

declare type TBlocksByPageSearchResponse = {
  items: TBlock[];
  pageRange: string;
  pages: number;
};

declare type TUpdateBlockNameOptions = {
  _id: string;
  name: string;
};

declare type TItemBlock = {
  _id: string;
  name: string;
  units: any[];
  createdAt: string;
  updatedAt: string;
  organization: string;
  site: string;
};
