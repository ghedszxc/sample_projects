declare type TBlockLevel = {
  _id?: string;
  block?: string;
  level: string;
  organization?: string;
};

declare type TBlockLevelResponse = {
  items: TBlockLevel[];
  pageRange: string;
  pages: number;
};

declare type TBlocksLevelByPageSearchResponse = {
  items: TBlockLevel[];
  pageRange: string;
  pages: number;
};

declare type TUpdateBlockLevelNameOptions = {
  _id: string;
  level: string;
};

declare interface IItemLevel {
  _id: string;
  level: number;
  organization: any;
  block: string;
  units: string[];
  createdAt: Date;
  updatedAt: Date;
}
