export default function useFeedback() {
  class MFeedback implements TFeedback {
    _id?: string;
    description?: string;
    // service: string;
    // provider: string;
    location: string;
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    createdBy?: string;
    createdByName?: string;
    creaetdByEmail?: string;
    attachments?: TAttachment[];
    workOrder?: string;
    organization: string;
    site: string;
    subject: string;
    app: string;

    constructor(feedback: Partial<TFeedback> = {}) {
      this._id = feedback._id || "";
      this.description = feedback.description || "";
      // this.service = feedback.service || "";
      this.status = feedback.status || "";
      this.createdAt = feedback.createdAt || "";
      this.updatedAt = feedback.updatedAt || "";
      this.createdBy = feedback.createdBy || "";
      // this.provider = feedback.provider || "";
      this.location = feedback.location || "";
      this.attachments = feedback.attachments || [];
      this.workOrder = feedback.workOrder || "";
      this.organization = feedback.organization || "";
      this.site = feedback.site || "";
      this.subject = feedback.subject || "";
      this.app = feedback.app || "";
    }
  }

  const feedback = useState("feedback", () => new MFeedback());
  const feedbacks = useState("feedbacks", (): TFeedback[] => []);
  const page = useState("feedbackPage", () => 1);
  const pages = useState("feedbackPages", () => 1);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("feedbackSearch", () => "");
  const pageRange = useState("feedbackPageRange", () => "-- - -- of --");
  const isFeedbacksLoaded = useState("isFeedbacksLoaded", () => false);
  const isFeedbackValid = useState("isFeedbackValid", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");

  const tabsFeedbacks = useState("tabsFeedbacks", () => 1);

  async function getFeedbackById(id: string) {
    const { data, error } = await useLocalFetch(`/api/feedbacks/${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  // async function getFeedbackByResidentId(id: string) {
  //   const { data, error } = await useLocalFetch(
  //     `/api/feedbacks/resident/${id}`,
  //     {
  //       method: "GET",
  //     },
  //   );
  //   if (error.value && error.value.data) {
  //     return Promise.reject(error.value.data.message);
  //   }

  //   if (data.value) {
  //     return Promise.resolve(data.value);
  //   }
  // }
  async function getFeedbackByResidentId(args: any) {
    const { data, error } = await useLocalFetch(`/api/feedbacks/search`, {
      body: JSON.stringify({
        tab: args.tab,
        page: args.page,
        limit: 5,
      }),
      method: "POST",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  const { setSnackbar } = useLocal();

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

  async function deleteFeedback(id: string) {
    const { error, data } = await useLocalFetch(`/api/feedbacks/${id}`, {
      method: "DELETE",
      body: "",
    });
    const res = data.value as TResponse;

    if (!error.value && res.message) {
      await setSnackbar({ text: res.message, modal: true });
      return;
    }

    if (error.value) {
      setSnackbar({ text: error.value as any, modal: true });
      return;
    }
  }

  async function updateFeedbackDescriptionById(
    _feedback: TUpdateFeedbackDescriptionOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/feedbacks/v1/description/${_feedback._id}`,
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
    { page = 1, search = "", organization = "", site = "" } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/feedbacks", {
      method: "GET",
      query: { page, search, organization, site },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setFeedbacks(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    try {
      isFeedbacksLoaded.value = true;
      const _feedbacks = (await getFeedbacksByPageSearch({
        page: page.value,
        search: search.value,
        organization: organization,
        site: site,
      })) as TGetFeedbacksByPageSearchResponse;
      feedbacks.value = _feedbacks.items as TFeedback[];
      pageRange.value = _feedbacks.pageRange;
      pages.value = _feedbacks.pages;
      isFeedbacksLoaded.value = false;
    } catch (error) {
      isFeedbacksLoaded.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value++;
    getFeedbacksByPageSearch({
      page: page.value,
      search: search.value,
      organization: organization,
      site: site,
    });
    // setFeedbacks();
  }

  function prevPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value--;
    getFeedbacksByPageSearch({
      page: page.value,
      search: search.value,
      organization: organization,
      site: site,
    });
    // setFeedbacks();
  }

  return {
    feedback,
    isLoading: ref(false),
    feedbacks,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setFeedback,
    isFeedbacksLoaded,
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
    deleteFeedback,
    getFeedbackById,
    getFeedbackByResidentId,
    updateFeedbackDescriptionById,
    filterOrganization,
    filterSite,
    tabsFeedbacks,
  };
}
