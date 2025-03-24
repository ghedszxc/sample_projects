export default function useEvent() {
  class MEvent implements TEvent {
    _id?: string;
    title?: string;
    description?: string;
    serviceType?: string;
    start?: string;
    end?: string;
    duration?: number;
    organization?: string;
    site?: string;
    serviceProvider?: string;
    serviceProviderGroup?: string;
    serviceProviderMember?: string;
    // assignee: TAssignee;
    // createdBy: TCreatedBy;
    constructor(
      {
        _id = "",
        title = "",
        description = "",
        serviceType = "",
        start = "",
        end = "",
        duration = 0,
        organization = "",
        site = "",
        serviceProvider = "",
        serviceProviderGroup = "",
        serviceProviderMember = "",
      } = {} as TEvent,
    ) {
      this._id = _id;
      this.title = title;
      this.description = description;
      this.serviceType = serviceType;
      this.start = start;
      this.end = end;
      this.duration = duration;
      this.organization = organization;
      this.site = site;
      this.serviceProvider = serviceProvider;
      this.serviceProviderGroup = serviceProviderGroup;
      this.serviceProviderMember = serviceProviderMember;
    }
  }

  // class MVisitor implements TVisitor {
  //   // common
  //   _id: string;
  //   name: string;
  //   firstName: string;
  //   lastName: string;
  //   type: string;
  //   contractorType?: string;
  //   nric: string;
  //   phoneNumber: string;
  //   email: string;
  //   checkIn?: string;
  //   checkOut?: string;
  //   remarks: string;
  //   updatedAt?: Date;
  //   organization?: string;
  //   site?: string;
  //   // visitors
  //   companyName?: string;
  //   visitorPass?: TKeyLog;
  //   plateNumber?: string;
  //   passNumber?: string;
  //   passKeyNumber?: string;

  //   passReceivedDate?: string;
  //   keyReceivedDate?: string;
  //   passReturnDate?: string;
  //   keyReturnDate?: string;
  //   isPassReturned: boolean; // visitor pass should returned to the guard
  //   isKeyReturned: boolean; // pass key should returned to the guard
  //   passKeys?: string[]; // [key.code]
  //   // passKeys?: IPass[] | IKeys[]; // in preparation only
  //   isStatusCleared?: boolean; // if contractor returned all keys and passes he/she should be cleared
  //   block?: string;
  //   unit?: string;
  //   blockLevel?: string;
  //   registeredAt?: string;

  //   pickupDropoffType?: string;
  //   constructor(
  //     {
  //       // common
  //       _id = "",
  //       name = "",
  //       firstName = "",
  //       lastName = "",
  //       type = "",
  //       contractorType = "",
  //       nric = "",
  //       phoneNumber = "",
  //       email = "",
  //       checkIn = "",
  //       checkOut = "",
  //       remarks = "",
  //       organization = "",
  //       site = "",
  //       //
  //       plateNumber = "",
  //       block = "",
  //       blockLevel = "",
  //       unit = "",
  //       visitorPass,
  //       passKeys = [],

  //       companyName = "",
  //       passKeyNumber = "",
  //       passNumber = "",
  //       passReturnDate = "",
  //       keyReturnDate = "",
  //       isPassReturned = false,
  //       isKeyReturned = false,

  //       pickupDropoffType = "",
  //     } = {} as TVisitor
  //   ) {
  //     // common
  //     this._id = _id || "";
  //     this.name = name;
  //     this.firstName = firstName;
  //     this.lastName = lastName;
  //     this.type = type;
  //     this.contractorType = contractorType || "";
  //     this.nric = nric;
  //     this.phoneNumber = phoneNumber;
  //     this.email = email;
  //     this.checkIn = checkIn;
  //     this.checkOut = checkOut;
  //     this.remarks = remarks;
  //     this.organization = organization;
  //     this.site = site;
  //     //
  //     this.companyName = companyName;
  //     this.block = block;
  //     this.blockLevel = blockLevel;
  //     this.unit = unit;
  //     this.visitorPass = visitorPass;
  //     this.plateNumber = plateNumber;
  //     this.passNumber = passNumber;
  //     this.passKeyNumber = passKeyNumber;

  //     this.passReturnDate = passReturnDate;
  //     this.keyReturnDate = keyReturnDate;
  //     this.isPassReturned = isPassReturned;
  //     this.isKeyReturned = isKeyReturned;
  //     this.passKeys = passKeys || [];

  //     this.pickupDropoffType = pickupDropoffType;
  //   }
  // }

  const tab = useState("tab", () => "upcoming events");
  const event = useState("event", () => new MEvent());
  // const visitor = useState("visitor", () => new MVisitor());
  const events = useState("events", (): TEvent[] => []);
  const visitors = useState("visitors", (): TVisitor[] => []);
  const page = useState("eventPage", () => 1);
  const pages = useState("eventPages", () => 1);
  const pageVisitor = useState("visitorPage", () => 1);
  const pagesVisitor = useState("visitorPages", () => 1);
  const itemsPerPage = useState("itemsPerPage", () => 5);
  const search = useState("eventSearch", () => "");
  const pageRange = useState("eventPageRange", () => "-- - -- of --");
  const pageRangeVisitor = useState("visitorPageRange", () => "-- - -- of --");
  const isEventsLoading = useState("isEventsLoading", () => false);
  const isEventValid = useState("isEventValid", () => false);
  const isServicesLoading = useState("isServicesLoading", () => false);
  const isServiceProvidersLoading = useState(
    "isServiceProvidersLoading",
    () => false,
  );
  const isServiceProviderGroupsLoading = useState(
    "isServiceProviderGroupsLoading",
    () => false,
  );

  async function getServicesBySite(
    { page = 1, limit = 10, site = "", serviceProvider = "" } = {} as {
      page?: number;
      limit?: number;
      site?: string;
      serviceProvider?: string;
    },
  ) {
    isServicesLoading.value = true;
    let query_params = "?";
    if (page) query_params = `${query_params}&page=${page}`;
    if (limit) query_params = `${query_params}&limit=${limit}`;
    if (site) query_params = `${query_params}&site=${site}`;
    if (serviceProvider)
      query_params = `${query_params}&serviceProvider=${serviceProvider}`;

    const { error, data } = await useLocalFetch(
      `/api/events/get-services-site${query_params}`,
    );

    isServicesLoading.value = false;

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result) {
      return Promise.resolve(result.value as string);
    }
  }

  async function getServiceProviderMembersById(
    {
      page = 1,
      limit = 10,
      site = "",
      serviceProviderGroupId = "",
      serviceProvider = "",
    } = {} as {
      page?: number;
      limit?: number;
      site?: string;
      serviceProviderGroupId?: string;
      serviceProvider?: string;
    },
  ) {
    isServiceProvidersLoading.value = true;

    let query_params = "?";
    if (page) query_params = `${query_params}&page=${page}`;
    if (limit) query_params = `${query_params}&limit=${limit}`;
    if (site) query_params = `${query_params}&site=${site}`;
    if (serviceProviderGroupId)
      query_params = `${query_params}&serviceProviderGroupId=${serviceProviderGroupId}`;
    if (serviceProvider)
      query_params = `${query_params}&serviceProvider=${serviceProvider}`;

    const { error, data } = await useLocalFetch(
      `/api/events/get-service-provider-users${query_params}`,
    );

    isServiceProvidersLoading.value = false;

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result) {
      return Promise.resolve(result.value as string);
    }
  }

  async function getServiceProviderGroupsById(
    { page = 1, limit = 10, site = "", service = "" } = {} as {
      page?: number;
      limit?: number;
      site?: string;
      service?: string;
    },
  ) {
    isServiceProviderGroupsLoading.value = true;

    let query_params = "?";
    if (page) query_params = `${query_params}&page=${page}`;
    if (limit) query_params = `${query_params}&limit=${limit}`;
    if (site) query_params = `${query_params}&site=${site}`;
    if (service) query_params = `${query_params}&service=${service}`;

    const { error, data } = await useLocalFetch(
      `/api/events/get-service-provider-groups${query_params}`,
    );

    isServiceProviderGroupsLoading.value = false;

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result) {
      return Promise.resolve(result.value as string);
    }
  }

  async function getEventById(id: string) {
    const { data, error } = await useLocalFetch(`/api/events/${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addEvent(form: TEvent) {
    const { error, data } = await useLocalFetch("/api/events", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value as string);
    }
  }

  async function updateEvent(id: string, form: TEvent) {
    const { error, data } = await useLocalFetch(`/api/events/${id}`, {
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

  async function deleteEvent(id: string) {
    const { error, data } = await useLocalFetch(`/api/events/${id}`, {
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

  function setEvent(data?: TEvent) {
    event.value = new MEvent(data);
  }

  async function getEventsByPageSearch(
    { from, to } = {} as { from?: string; to?: string },
  ) {
    const { error, data } = await useLocalFetch("/api/events", {
      method: "GET",
      query: { from, to },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setEvents({ from, to } = {} as { from: string; to: string }) {
    try {
      isEventsLoading.value = false;
      const _events = (await getEventsByPageSearch({
        from: from,
        to: to,
      })) as TGetEventsByPageSearchResponse;
      events.value = _events.data as TEvent[];
      isEventsLoading.value = true;
    } catch (error) {
      isEventsLoading.value = true;
    }
  }

  async function setEventsByDate(
    {
      dates,
      start,
      end,
      organization,
      site,
      serviceProvider,
      _id,
      status,
      limit = 5,
      page = 1,
    } = {} as {
      dates?: Array<object>;
      start?: string;
      end?: string;
      organization?: string;
      site?: string;
      serviceProvider?: string;
      _id?: string;
      status?: string;
      limit?: number;
      page?: number;
    },
  ) {
    try {
      isEventsLoading.value = true;

      const _events = (await getEventsByDate({
        dates,
        start,
        end,
        page: page.value,
        search: search.value,
        organization,
        site,
        serviceProvider,
        _id,
        status,
        limit,
      })) as TGetEventsByDateResponse;

      if (_id) {
        event.value = _events.items[0];
        event.value.service = _events.items[0].serviceType;
        event.value.serviceProviderGroup = {
          _id: _events.items[0].serviceProviderGroup,
          serviceProvider: _events.items[0].serviceProviderGroup,
          groupName: _events.items[0].serviceProviderGroupName,
        };
        event.value.serviceProviderMember = {
          _id: _events.items[0].serviceProviderMember,
          fullName: _events.items[0].serviceProviderMemberName,
        };
      } else {
        events.value = _events.items as TEvent[];
        pageRange.value = _events.pageRange;
        pages.value = _events.pages;
      }

      isEventsLoading.value = false;
    } catch (error) {
      isEventsLoading.value = false;
    }
  }

  async function getEventsByDate(
    {
      dates,
      start,
      end,
      page = 1,
      limit = 5,
      search = "",
      organization = "",
      site = "",
      serviceProvider = "",
      _id = "",
      status = "",
    } = {} as {
      dates?: Array<object>;
      start?: string;
      end?: string;
      page?: number;
      limit?: number;
      search?: string;
      organization?: string;
      site?: string;
      serviceProvider?: string;
      _id?: string;
      status?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/events/search", {
      method: "POST",
      body: {
        dates,
        start,
        end,
        page,
        limit,
        search,
        organization,
        site,
        serviceProvider,
        _id,
        status,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setVisitorsByDate(
    { dateActualCheckOut } = {} as {
      dateActualCheckOut?: Array<object>;
    },
  ) {
    try {
      isEventsLoading.value = true;

      const _visitors = await getVisitorsByDate({
        dateActualCheckOut,
        page: pageVisitor.value,
        limit: itemsPerPage.value,
      });

      visitors.value = _visitors.items as TVisitor[];
      console.log("visitors", visitors.value);
      pageRangeVisitor.value = _visitors.pageRange;
      pagesVisitor.value = _visitors.pages;
      isEventsLoading.value = false;
    } catch (error) {
      isEventsLoading.value = false;
    }
  }

  async function getVisitorsByDate(
    { dateActualCheckOut, page = 1, limit = 5 } = {} as {
      dateActualCheckOut?: Array<object>;
      page?: number;
      limit?: number;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/visitors/rbac/search", {
      method: "POST",
      body: {
        dateActualCheckOut,
        page,
        limit,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  const canNextPageVisitor = computed(
    () => pagesVisitor.value > pageVisitor.value,
  );
  const canPrevPageVisitor = computed(() => pageVisitor.value <= 1);

  function nextPage(
    { dates, start, end, organization, site, serviceProvider, status } = {} as {
      dates?: Array<object>;
      start?: string;
      end?: string;
      organization?: string;
      site?: string;
      serviceProvider?: string;
      status?: string;
    },
  ) {
    page.value++;
    getEventsByDate({
      dates,
      start,
      end,
      page: page.value,
      search: search.value,
      organization,
      site,
      serviceProvider,
      status,
    });
    setEventsByDate({
      dates,
      start,
      end,
      organization,
      site,
      serviceProvider,
      status,
    });
  }

  function prevPage(
    { dates, start, end, organization, site, serviceProvider, status } = {} as {
      dates?: Array<object>;
      start?: string;
      end?: string;
      organization?: string;
      site?: string;
      serviceProvider?: string;
      status?: string;
    },
  ) {
    page.value--;
    getEventsByDate({
      dates,
      start,
      end,
      page: page.value,
      search: search.value,
      organization,
      site,
      serviceProvider,
      status,
    });
    setEventsByDate({
      dates,
      start,
      end,
      organization,
      site,
      serviceProvider,
      status,
    });
  }

  function nextVisitorsPage(
    { dateActualCheckOut } = {} as {
      dateActualCheckOut?: Array<object>;
    },
  ) {
    pageVisitor.value++;
    getVisitorsByDate({
      dateActualCheckOut,
      page: pageVisitor.value,
    });
    setVisitorsByDate({
      dateActualCheckOut,
    });
  }

  function prevVisitorsPage(
    { dateActualCheckOut } = {} as {
      dateActualCheckOut?: Array<object>;
    },
  ) {
    pageVisitor.value--;
    getVisitorsByDate({
      dateActualCheckOut,
      page: pageVisitor.value,
    });
    setVisitorsByDate({
      dateActualCheckOut,
    });
  }

  return {
    tab,
    event,
    events,
    // visitor,
    visitors,
    page,
    pageRange,
    pageRangeVisitor,
    setEvent,
    isEventsLoading,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    nextVisitorsPage,
    prevVisitorsPage,
    canNextPageVisitor,
    canPrevPageVisitor,
    setEvents,
    isEventValid,
    addEvent,
    updateEvent,
    deleteEvent,
    getEventById,
    setEventsByDate,
    itemsPerPage,
    getServicesBySite,
    isServicesLoading,
    getServiceProviderMembersById,
    isServiceProvidersLoading,
    getServiceProviderGroupsById,
    isServiceProviderGroupsLoading,
    setVisitorsByDate,
    getVisitorsByDate,
    getEventsByDate,
  };
}
