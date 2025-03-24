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
  const apiUrl = "/api/dashboard/v1";
  // const siteCollab = useState("siteCollab", () => new MSiteCollab());
  let dashboard = useState<TDashboardResponse | undefined>("dashboard");
  const isDashboardLoading = useState("isDashboardLoading", () => false);

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
      query
    );
    return data;
  }

  return {
    dashboard,
    isDashboardLoading,
    setDashboardByQueryParams,
  };
}
