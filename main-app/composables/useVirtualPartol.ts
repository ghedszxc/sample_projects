export default function useVirtualPatrol() {
  class MVirtualPatrol implements TVirtualPatrol {
    _id: string;
    routeName: string;
    assignedUser: string;
    schedule?: {
      startTime: string;
      endTime: string;
      daysOfWeek: string[];
    };

    cctvList?: string[];

    organization: string;
    site: string;

    constructor(
      {
        _id = "",
        routeName = "",
        assignedUser = "",
        schedule = {
          startTime: "",
          endTime: "",
          daysOfWeek: [],
        },

        cctvList = [],

        organization = "",
        site = "",
      } = {} as TVirtualPatrol
    ) {
      this._id = _id;
      this.routeName = routeName;
      this.assignedUser = assignedUser;
      this.schedule = schedule as any;

      this.cctvList = cctvList;

      this.organization = organization;
      this.site = site;
    }
  }

  const daysWeek = useState("daysWeek", () => [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const vPatrols = useState("vPatrols", (): TVirtualPatrol[] => []);
  const page = useState("vPatrolPage", () => 1);
  const pages = useState("vPatrolPages", () => 1);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const pageRange = useState("vPatrolPageRange", () => "-- - -- of --");
  const search = useState("vPatrolSearch", () => "");
  const isVPatrolValid = useState("isVPatrolValid", () => false);
  const isVPatrolLoading = useState("isVPatrolLoading", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const specificPatrolLog = useState("patrolLog", () => ({}));

  const addDialog = useState("addDialog", () => false);
  const patrolLogDialog = useState("patrolLogDialog", () => false);
  const addIncidentDialog = useState("addIncidentDialog", () => false);

  const addRouteSteps = useState("addRouteSteps", () => 1);

  const cctvLiveFeedDialog = useState("cctvLiveFeedDialog", () => false);
  const selectedCctv = useState("selectedCctv", () => false);

  const patrolQuestionnaires = useState("patrolQuestionnaires", () => []);

  const vPatrol = useState(
    "vPatrol",
    (): TVirtualPatrol => new MVirtualPatrol()
  );

  function setVPatrol(data?: TVirtualPatrol) {
    vPatrol.value = data || new MVirtualPatrol();
  }

  async function getVPatrolByPageSearch(
    { page = 1, search = "", organization = "", site = "" } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
    }
  ) {
    const { error, data } = await useLocalFetch("/api/routes", {
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

  async function getVPatrolById(_id: string, page: number | string) {
    const { error, data } = await useLocalFetch(`/api/routes/${_id}`, {
      method: "GET",
      query: { page },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getSpecificPatrolLogById(
    patrolLogId: string,
    cctvId: string,
    routeId: string
  ) {
    const { error, data } = await useLocalFetch(
      `/api/routes/specific-patrol-log/${patrolLogId}`,
      {
        method: "GET",
        query: { cctvId, routeId },
      }
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setVPatrols(
    { organization, site } = {} as { organization?: string; site?: string }
  ) {
    try {
      isVPatrolLoading.value = true;
      const _vPatrols = (await getVPatrolByPageSearch({
        page: page.value,
        search: search.value,
        organization: organization,
        site: site,
      })) as TGetVirtualPatrolResponse;
      vPatrols.value = _vPatrols.items as TVirtualPatrol[];
      pageRange.value = _vPatrols.pageRange;
      isVPatrolLoading.value = false;
    } catch (error) {
      vPatrols.value = [];
      pageRange.value = "-- - -- of --";
      isVPatrolLoading.value = false;
    }
  }

  async function addVirtualPatrol(form: any) {
    const { error, data } = await useLocalFetch("/api/routes", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function updateVPatrol(form: any) {
    let _id = form._id;
    delete form._id;
    delete form.createdAt;
    delete form.udpatedAt;
    delete form.updatedAt;

    const { data, error } = await useLocalFetch(`/api/routes/${_id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function deleteVPatrol(id: string) {
    const { error, data } = await useLocalFetch(`/api/routes/${id}`, {
      method: "DELETE",
      body: "",
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site } = {} as { organization?: string; site?: string }
  ) {
    page.value++;
    getVPatrolByPageSearch({
      page: page.value,
      search: search.value,
      organization: organization,
      site: site,
    });
  }

  function prevPage(
    { organization, site } = {} as { organization?: string; site?: string }
  ) {
    page.value--;
    getVPatrolByPageSearch({
      page: page.value,
      search: search.value,
      organization: organization,
      site: site,
    });
  }

  async function getPatrolQuestionnaires() {
    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/questions`,
      {
        method: "GET",
      }
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getPatrolLogList(routeId: string, cctvId: string) {
    const { data, error } = await useLocalFetch(`/api/routes/patrol-log/all`, {
      method: "GET",
      query: { routeId, cctvId },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addPatrolLog(payload: any) {
    const { error, data } = await useLocalFetch("/api/routes/patrol-log", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }
  
  async function getPatrolLogListV2(payload: any) {
    isVPatrolLoading.value = true

    try {
      console.log("API: ", payload)
      const { error, data } = await useLocalFetch("/api/routes/v1/patrol-log", {
        method: "GET",
        query: payload
      })
  
      isVPatrolLoading.value = false

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message as string);
      }
  
      const result = data as any;
      if (result && result.value) {
        return Promise.resolve(result.value);
      }

    } catch (error) {
      isVPatrolLoading.value = false
      return Promise.reject(error);
    }
  }

  return {
    vPatrol,
    vPatrols,
    page,
    pages,
    daysWeek,
    setVPatrol,
    setVPatrols,
    isVPatrolValid,
    isVPatrolLoading,
    addVirtualPatrol,
    getVPatrolById,

    specificPatrolLog,
    getSpecificPatrolLogById,
    pageRange,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    deleteVPatrol,
    updateVPatrol,
    itemsPerPage,
    filterOrganization,
    filterSite,

    addDialog,
    patrolLogDialog,
    addIncidentDialog,

    addRouteSteps,
    cctvLiveFeedDialog,
    selectedCctv,

    getPatrolQuestionnaires,
    patrolQuestionnaires,
    addPatrolLog,
    getPatrolLogList,
    getPatrolLogListV2
  };
}
