const { useLocalFetchUtil } = useUtils();

export default function useWorkOrder() {
  class MWorkOrder implements TWorkOrder {
    _id?: string;
    description: string;
    service: string;
    subject: string;
    provider: string;
    providerName?: string;
    status?: string;
    assignee?: string | TUser;
    assigneeName?: string;
    attachments?: string[];
    createdBy?: string | TUser;
    createdByName?: string;
    site: string;
    organization: string;
    location?: string;
    comments?: TComment[];
    createdAt?: string | Date;
    updatedAt?: string | Date;
    feedback?: string;
    statusUpdates?: any[];

    constructor(workOrder: Partial<TWorkOrder> = {}) {
      this._id = workOrder._id || "";
      this.description = workOrder.description || "";
      this.service = workOrder.service || "";
      this.subject = workOrder.subject || "";
      this.provider = workOrder.provider || "";
      this.providerName = workOrder.providerName || "";
      this.status = workOrder.status || "";
      this.assignee = workOrder.assignee;
      this.attachments = workOrder.attachments || [];
      this.createdBy = workOrder.createdBy || "";
      this.createdByName = workOrder.createdByName;
      this.site = workOrder.site || "";
      this.organization = workOrder.organization || "";
      this.location = workOrder.location || "";
      this.assigneeName = workOrder.assigneeName || "";
      this.comments = workOrder.comments || [];
      this.createdAt = "";
      this.updatedAt = "";
      this.feedback = workOrder.feedback || "";
    }
  }

  const workOrderApiUrl = "/api/work-orders/v1";
  const workOrder = useState("workOrder", () => new MWorkOrder());
  const workOrders = useState("workOrders", (): TWorkOrder[] => []);
  const searchWorkOrder = useState("searchWorkOrder", () => "");
  const selectFilter = useState("selectFilterWorkOrder", () => "All");
  const page = useState("pageWorkOrder", () => 1);
  const pages = useState("pagesWorkOrder", () => 1);
  const itemsPerPage = useState("itemsPerPageWorkOrder", () => 10);
  const pageRange = useState("pageRangeWorkOrder", () => "-- - -- of --");
  const search = useState("workOrderSearch", () => "");
  const isLoading = useState("isWorkOrderLoaded", () => false);
  const isWorkOrderValid = useState("isWorkOrderValid", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");

  function setWorkOrder(data?: TWorkOrder) {
    workOrder.value = data || new MWorkOrder();
  }

  async function getWorkOrdersByWorkOrderPageSearch(
    {
      page = 1,
      limit = 10,
      organization,
      provider,
      site,
      status,
      startDate = "",
      endDate = "",
      search = "",
    } = {} as ISearchWorkOrder,
  ) {
    const data = await useLocalFetchUtil<TWorkOrderResponse>(
      workOrderApiUrl,
      "GET",
      {
        page,
        limit,
        search,
        status,
        startDate,
        endDate,
        organization,
        site,
        provider,
      },
    );
    return data;
  }

  async function getWorkOrderById(_id: string, key?: string) {
    const { error, data } = await useLocalFetch(
      `/api/work-orders/v1/id/${_id}`,
      {
        key,
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TWorkOrder);
    }
  }

  async function setWorkOrders(
    {
      organization,
      provider,
      site,
      status,
      startDate = "",
      endDate = "",
      search = "",
    } = {} as ISearchWorkOrder,
  ) {
    try {
      isLoading.value = true;
      const _workOrder = (await getWorkOrdersByWorkOrderPageSearch({
        page: page.value,
        limit: itemsPerPage.value,
        search: search || searchWorkOrder.value,
        status: status || selectFilter.value,
        startDate,
        endDate,
        organization,
        site,
        provider,
      })) as TWorkOrderResponse;
      workOrders.value = _workOrder.items as TWorkOrder[];
      pageRange.value = _workOrder.pageRange;
      pages.value = _workOrder.pages;
      isLoading.value = false;
    } catch (error) {
      workOrders.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isLoading.value = false;
    }
  }

  async function addWorkOrder(_workOrder: any) {
    const { error, data } = await useLocalFetch("/api/work-orders/v1", {
      method: "POST",
      body: JSON.stringify(_workOrder),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      //will return the whole response so we can grab the workOrder _id in the front
      // return Promise.resolve(result.value.message as string);
      return Promise.resolve(result);
    }
  }

  // async function updateWorkOrderStatus(
  //   id: string,
  //   status: "to-do" | "in-progress" | "completed",
  // ) {
  //   const data = await useLocalFetchUtil<{ message: TWorkOrder }>(
  //     `${workOrderApiUrl}/${id}/status`,
  //     "PATCH",
  //     {
  //       status: status,
  //     },
  //   );
  //   setWorkOrder(data.message);
  //   return data;
  // }

  async function updateWorkOrderStatus(_workOrder: any) {
    const { error, data } = await useLocalFetch(
      "/api/work-orders/status-update",
      {
        method: "POST",
        body: JSON.stringify(_workOrder),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateWorkOrderDescription(id: string, description: string) {
    const data = await useLocalFetchUtil<{ message: TWorkOrder }>(
      `${workOrderApiUrl}/${id}/description`,
      "PATCH",
      {
        description: description,
      },
    );
    setWorkOrder(data.message);
    return data;
  }

  async function updateWorkOrderAssignee(id: string, assignee: string) {
    const { data, error } = await useLocalFetch(
      `${workOrderApiUrl}/${id}/assignee`,
      {
        method: "PUT",
        body: JSON.stringify({ assignee }),
        deep: false,
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    return Promise.resolve(data);
  }

  async function deleteWorkOrder(_id: string) {
    const data = await useLocalFetchUtil<{ message: TWorkOrder }>(
      `${workOrderApiUrl}/${_id}`,
      "DELETE",
      { _id: _id },
    );
    return data;
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { site, search, startDate, endDate, status, provider } = {} as {
      site?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      provider?: string;
    },
  ) {
    page.value++;
    setWorkOrders({
      site,
      search,
      startDate,
      endDate,
      status,
      provider,
    });
  }

  function prevPage(
    { site, search, startDate, endDate, status, provider } = {} as {
      site?: string;
      search?: string;
      startDate?: string;
      endDate?: string;
      status?: string;
      provider?: string;
    },
  ) {
    page.value--;
    setWorkOrders({
      site,
      search,
      startDate,
      endDate,
      status,
      provider,
    });
  }

  async function deleteWorkOrderById(_id: string) {
    const { error, data } = await useLocalFetch(`/api/work-orders/v1`, {
      method: "DELETE",
      query: { _id },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  return {
    workOrder,
    workOrders,
    page,
    pages,
    itemsPerPage,
    search,
    pageRange,
    isLoading,
    isWorkOrderValid,
    setWorkOrder,
    getWorkOrdersByWorkOrderPageSearch,
    getWorkOrderById,
    setWorkOrders,
    addWorkOrder,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    filterOrganization,
    filterSite,
    updateWorkOrderStatus,
    updateWorkOrderDescription,
    updateWorkOrderAssignee,
    deleteWorkOrder,
  };
}
