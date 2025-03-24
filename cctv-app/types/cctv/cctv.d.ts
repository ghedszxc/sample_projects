declare type TCctv = {
  _id?: string;
  name: string;
  ip: string;
  isActive: boolean;
  cctvBlock: string;
}

declare type TBlockCctv = {
  _id: string;
  name: string;
  ip: string;
  isActive: boolean;
}


declare type TGetCctvsByPageSearchResponse = {
  items: TCctv[];
  pageRange: string;
  pages: number;
}


declare type TGetCctvsByBlockIdResponse = {
  items: TBlockCctv[];
  pages: number;
}