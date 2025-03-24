declare type TAnnouncement = {
  _id?: string;
  title?: string;
  content?: string;
  file?: Array<Record<string, { _id: string; name: string }>>;
  recipients?: string[];
  site?: string;
  noExpiration?: boolean;
  startDate?: Date | string;
  endDate?: Date | string;
  organization?: string;
  createdAt?: Date | string;
  updatedAt?: Date | string;
};

type TGetAnnouncementsByPageSearchResponse = {
  items: TUser[];
  pageRange: string;
  pages: number;
};
