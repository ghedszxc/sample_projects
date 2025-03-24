const { useLocalFetchUtil } = useUtils();

export default function useFeedback() {
  class MFeedback implements TFeedback {
    _id?: string;
    description?: string;
    subject?: string;
    service?: string;
    provider?: string;
    location: string;
    status?: string;
    createdBy?: string;
    createdByName?: string;
    createdByEmail?: string;
    attachments?: TAttachment[];
    workOrders?: object[];
    organization: string;
    site: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    app: string;
    assigneeName?: string;
    statusUpdates?: any[];

    constructor(feedback: Partial<TFeedback> = {}) {
      this._id = feedback._id || "";
      this.description = feedback.description || "";
      this.subject = feedback.subject || "";
      this.service = feedback.service || "";
      this.status = feedback.status || "";
      this.createdBy = feedback.createdBy || "";
      this.provider = feedback.provider || "";
      this.location = feedback.location || "";
      this.attachments = feedback.attachments || [];
      this.workOrders = feedback.workOrders || [];
      this.organization = feedback.organization || "";
      this.site = feedback.site || "";
      this.createdAt = "";
      this.updatedAt = "";
      this.app = feedback.app || "";
      this.assigneeName = feedback.assigneeName || "";
    }
  }

  const feedback = useState("feedback", () => new MFeedback());
  const feedbacks = useState("feedbacks", (): TFeedback[] => []);
  const page = useState("feedbackPage", () => 1);
  const pages = useState("feedbackPages", () => 1);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("feedbackSearch", () => "");
  const pageRange = useState("feedbackPageRange", () => "-- - -- of --");
  const isLoading = useState("isLoadingFeedback", () => false);
  const isFeedbackValid = useState("isFeedbackValid", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");

  async function getFeedbackById(id: string) {
    const response = await useLocalFetchUtil<TFeedback | undefined>(
      `/api/feedbacks/${id}`,
      "GET",
    );
    return response;
  }

  async function getFeedbackByWorkOrderId(id: string) {
    const response = await useLocalFetchUtil<TFeedback | undefined>(
      `/api/feedbacks/work-order/${id}`,
      "GET",
    );
    return response;
  }

  async function addFeedback(form: TFeedback) {
    const { error, data } = await useLocalFetch("/api/feedbacks", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateFeedback(id: string, form: TFeedback) {
    const { error, data } = await useLocalFetch(`/api/feedbacks/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateFeedbackStatus(id: string, status: string) {
    const data = await useLocalFetchUtil<{ message: TFeedback }>(
      `/api/feedbacks/${id}`,
      "PUT",
      {
        status,
      },
    );
    setFeedback(data.message);
    return data;
  }

  async function updateStatusFeedback(_feedback: any) {
    const { error, data } = await useLocalFetch(
      "/api/feedbacks/status-update",
      {
        method: "POST",
        body: JSON.stringify(_feedback),
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

  async function updateFeedbackAssignee(_feedback: any) {
    const { error, data } = await useLocalFetch(
      "/api/feedbacks/status-update",
      {
        method: "POST",
        body: JSON.stringify(_feedback),
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

  async function updateFeedbackProvider(_feedback: any) {
    const { error, data } = await useLocalFetch(
      "/api/feedbacks/status-update",
      {
        method: "POST",
        body: JSON.stringify(_feedback),
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

  async function updateGeneralFeedback(id: string, form: {}) {
    const { error, data } = await useLocalFetch(`/api/feedbacks/update/${id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function deleteFeedback(id: string) {
    const response = await useLocalFetchUtil(`/api/feedbacks/${id}`, "DELETE");
    return response;
  }

  async function updateFeedbackDescriptionById(
    _feedback: TUpdateFeedbackDescriptionOptions,
  ) {
    const { error, data } = await useLocalFetch(
      // `/api/feedbacks/v1/description/${_feedback._id}`,
      `/api/feedbacks/description/${_feedback._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ description: _feedback.description }),
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

  function setFeedback(data?: TFeedback) {
    feedback.value = data || new MFeedback();
  }

  async function getFeedbacksByPageSearch(
    {
      page = 1,
      limit = 10,
      search = "",

      site = "",
      dateFrom = "",
      dateTo = "",
      status = "",
      provider = "",
    } = {} as {
      page?: number;
      limit?: number;
      search?: string;

      site?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
      provider?: string;
    },
  ) {
    const data = await useLocalFetchUtil<TGetFeedbacksByPageSearchResponse>(
      "/api/feedbacks",
      "GET",
      {
        page,
        limit,
        search,

        site,
        dateFrom,
        dateTo,
        status,
        provider,
      },
    );
    return data;
  }

  async function setFeedbacks(
    { organization, site, search, dateFrom, dateTo, status, provider } = {} as {
      organization?: string;
      site?: string;
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
      provider?: string;
    },
  ) {
    try {
      isLoading.value = true;
      const _feedbacks = (await getFeedbacksByPageSearch({
        page: page.value,
        limit: itemsPerPage.value,
        search: search,

        site: site,
        dateFrom: dateFrom,
        dateTo: dateTo,
        status: status,
        provider: provider,
      })) as TGetFeedbacksByPageSearchResponse;
      feedbacks.value = _feedbacks.items as TFeedback[];
      pageRange.value = _feedbacks.pageRange;
      pages.value = _feedbacks.pages;
      isLoading.value = false;
    } catch (error) {
      isLoading.value = false;
    }
  }

  async function updateFeedBackNotificationIntervalSettings({
    site = "",
    module = "",
    minutes = 0,
    isEnabled = false,
  }: {
    site?: string;
    module?: string;
    minutes?: number;
    isEnabled?: boolean;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/notification-intervals/v1",
      {
        method: "POST",
        body: JSON.stringify({
          site,
          module,
          minutes,
          isEnabled,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function getFeedBackIntervalNotificationSettings(
    site?: string,
    module?: string,
  ) {
    const { error, data } = await useLocalFetch(
      "/api/notification-intervals/v1",
      {
        method: "PATCH",
        body: JSON.stringify({
          site,
          module,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { site, search, dateFrom, dateTo, status, provider } = {} as {
      site?: string;
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
      provider?: string;
    },
  ) {
    page.value++;
    setFeedbacks({
      site,
      search,
      dateFrom,
      dateTo,
      status,
      provider,
    });
  }

  function prevPage(
    { site, search, dateFrom, dateTo, status, provider } = {} as {
      site?: string;
      search?: string;
      dateFrom?: string;
      dateTo?: string;
      status?: string;
      provider?: string;
    },
  ) {
    page.value--;
    setFeedbacks({
      site,
      search,
      dateFrom,
      dateTo,
      status,
      provider,
    });
  }

  return {
    feedback,
    feedbacks,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setFeedback,
    isLoading,
    isCreate,
    isUpdate,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    setFeedbacks,
    isFeedbackValid,
    addFeedback,
    updateFeedback,
    updateFeedbackStatus,
    updateStatusFeedback,
    updateGeneralFeedback,
    updateFeedbackAssignee,
    updateFeedbackProvider,
    deleteFeedback,
    getFeedbackById,
    getFeedbackByWorkOrderId,
    updateFeedbackDescriptionById,
    filterOrganization,
    filterSite,
    search,
    updateFeedBackNotificationIntervalSettings,
    getFeedBackIntervalNotificationSettings,
  };
}
