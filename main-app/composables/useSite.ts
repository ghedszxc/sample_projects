const { useLocalFetchUtil } = useUtils();

export default function useSite() {
  class MSite implements TSite {
    _id: string;
    name: string;
    address: string;
    email?: string;
    contactNumber?: string;
    services?: string[];
    status: string;
    createdAt: string;
    updatedAt: string;
    organization: string;
    serviceProvider: string;
    category: string;
    siteCategory: string;
    constructor(
      {
        _id = "",
        name = "",
        address = "",
        email = "",
        contactNumber = "",
        services = [],
        status = "inactive",
        createdAt = "",
        updatedAt = "",
        organization = "",
        serviceProvider = "",
        category = "",
        siteCategory = "",
      } = {} as TSite,
    ) {
      this._id = _id;
      this.name = name;
      this.address = address;
      this.email = email;
      this.contactNumber = contactNumber;
      this.services = services;
      this.status = status;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.organization = organization;
      this.serviceProvider = serviceProvider;
      this.category = category;
      this.siteCategory = siteCategory;
    }
  }

  const sites = useState("sites", (): TSite[] => []);
  const page = useState("sitePage", () => 1);
  const pages = useState("sitePages", () => 0);
  const pageRange = useState("sitePageRange", () => "-- - -- of --");
  const search = useState("siteSearch", () => "");
  const isSiteValid = useState("isSiteValid", () => false);
  const isSiteLoading = useState("isSiteLoading", () => false);
  const isSiteLoadingBtn = useState("isSiteLoadingBtn", () => false);
  const site = useState("site", (): TSite => new MSite());

  function setSite(data?: TSite) {
    site.value = data || new MSite();
  }

  async function getSitesBySitePageSearch(
    { page = 1, search = "", organization = "" } = {} as {
      page?: number;
      search?: string;
      organization?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/sites/v1", {
      method: "GET",
      query: { page, search, organization },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getSitesByProviderAndSitePageSearch(
    {
      page = 1,
      limit = 10,
      search = "",
      serviceProvider = "",
      status = "",
    } = {} as {
      page?: number;
      limit?: number;
      search?: string;
      serviceProvider?: string;
      status?: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      `/api/sites/v1/service-provider/${serviceProvider}`,
      {
        method: "GET",
        query: { page, limit, search, status },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getSiteById(_id: string) {
    const { error, data } = await useLocalFetch(`/api/sites/v1/${_id}`);

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TSite);
    }
  }

  const selectedOrgSites = useState("selectedOrgSites", (): TSite[] => []);
  const selectedOrgSitesPages = useState("selectedOrgSitesPages", () => 0);
  const selectedOrgSitesPageRange = useState(
    "selectedOrgSitesPageRange",
    () => "-- - -- of --",
  );

  async function getSelectedOrganizationSites(organization: string) {
    try {
      isSiteLoading.value = true;
      const _site = (await getSitesBySitePageSearch({
        page: page.value,
        search: search.value,
        organization,
      })) as TSiteResponse;

      isSiteLoading.value = false;
      selectedOrgSites.value = _site.items as TSite[];
      selectedOrgSitesPageRange.value = _site.pageRange;
      selectedOrgSitesPages.value = _site.pages;
    } catch (error) {
      selectedOrgSites.value = [];
      selectedOrgSitesPageRange.value = "-- - -- of --";
      isSiteLoading.value = false;
      selectedOrgSitesPages.value = 0;
    }
  }

  async function setSites(organization: string) {
    try {
      isSiteLoading.value = true;
      const _site = (await getSitesBySitePageSearch({
        page: page.value,
        search: search.value,
        organization,
      })) as TSiteResponse;
      sites.value = _site.items as TSite[];
      pageRange.value = _site.pageRange;
      isSiteLoading.value = false;
      pages.value = _site.pages;
    } catch (error) {
      sites.value = [];
      pageRange.value = "-- - -- of --";
      isSiteLoading.value = false;
      pages.value = 0;
    }
  }

  async function setProviderSites(serviceProvider: string) {
    try {
      isSiteLoading.value = true;
      const _site = (await getSitesByProviderAndSitePageSearch({
        page: page.value,
        search: search.value,
        serviceProvider,
      })) as TSiteResponse;
      sites.value = _site.items as TSite[];
      pageRange.value = _site.pageRange;
      isSiteLoading.value = false;
    } catch (error) {
      sites.value = [];
      pageRange.value = "-- - -- of --";
      isSiteLoading.value = false;
    }
  }

  async function setProviderFilterSites(
    { serviceProvider = "", limit = 10, status = "" } = {} as {
      serviceProvider: string;
      limit?: number;
      status?: string;
    },
  ) {
    try {
      const _providerSite = (await getSitesByProviderAndSitePageSearch({
        page: 1,
        limit: limit,
        serviceProvider,
        status: status,
      })) as TSiteResponse;
      return _providerSite.items as TSite[];
    } catch (error) {
      return [];
    }
  }

  async function addSite(_site: TSite) {
    delete _site._id;

    const { error, data } = await useLocalFetch("/api/sites/v1", {
      method: "POST",
      body: JSON.stringify(_site),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function addSiteWithSendInvite(site: TSite, user: TSignUpForm) {
    delete site._id;
    const response = await useLocalFetchUtil<{
      message: string | undefined;
    }>("/api/sites/v1/create/invite", "POST", { site, user });
    return response;
  }

  async function updateSiteNameById(_site: TUpdateSiteNameOptions) {
    const { error, data } = await useLocalFetch(
      `/api/sites/v1/name/${_site._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: _site.name }),
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

  async function updateSiteEmailById(_site: TUpdateSiteEmailOptions) {
    const { error, data } = await useLocalFetch(
      `/api/sites/v1/email/${_site._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ email: _site.email }),
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

  async function updateSiteContactById(_site: TUpdateSiteContactOptions) {
    const { error, data } = await useLocalFetch(
      `/api/sites/v1/contact/${_site._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ contactNumber: _site.contactNumber }),
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

  async function updateSiteStatusById(_site: TUpdateSiteStatusOptions) {
    const data = await useLocalFetchUtil<TSite | undefined>(
      `/api/sites/v1/status/${_site._id}`,
      "PUT",
      { status: _site.status },
    );
    return data;
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(organization: string) {
    page.value++;
    setSites(organization);
  }

  function prevPage(organization: string) {
    page.value--;
    setSites(organization);
  }

  function nextPageProvider(serviceProvider: string) {
    page.value++;
    getSitesByProviderAndSitePageSearch({
      page: page.value,
      search: search.value,
      serviceProvider,
    });
  }

  function prevPageProvider(serviceProvider: string) {
    page.value--;
    getSitesByProviderAndSitePageSearch({
      page: page.value,
      search: search.value,
      serviceProvider,
    });
  }

  return {
    site,
    sites,
    setSite,
    setSites,
    setProviderSites,
    isSiteValid,
    isSiteLoading,
    isSiteLoadingBtn,
    addSite,
    getSiteById,
    updateSiteNameById,
    updateSiteEmailById,
    updateSiteContactById,
    updateSiteStatusById,
    page,
    pages,
    pageRange,
    search,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    nextPageProvider,
    prevPageProvider,
    addSiteWithSendInvite,
    setProviderFilterSites,

    selectedOrgSites,
    selectedOrgSitesPages,
    selectedOrgSitesPageRange,
    getSelectedOrganizationSites,
  };
}
