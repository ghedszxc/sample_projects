declare type TVirtualPatrol = {
  _id: string;
  routeName: string;
  
  assignedUser : string;
  schedule?: {
    startTime?: string;
    endTime?: string;
    daysOfWeek?: string[];
  };

  cctvList?: string[];

  organization: string;
  site: string;
};

declare type TGetVirtualPatrolResponse = {
  items: TVirtualPatrol[];
  pageRange: string;
  pages: number;
};
