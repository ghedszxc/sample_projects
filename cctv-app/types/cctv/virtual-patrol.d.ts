declare type TVirtualPatrol = {
  _id: string;
  routeName: string;

  assignedUser: string[];
  schedule: {
    startTime?: string;
    endTime?: string;
    startDay?: string;
    endDay?: string;
    daysOfWeek?: string[];
    schedules?: any[];
  };

  cctvList?: TCctvList[];
  irAttachment?: string;

  organization: string;
  site: string;
  items: [];
};

declare type TGetVirtualPatrolResponse = {
  items: TVirtualPatrol[];
  pageRange: string;
  pages: number;
};

declare type TCctvList = {
  cctv: string;
  sequence: number;
};
