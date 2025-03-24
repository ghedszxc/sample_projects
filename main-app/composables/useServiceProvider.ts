const { useLocalFetchUtil } = useUtils();
export default function useServiceProvider() {
  class MServiceProvider implements TServiceProvider {
    _id?: string;
    name: string;
    email?: string;
    contactNumber?: string;
    description?: string;
    organization: string;
    site: string | TSite;
    team?: string[];
    service_access?: string[];
    status?: string;
    createdAt?: string;
    updatedAt?: string;
    services?: string[];
    service?: string;
    constructor(
      {
        _id = "",
        name = "",
        email = "",
        contactNumber = "",
        description = "",
        organization = "",
        site = "",
        team = [],
        service_access = [],
        status = "",
        createdAt = "",
        updatedAt = "",
        services = [],
        service = "",
      } = {} as TServiceProvider,
    ) {
      this._id = _id;
      this.name = name;
      this.email = email;
      this.contactNumber = contactNumber;
      this.description = description;
      this.organization = organization;
      this.site = site;
      this.team = team;
      this.service_access = service_access;
      this.status = status;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.services = services;
      this.service = service;
    }
  }

  const serviceProviderApiUrl = "/service-providers/v1/";
  const serviceProviders = useState(
    "serviceProviders",
    (): TServiceProvider[] => [],
  );
  const page = useState("serviceProviderPage", () => 1);
  const pages = useState("serviceProviderPages", () => 0);
  const pageRange = useState("serviceProviderPageRange", () => "-- - -- of --");
  const search = useState("serviceProviderSearch", () => "");
  const selectFilter = useState("selectFilterServiceProvider", () => "All");
  const itemsPerPage = useState("itemsPerPageIncident", () => 10);
  const services = useState("services", (): string[] => []);
  const allServices = useState("allServices", (): string[] => []);
  const deleteLoading = useState("deleteLoading", () => false);
  const isServiceProviderValid = useState(
    "isServiceProviderValid",
    () => false,
  );
  const isServiceProviderLoading = useState(
    "isServiceProviderLoading",
    () => false,
  );
  const serviceProvider = useState(
    "serviceProvider",
    (): TServiceProvider => new MServiceProvider(),
  );

  function setServiceProvider(data?: TServiceProvider) {
    serviceProvider.value = data || new MServiceProvider();
  }

  async function getServiceProvidersByPageSearch(
    {
      page = 0,
      limit = 10,
      organization,
      site,
      date = "",
      search = "",
      service = "",
    } = {} as IServiceProviderSearch,
  ) {
    const data = await useLocalFetchUtil<TServiceProviderResponse>(
      serviceProviderApiUrl,
      "GET",
      {
        page,
        limit,
        organization,
        site,
        date,
        search,
        service,
      },
    );
    return data;
  }

  async function getServiceProviderById(_id: string) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/${_id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TServiceProvider);
    }
  }

  async function getServiceProviderGroupById(_id: string) {
    const { error, data } = await useLocalFetch(
      `/api/service-provider-groups/v1/${_id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TServiceProvider);
    }
  }

  async function getServiceProvidersServices() {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/services`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as string[]);
    }
  }

  async function getServiceProvidersBySiteService(
    site: string,
    service: string,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/site/${site}?service=${service}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TServiceProviderAsOptions[]);
    }
  }

  async function getServiceProvidersAccessList() {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/allservices`,
    );
    allServices.value = data.value.data;
  }

  async function setServiceProviders(
    { date = "", service = "" } = {} as IServiceProviderSearch,
  ) {
    if (/All/i.test(service)) service = "";
    try {
      isServiceProviderLoading.value = true;
      const _serviceProvider = (await getServiceProvidersByPageSearch({
        page: page.value,
        search: search.value,
        service: service,
      })) as TDataRequestResponse;
      serviceProviders.value = _serviceProvider.items as TServiceProvider[];
      pageRange.value = _serviceProvider.pageRange;
      pages.value = _serviceProvider.pages;
      isServiceProviderLoading.value = false;
    } catch (error) {
      serviceProviders.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isServiceProviderLoading.value = false;
    }
  }

  async function addServiceProvider(
    { name, services, organization, site } = {} as TServiceProvider,
  ) {
    const { error, data } = await useLocalFetch("/api/service-providers/v1", {
      method: "POST",
      body: JSON.stringify({
        name,
        services,
        organization,
        site,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function sendInviteLink(
    { email, role, site } = {} as {
      email?: string;
      role?: string;
      site?: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      "/api/service-providers/v1/signup/link",
      {
        method: "POST",
        body: JSON.stringify({
          email,
          role,
          site,
        }),
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

  async function inviteAndCollab(
    { serviceProvider, site, email } = {} as {
      serviceProvider: string;
      site: string;
      email: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      `/api/users/invite/${serviceProvider}/collab/${site}`,
      {
        method: "POST",
        body: JSON.stringify({
          email,
        }),
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

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage() {
    page.value++;
    setServiceProviders();
  }

  function prevPage() {
    page.value--;
    setServiceProviders();
  }

  async function updateServiceProviderNameById(
    _serviceProvider: TUpdateServiceProviderNameOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/name/${_serviceProvider._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: _serviceProvider.name }),
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

  async function updateServiceProviderContactById(
    _serviceProvider: TUpdateServiceProviderNameOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/contact/${_serviceProvider._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ contactNumber: _serviceProvider.contactNumber }),
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

  async function updateServiceProviderServicesAccessById(
    _serviceProvider: TUpdateServiceServiceAccessOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/services_access/${_serviceProvider._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          service_access: _serviceProvider.service_access,
        }),
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

  async function updateServiceProviderStatusById(
    _serviceProvider: TUpdateServiceProviderStatusOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/status/${_serviceProvider._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: _serviceProvider.status }),
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

  async function updateServiceProviderEmailById(
    _serviceProvider: TUpdateServiceProviderEmailOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/email/${_serviceProvider._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ email: _serviceProvider.email }),
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

  async function updateServiceProviderServicesById(
    _serviceProvider: TUpdateServiceProviderServicesOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/services/${_serviceProvider._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ services: _serviceProvider.services }),
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

  async function deleteServiceProviderById(_id: string) {
    deleteLoading.value = true;
    const { error, data } = await useLocalFetch(
      `/api/service-providers/v1/${_id}`,
      {
        method: "DELETE",
      },
    );

    if (error && error.value && error.value.data) {
      deleteLoading.value = false;
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      deleteLoading.value = false;
      return Promise.resolve(result.value.message as string);
    }
  }

  return {
    serviceProvider,
    serviceProviders,
    allServices,
    setServiceProvider,
    setServiceProviders,
    isServiceProviderValid,
    isServiceProviderLoading,
    addServiceProvider,
    getServiceProviderById,
    page,
    pages,
    pageRange,
    itemsPerPage,
    search,
    canNextPage,
    canPrevPage,
    deleteLoading,
    nextPage,
    updateServiceProviderContactById,
    prevPage,
    updateServiceProviderNameById,
    updateServiceProviderEmailById,
    services,
    updateServiceProviderServicesById,
    updateServiceProviderServicesAccessById,
    deleteServiceProviderById,
    getServiceProvidersServices,
    getServiceProvidersBySiteService,
    getServiceProvidersAccessList,
    updateServiceProviderStatusById,
    getServiceProviderGroupById,
    sendInviteLink,
    inviteAndCollab,
    selectFilter,
  };
}
