declare type TPatrolLog = {
  _id?: string;
  site: string;
  organization?: string;
  cctvId: string;
  routeId: string;
  assignee: string;
  logQuestions: TPatrolLogQuestion[] | [];
  duration: number;
  startDateTimeDuration: string | Date;
  endDateTimeDuration: string | Date;
  reportStatus: string | TReportStatus;
  reportLabel: string;
  isActiveReportStatus: boolean;
  isLatePatrolling: boolean;
  editHistory?: TEditHistory[] | [];
  isLocked: boolean;
};

declare type TPatrolLogQuestion = {
  _id: string;
  options: boolean | string[];
  question: string;
  innerQuestions: TInnerQuestion[];
  recordingAttachment?: string | {};
  screenshotAttachment?: string;
  remarks?: string;
  routes?: string[] | [];
  isAppliedAll?: boolean;
};

declare type TInnerQuestion = {
  _id: string;
  name: string;
  answer?: string | string[];
  createdAt: string | Date;
  updatedAt: string | Date;
  site?: string;
  options: [];
};

declare type TEditHistory = {
  reason: string;
  datetime: string | Date;
};

declare type TReportStatus = {
  report: string;
  camera: string;
  location: string;
};
