declare type TPassKey = {
  _id?: string;
  passId?: string;
  templateId?: string;
  templateName?: string;
  roomName?: string;
  createdAt?: Date;
  site: string;
  status?: string;
};

declare type TPassKeyResponse = {
  items: TPassKey[];
  pageRange: string;
  pages: number;
};
