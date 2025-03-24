type TNotification = {
  _id?: string;
  namespace?: "/organization-events" | "/visitor-events" | "/feedback-events";
  module?:
    | "service-provider"
    | "resident"
    | "form"
    | "role"
    | "feedback"
    | "work-order"
    | "calendar"
    | "key"
    | "visitor"
    | "building"
    | "cctv"
    | "announcement"
    | "emergency-contact"
    | "daily-occurrence-book"
    | "incident";
  room?: string;
  event?: string;
  users?: {
    _id?: string;
    hasRead?: boolean;
    isArchived?: boolean;
  }[];
  data?: Record<string, any> | Record<string, any>[];
  message?: { title?: string; content?: string };
  createdAt?: Date;
  updatedAt?: Date;
};

type TGetNotificationsByPageSearchResponse = {
  items: TUser[];
  pageRange: string;
  pages: number;
};

