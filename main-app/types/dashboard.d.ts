declare type TDashboardData = {
  title: string;
  value: number;
  icon: string;
  color: string;
  percentage: string;
};

declare type TDashboardResponse = {
  charts: TDashboardData[];
  workOrders: TDashboardData[];
  feedbacks: TDashboardData[];
  facility: TDashboardData;
};

interface INoOfVisitors {
  series: any;
  options: any;
}
