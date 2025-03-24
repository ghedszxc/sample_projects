const { useLocalFetchUtil } = useUtils();

export default function useOccurrence() {
  class MSiteCollab implements TSiteCollab {
    _id?: string;
    serviceProvider: string | TServiceProvider;
    site: string | TSite;
    status: string; // pending | approved | rejected
    updateStatusBy?: string;
    assignedGroup?: string | TSPGroup;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    constructor(
      {
        _id = "",
        serviceProvider = "",
        site = "",
        status = "",
        updateStatusBy = "",
        assignedGroup = "",
        createdAt,
        updatedAt,
      } = {} as TSiteCollab,
    ) {
      this._id = _id;
      this.serviceProvider = serviceProvider;
      this.site = site;
      this.status = status;
      this.updateStatusBy = updateStatusBy;
      this.assignedGroup = assignedGroup;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  const siteCollabApiUrl = "/api/site-collabs/v1";
  const siteCollab = useState("siteCollab", () => new MSiteCollab());
  const sitesCollab = useState("sitesCollab", (): TSiteCollab[] => []);
  const sitesCollabPending = useState(
    "sitesCollabPending",
    (): TSiteCollab[] => [],
  );
  const searchSiteCollab = useState("searchSiteCollab", () => "");
  const searchSiteCollabPending = useState("searchSiteCollabPending", () => "");
  const selectFilter = useState("selectFilterSiteCollab", () => "All");
  const page = useState("pageSiteCollab", () => 1);
  const pages = useState("pagesSiteCollab", () => 1);
  const itemsPerPage = useState("itemsPerPageSiteCollab", () => 10);
  const pageRange = useState("pageRangeSiteCollab", () => "-- - -- of --");
  const pagePending = useState("pageSiteCollabPending", () => 1);
  const pagesPending = useState("pagesSiteCollabPending", () => 1);
  const itemsPerPagePending = useState(
    "itemsPerPageSiteCollabPending",
    () => 10,
  );
  const pageRangePending = useState(
    "pageRangeSiteCollabPending",
    () => "-- - -- of --",
  );
  const isTableLoadingSiteCollab = useState(
    "isTableLoadingSiteCollab",
    () => false,
  );
  const isTableLoadingSiteCollabPending = useState(
    "isTableLoadingSiteCollabPending",
    () => false,
  );

  async function createSiteCollab(payload: TSiteCollab) {
    const response = await useLocalFetchUtil<{
      data: {
        acknowledged: boolean;
        insertedId: string;
      };
      message: string;
    }>(siteCollabApiUrl, "POST", payload);
    return response;
  }

  async function getSitesCollabByPageSearch(
    {
      page = 1,
      limit = 10,
      serviceProvider,
      site,
      status,
      service,
      date = "",
      search = "",
      isNotAssigned = "",
    } = {} as ISiteCollabSearch,
  ) {
    const data = await useLocalFetchUtil<TSiteCollabResponse>(
      siteCollabApiUrl,
      "GET",
      {
        page,
        limit,
        search,
        status,
        service,
        date,
        serviceProvider,
        site,
        isNotAssigned,
      },
    );
    return data;
  }

  async function getSiteCollabById(id: string) {
    const data = await useLocalFetchUtil<TSiteCollab | undefined>(
      `${siteCollabApiUrl}/${id}`,
      "GET",
    );
    setSiteCollab(data);
    return data;
  }

  async function getAllServicesAvailable(
    site: string,
    serviceProvider?: string,
    service?: string,
  ) {
    const data = await useLocalFetchUtil<TSiteCollabResponse>(
      `${siteCollabApiUrl}/services`,
      "GET",
      {
        site,
        serviceProvider,
        service,
      },
    );
    return data;
  }

  async function patchSiteCollabStatus(id: string, status: string) {
    // approving and rejecting
    const data = await useLocalFetchUtil<TSiteCollab | undefined>(
      `${siteCollabApiUrl}/${id}`,
      "PATCH",
      {
        status,
      },
    );
    return data;
  }

  async function assignGroupToSite(
    siteCollab: string,
    serviceProviderGroup: string,
  ) {
    const data = await useLocalFetchUtil<TSiteCollab | undefined>(
      `${siteCollabApiUrl}/${siteCollab}/assign`,
      "PATCH",
      {
        serviceProviderGroup,
      },
    );
    return data;
  }

  async function disconnectGroupToSite(
    siteCollab: string,
    serviceProviderGroup: string,
  ) {
    const data = await useLocalFetchUtil<TSiteCollab | undefined>(
      `${siteCollabApiUrl}/${siteCollab}/disconnect`,
      "PATCH",
      {
        serviceProviderGroup,
      },
    );
    return data;
  }

  async function setSiteCollab(data?: TSiteCollab) {
    siteCollab.value = data || new MSiteCollab();
  }

  async function setSitesCollab(
    {
      limit = 10,
      serviceProvider,
      site,
      status,
      date = "",
      search = "",
      service = "",
      isNotAssigned = "",
    } = {} as ISiteCollabSearch,
  ) {
    try {
      isTableLoadingSiteCollab.value = true;
      const _sitesCollab = await getSitesCollabByPageSearch({
        page: page.value,
        limit: limit || itemsPerPage.value,
        search: search || searchSiteCollab.value,
        service: service || selectFilter.value,
        date,
        status,
        site,
        serviceProvider,
        isNotAssigned,
      });
      sitesCollab.value = _sitesCollab.items;
      pageRange.value = _sitesCollab.pageRange;
      pages.value = _sitesCollab.pages;
      isTableLoadingSiteCollab.value = false;
    } catch (error) {
      sitesCollab.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isTableLoadingSiteCollab.value = false;
    }
  }

  async function setSitesCollabPending(
    {
      serviceProvider,
      site,
      status,
      date = "",
      search = "",
      service = "",
      isNotAssigned = "",
    } = {} as ISiteCollabSearch,
  ) {
    try {
      isTableLoadingSiteCollabPending.value = true;
      const _sitesCollab = await getSitesCollabByPageSearch({
        page: pagePending.value,
        limit: itemsPerPagePending.value,
        search: search || searchSiteCollabPending.value,
        service: service || selectFilter.value,
        date,
        status,
        site,
        serviceProvider,
        isNotAssigned,
      });
      sitesCollabPending.value = _sitesCollab.items;
      pageRangePending.value = _sitesCollab.pageRange;
      pagesPending.value = _sitesCollab.pages;
      isTableLoadingSiteCollabPending.value = false;
    } catch (error) {
      sitesCollab.value = [];
      pageRangePending.value = "-- - -- of --";
      pagesPending.value = 0;
      isTableLoadingSiteCollabPending.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  function nextPage(
    { serviceProvider, site, status } = {} as ISiteCollabSearch,
  ) {
    page.value++;
    setSitesCollab({
      serviceProvider,
      site,
    });
  }

  const canPrevPage = computed(() => page.value <= 1);
  function prevPage(
    { serviceProvider, site, status } = {} as ISiteCollabSearch,
  ) {
    page.value--;
    setSitesCollab({
      serviceProvider,
      site,
    });
  }

  const canNextPagePending = computed(
    () => pagesPending.value > pagePending.value,
  );
  function nextPagePending(
    { serviceProvider, site, status } = {} as ISiteCollabSearch,
  ) {
    pagePending.value++;
    setSitesCollabPending({
      serviceProvider,
      site,
    });
  }

  const canPrevPagePending = computed(() => pagePending.value <= 1);
  function prevPagePending(
    { serviceProvider, site, status } = {} as ISiteCollabSearch,
  ) {
    pagePending.value--;
    setSitesCollabPending({
      serviceProvider,
      site,
    });
  }

  return {
    siteCollab,
    sitesCollab,
    searchSiteCollab,
    searchSiteCollabPending,
    page,
    pagePending,
    pages,
    pagesPending,
    itemsPerPage,
    itemsPerPagePending,
    pageRange,
    pageRangePending,
    isTableLoadingSiteCollab,
    isTableLoadingSiteCollabPending,
    nextPage,
    prevPage,
    nextPagePending,
    prevPagePending,
    canNextPage,
    canPrevPage,
    canNextPagePending,
    canPrevPagePending,
    setSiteCollab,
    sitesCollabPending,
    getSiteCollabById,
    setSitesCollab,
    setSitesCollabPending,
    createSiteCollab,
    patchSiteCollabStatus,
    selectFilter,
    getAllServicesAvailable,
    getSitesCollabByPageSearch,
    assignGroupToSite,
    disconnectGroupToSite,
  };
}
