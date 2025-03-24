const { theme } = useLocal();

const { useLocalFetchUtil } = useUtils();
interface IDashboardParam {
  userId?: string;
  type?: string;
  orgId?: string;
  serviceProviderId?: string;
  serviceProviderGroupId?: string;
  dateFrom?: string;
  dateTo?: string;
  siteId?: string;
}

export default function useDashboard() {
  class MDashboard implements INoOfVisitors {
    options: any;
    series: any;
    constructor(
      {
        options = {
          chart: {
            toolbar: {
              show: false,
            },
          },
          tooltip: {
            theme: theme.value,
          },
          legend: {
            position: "top",
            fontSize: "14px",
            fontWeight: "bold",
          },
          xaxis: {
            categories: [],
          },
          labels: [],
        },
        series = [],
      } = {} as INoOfVisitors,
    ) {
      // common
      this.options = options;
      this.series = series;
    }
  }

  const apiUrl = "/api/dashboard/v1";
  let dashboard = useState<TDashboardResponse | undefined>("dashboard");
  const isDashboardLoading = useState("isDashboardLoading", () => false);

  const months = [
    { value: 1, text: "January" },
    { value: 2, text: "February" },
    { value: 3, text: "March" },
    { value: 4, text: "April" },
    { value: 5, text: "May" },
    { value: 6, text: "June" },
    { value: 7, text: "July" },
    { value: 8, text: "August" },
    { value: 9, text: "September" },
    { value: 10, text: "October" },
    { value: 11, text: "November" },
    { value: 12, text: "December" },
  ];

  async function setDashboardByQueryParams(query: IDashboardParam) {
    try {
      isDashboardLoading.value = true;
      const _data = await getDashboardData(query);
      dashboard.value = _data;
      isDashboardLoading.value = false;
    } catch (error) {
      dashboard.value = undefined;
    }
  }

  async function getDashboardData(query: IDashboardParam) {
    const data = await useLocalFetchUtil<TDashboardResponse>(
      apiUrl,
      "GET",
      query,
    );
    return data;
  }

  const dateFilters = useState("dateFilters", () => [
    { title: "Today", value: "today" },
    { title: "Yesterday", value: "yesterday" },
    { title: "This Week", value: "thisWeek" },
    { title: "Last Week", value: "lastWeek" },
    { title: "This Month", value: "thisMonth" },
    { title: "Last Month", value: "lastMonth" },
    { title: "1st Quarter", value: "q1" },
    { title: "2nd Quarter", value: "q2" },
    { title: "3rd Quarter", value: "q3" },
    { title: "4th Quarter", value: "q4" },
    { title: "This Year", value: "thisYear" },
    { title: "Last Year", value: "lastYear" },
  ]);

  const countCardList = useState("countCardList", () => [
    {
      title: "Guest",
      icon: "guest_logo.png",
      value: "guests",
      count: 0,
      percentage: 0,
      percentageStatus: "trending-up",
      selectedDate: "",
    },
    {
      title: "Pickup",
      icon: "pickup_logo.png",
      value: "pick-up",
      count: 0,
      percentage: 0,
      percentageStatus: "trending-up",
      selectedDate: "",
    },
    {
      title: "Drop-off",
      icon: "dropoff_logo.png",
      value: "drop-off",
      count: 0,
      percentage: 0,
      percentageStatus: "trending-up",
      selectedDate: "",
    },
    {
      title: "Contractor",
      icon: "contractor_logo.png",
      value: "contractor",
      count: 0,
      percentage: 0,
      percentageStatus: "trending-up",
      selectedDate: "",
    },
    {
      title: "Delivery",
      icon: "delivery_logo.png",
      value: "delivery",
      count: 0,
      percentage: 0,
      percentageStatus: "trending-up",
      selectedDate: "",
    },
  ]);

  const visitorsChart = useState("visitorsChart", () => new MDashboard());

  const pieChartList = useState("pieChartList", () => [
    {
      title: "Bookings",
      value: "bookings",
      count: 0,
      chartInfo: new MDashboard(),
      isLoading: false,
    },
    {
      title: "Building Management Overview",
      value: "building",
      count: 0,
      chartInfo: new MDashboard(),
      isLoading: false,
    },
    {
      title: "Work Orders",
      value: "work",
      count: 0,
      chartInfo: new MDashboard(),
      isLoading: false,
    },
  ]);

  async function getDashboardOverviewInfo(
    site: string,
    filter: string,
    payload: any,
  ) {
    isDashboardLoading.value = true;

    const { data, error } = await useLocalFetch(
      `/api/visitors/dashboard/overview`,
      {
        method: "PUT",
        query: { site, filter },
        body: JSON.stringify(payload),
      },
    );

    if (error && error.value && error.value.data) {
      isDashboardLoading.value = false;
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const result = data as any;

      Object.keys(result.value).map((item: any) => {
        const findCardIndex = countCardList.value.findIndex(
          (find: any) => find.value == item,
        );

        if (findCardIndex != -1) {
          countCardList.value[findCardIndex].count =
            result.value[item]?.current;
          countCardList.value[findCardIndex].percentage =
            result.value[item]?.insight;
        }

        if (item == "visitors") {
          visitorsChart.value.series = [
            {
              name: "Total",
              data: result.value[item].map((itm: any) => {
                return itm.count;
              }),
            },
          ];

          visitorsChart.value.options.xaxis.categories = result.value[item].map(
            (itm: any) => {
              return `${months.find((find: any) => find.value == itm?.month)?.text} ${itm?.year}`;
            },
          );
        }
      });

      isDashboardLoading.value = false;
    }
  }

  const isFeedbackTicketLoading = useState(
    "isFeedbackTicketLoading",
    () => false,
  );

  const feedbackTicketChart = useState(
    "feedbackTicketChart",
    () => new MDashboard(),
  );

  async function getFeedbackTicketsInfo(site: string, filter: string) {
    isFeedbackTicketLoading.value = true;
    const { data, error } = await useLocalFetch(
      `/api/feedbacks/dashboard/overview`,
      {
        method: "GET",
        query: { site, filter },
      },
    );

    if (error && error.value && error.value.data) {
      isFeedbackTicketLoading.value = false;
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const result = data as any;

      feedbackTicketChart.value.options.xaxis.categories = result.value.map(
        (item: any) => {
          return `${months.find((find: any) => find.value == item?._id?.month)?.text} ${item?._id?.year}`;
        },
      );

      feedbackTicketChart.value.series = [
        { name: "Resolved", data: [] },
        {
          name: "Unresolved",
          data: [],
        },
      ];

      feedbackTicketChart.value.series[0].data = result.value
        .filter((find: any) => find._id.status == "resolved")
        .map((item: any) => {
          return item.count;
        });

      feedbackTicketChart.value.series[1].data = result.value
        .filter((find: any) => find._id.status == "unresolved")
        .map((item: any) => {
          return item.count;
        });

      isFeedbackTicketLoading.value = false;
    }
  }

  async function getWorkOrdersInfo(site: string, filter: string) {
    pieChartList.value[2].isLoading = true;
    const { data, error } = await useLocalFetch(
      `/api/work-orders/dashboard/overview`,
      {
        method: "GET",
        query: { site, filter },
      },
    );

    if (error && error.value && error.value.data) {
      pieChartList.value[2].isLoading = false;
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const result = data as any;

      pieChartList.value[2].count = result.value.total;
      pieChartList.value[2].chartInfo.options.labels = Object.keys(
        result.value,
      ).filter((find: string) => find != "total");

      pieChartList.value[2].chartInfo.series = Object.keys(result.value)
        .filter((find: string) => find != "total")
        .map((item: any) => {
          return result.value[item];
        });

      pieChartList.value[2].isLoading = false;
    }
  }

  async function getBuildingManagementInfo(site: string, filter: string) {
    pieChartList.value[1].isLoading = true;
    const { data, error } = await useLocalFetch(
      `/api/building-management/dashboard/overview`,
      {
        method: "GET",
        query: { site, filter },
      },
    );

    if (error && error.value && error.value.data) {
      pieChartList.value[1].isLoading = false;
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const result = data as any;

      pieChartList.value[1].count = result.value.total;
      pieChartList.value[1].chartInfo.options.labels = Object.keys(
        result.value,
      ).filter((find: string) => find != "total");

      pieChartList.value[1].chartInfo.series = Object.keys(result.value)
        .filter((find: string) => find != "total")
        .map((item: any) => {
          return result.value[item];
        });

      pieChartList.value[1].isLoading = false;
    }
  }

  async function getFacilityBookingInfo(site: string, filter: string) {
    pieChartList.value[0].isLoading = true;
    const { data, error } = await useLocalFetch(
      `/api/facilities-booking/dashboard/overview`,
      {
        method: "GET",
        query: { site, filter },
      },
    );

    if (error && error.value && error.value.data) {
      pieChartList.value[0].isLoading = false;
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const result = data as any;

      pieChartList.value[0].count = result.value.total;
      pieChartList.value[0].chartInfo.options.labels = Object.keys(
        result.value,
      ).filter((find: string) => find != "total");

      pieChartList.value[0].chartInfo.series = Object.keys(result.value)
        .filter((find: string) => find != "total")
        .map((item: any) => {
          return result.value[item];
        });

      pieChartList.value[0].isLoading = false;
    }
  }

  return {
    dashboard,
    isDashboardLoading,
    setDashboardByQueryParams,

    countCardList,
    dateFilters,
    getDashboardOverviewInfo,

    visitorsChart,
    pieChartList,

    feedbackTicketChart,
    getFeedbackTicketsInfo,
    isFeedbackTicketLoading,

    getWorkOrdersInfo,
    getBuildingManagementInfo,
    getFacilityBookingInfo,
  };
}
