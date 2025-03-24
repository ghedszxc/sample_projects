const { useLocalFetchUtil } = useUtils();

export default function useSPGroup() {
  class MSPGroup implements TSPGroup {
    _id?: string;
    groupName: string;
    serviceProvider: string | TServiceProvider;
    site?: string | TSite;
    status?: string;
    members?: number;
    countryCode?: string; // PH or SG
    siteCollab?: TSiteCollab;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    constructor(
      {
        _id,
        groupName = "",
        serviceProvider = "",
        site,
        status,
        members,
        countryCode,
        siteCollab = {
          _id: "",
          serviceProvider: "",
          site: "",
          status: "",
        },
        createdAt,
        updatedAt,
      } = {} as TSPGroup,
    ) {
      this._id = _id;
      this.groupName = groupName;
      this.serviceProvider = serviceProvider;
      this.site = site;
      this.status = status;
      this.members = members;
      this.countryCode = countryCode;
      this.siteCollab = siteCollab;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  const spGroupApiUrl = "/api/service-provider-groups/v1";
  const spGroup = useState("spGroup", () => new MSPGroup());
  const spsGroup = useState<TSPGroup[]>("spsGroup", (): TSPGroup[] => []);
  const searchSpGroup = useState("searchSpGroup", () => "");
  const page = useState("pageSpGroup", () => 1);
  const pages = useState("pagesSpGroup", () => 1);
  const itemsPerPage = useState("itemsPerPageSpGroup", () => 10);
  const pageRange = useState("pageRangeSpGroup", () => "-- - -- of --");
  const isTableLoadingSpGroup = useState("isTableLoadingSpGroup", () => false);
  const isSpGroupValid = useState("isSpGroupValid", () => false);
  const isLoading = useState("isLoadingSpGroup", () => false);

  async function createSPGroup(payload: TSPGroup) {
    delete payload.siteCollab; // resolve error in BE
    const data = await useLocalFetchUtil<{
      data: {
        acknowledged: boolean;
        insertedId: string;
      };
      message: string;
    }>(spGroupApiUrl, "POST", payload);
    return data;
  }

  async function getSpGroupByPageSearch(
    {
      page = 0,
      limit = 10,
      serviceProvider,
      site,
      status,
      date = "",
      search = "",
    } = {} as IGroupSearch,
  ) {
    const data = await useLocalFetchUtil<TSPGroupResponse>(
      spGroupApiUrl,
      "GET",
      {
        page,
        limit,
        search,
        status,
        date,
        serviceProvider,
        site,
      },
    );
    return data;
  }

  async function getSPGroupById(id: string) {
    const data = await useLocalFetchUtil<TSPGroup | null>(
      `${spGroupApiUrl}/${id}`,
      "GET",
    );
    if (data && Boolean(data)) {
      setSPGroup(data);
    }
    return data;
  }

  async function updateSPGroupStatus(id: string, status: string) {
    const data = await useLocalFetchUtil<TSPGroup | null>(
      `${spGroupApiUrl}/${id}`,
      "PATCH",
      {
        status,
      },
    );
    return data;
  }

  async function assignSiteToSPGroup(
    id: string,
    payload: { status: string; site: string | undefined },
  ) {
    const data = await useLocalFetchUtil<TSPGroup | null>(
      `${spGroupApiUrl}/${id}/assign`,
      "PATCH",
      {
        ...payload,
      },
    );
    return data;
  }

  async function disconnectSiteToGroup(
    id: string,
    payload: { status: string },
  ) {
    const data = await useLocalFetchUtil<TSPGroup | null>(
      `${spGroupApiUrl}/${id}/disconnect`,
      "PATCH",
      {
        ...payload,
      },
    );
    return data;
  }

  async function updateNameById(id: string, payload: { groupName: string }) {
    const data = await useLocalFetchUtil<TSPGroup | null>(
      `${spGroupApiUrl}/${id}/group-name`,
      "PATCH",
      {
        ...payload,
      },
    );
    if (data && Boolean(data)) {
      spGroup.value.groupName = data.groupName;
      setSPGroup(spGroup.value);
    }
    return data;
  }

  async function setSPGroup(data?: TSPGroup) {
    spGroup.value = data || new MSPGroup();
  }

  async function setSpsGroup(
    {
      serviceProvider,
      site,
      status,
      date = "",
      search = "",
    } = {} as IGroupSearch,
  ) {
    try {
      isTableLoadingSpGroup.value = true;
      const _spsGroup = await getSpGroupByPageSearch({
        page: page.value,
        limit: itemsPerPage.value,
        search: search || searchSpGroup.value,
        date,
        status,
        site,
        serviceProvider,
      });
      spsGroup.value = _spsGroup.items;
      pageRange.value = _spsGroup.pageRange;
      pages.value = _spsGroup.pages;
      isTableLoadingSpGroup.value = false;
    } catch (error) {
      spsGroup.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isTableLoadingSpGroup.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  function nextPage({ serviceProvider, site } = {} as IGroupSearch) {
    page.value++;
    setSpsGroup({
      serviceProvider,
      site,
    });
  }

  const canPrevPage = computed(() => page.value <= 1);
  function prevPage({ serviceProvider, site } = {} as IGroupSearch) {
    page.value--;
    setSpsGroup({
      serviceProvider,
      site,
    });
  }

  return {
    spGroup,
    spsGroup,
    searchSpGroup,
    page,
    pages,
    itemsPerPage,
    isLoading,
    pageRange,
    isTableLoadingSpGroup,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    setSPGroup,
    getSPGroupById,
    setSpsGroup,
    disconnectSiteToGroup,
    isSpGroupValid,
    createSPGroup,
    updateSPGroupStatus,
    assignSiteToSPGroup,
    updateNameById,
  };
}
