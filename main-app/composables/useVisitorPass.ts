export default function useVisitorPass() {
  const { useLocalFetchUtil, getCapitalized, standardFormatDate } = useUtils();

  class MVisitorPass implements TVisitorPass {
    _id?: string;
    passNumber: string;
    type: string;
    template: string;
    size: string;
    subGroup: string;
    status: string;
    createdAt: Date;
    parameter: string;
    site: string;
    constructor(
      {
        _id = "",
        passNumber = "",
        type = "",
        template = "",
        size = "",
        subGroup = "",
        createdAt = new Date(),
        status = "",
        parameter = "",
        site = "",
      } = {} as TVisitorPass,
    ) {
      this._id = _id;
      this.passNumber = passNumber;
      this.type = type;
      this.template = template;
      this.size = size;
      this.subGroup = subGroup;
      this.status = status;
      this.createdAt = createdAt;
      this.parameter = parameter;
      this.site = site;
    }
  }

  const visitorPass = useState("visitorPass", () => new MVisitorPass());
  const visitorPasses = useState(
    "visitorPasses",
    (): TVisitorPass[] => [],
    // () => [
    //   {
    //     passNumber: "00001",
    //     template: "Sample Visitor Pass 1",
    //     size: "Standard Credit Card Size (8.56cm x 5.398cm)",
    //     subGroup: "-",
    //     status: "active",
    //     createdAt: new Date(),
    //     parameter: "",
    //   },
    //   {
    //     passNumber: "00002",
    //     template: "Sample Visitor Pass 2",
    //     size: "Standard Credit Card Size (8.56cm x 5.398cm)",
    //     subGroup: "-",
    //     status: "active",
    //     createdAt: new Date(),
    //     parameter: "",
    //   },
    //   {
    //     passNumber: "00003",
    //     template: "Sample Visitor Pass 3",
    //     size: "Standard Credit Card Size (8.56cm x 5.398cm)",
    //     subGroup: "-",
    //     status: "active",
    //     createdAt: new Date(),
    //     parameter: "",
    //   },
    // ],
  );

  const isVisitorPassesLoading = useState(
    "isVisitorPassesLoading",
    () => false,
  );
  const search = useState("visitorPassSearch", () => "");
  const filterStatus = useState("visitorPassFilterStatus", () => "Active");
  const filterVisitorPassTemplate = useState(
    "filterVisitorPassTemplate",
    () => "All",
  );
  const page = useState("visitorPassPage", () => 1);
  const pages = useState("visitorPassPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);
  const pageRange = useState("visitorPassPageRange", () => "-- - -- of --");

  function setVisitorPass(data?: TVisitorPass) {
    visitorPass.value = data || new MVisitorPass();
  }

  async function setVisitorPasses(
    { search, site, status, limit, template } = {} as {
      search?: string;
      site?: string;
      status?: any;
      limit?: number;
      template?: string;
    },
  ) {
    try {
      isVisitorPassesLoading.value = true;
      const _visitorPass = (await getVisitorPassesByPageSearch({
        page: page.value,
        search,
        limit,
        site,
        status,
        template,
      })) as TVisitorPassByPageSearchResponse;

      visitorPasses.value = _visitorPass.items as TVisitorPass[];
      pageRange.value = _visitorPass.pageRange;
      pages.value = _visitorPass.pages;
      isVisitorPassesLoading.value = false;
    } catch (error) {
      visitorPasses.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isVisitorPassesLoading.value = false;
    }
  }

  async function getVisitorPassesByPageSearch({
    page = 1,
    search = "",
    limit = 10,
    site = "",
    status = "",
    template = "",
  }: {
    page?: number;
    search?: string;
    limit?: number;
    site?: string;
    status?: string;
    template?: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/search/v1",
      {
        method: "POST",
        body: JSON.stringify({
          page,
          search,
          limit,
          site,
          status,
          template,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addVisitorPass(form: TVisitorPass) {
    const { error, data } = await useLocalFetch("/api/facilities/v1", {
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

  async function deleteVisitorPass({
    _id,
    site,
  }: {
    _id?: string;
    site?: string;
  }) {
    const { error, data } = await useLocalFetch("/api/facilities/v1", {
      method: "DELETE",
      body: JSON.stringify({ _id, site }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  function nextPage(
    { site, search, status, template } = {} as {
      site?: string;
      search?: string;
      status?: string;
      template?: string;
    },
  ) {
    page.value++;
    setVisitorPasses({
      site,
      search,
      status,
      template,
    });
  }

  function prevPage(
    { site, search, status, template } = {} as {
      site?: string;
      search?: string;
      status?: string;
      template?: string;
    },
  ) {
    page.value--;
    setVisitorPasses({
      site,
      search,
      status,
      template,
    });
  }

  return {
    visitorPass,
    visitorPasses,
    setVisitorPass,
    setVisitorPasses,
    isVisitorPassesLoading,
    search,
    filterStatus,
    filterVisitorPassTemplate,
    itemsPerPage,
    canPrevPage,
    prevPage,
    canNextPage,
    nextPage,
    pageRange,
    addVisitorPass,
    deleteVisitorPass,
  };
}
