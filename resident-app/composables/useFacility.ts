export default function useFacility() {
  const { useLocalFetchUtil, getCapitalized, standardFormatDate } = useUtils();

  class MFacility implements TFacility {
    _id?: string;
    name: string;
    site: string;
    rulesAndPolicies: string;
    featuredImage: string;
    gallery: { _id: string; name: string }[];
    monday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    tuesday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    wednesday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    thursday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    friday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    saturday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    sunday: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
      timeSlots: { _id: string; slot: string }[];
    };
    description: string;
    maintenanceDates: Date[];
    maintenanceMonthly: [];
    maintenanceWeekly: [];
    createdAt?: Date;
    updatedAt?: Date;
    status?: string;

    constructor(
      {
        _id = "",
        name = "",
        featuredImage = "",
        site = "",
        rulesAndPolicies = "",
        gallery = [],
        monday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        tuesday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        wednesday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        thursday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        friday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        saturday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        sunday = {
          isEnabled: false,
          startTime: "",
          endTime: "",
          timeSlots: [],
        },
        description = "",
        maintenanceDates = [],
        maintenanceWeekly = [],
        maintenanceMonthly = [],
        status = "",
      } = {} as TFacility,
    ) {
      this._id = _id;
      this.name = name;
      this.site = site;
      this.rulesAndPolicies = rulesAndPolicies;
      this.featuredImage = featuredImage;
      this.gallery = gallery;
      this.monday = monday;
      this.tuesday = tuesday;
      this.wednesday = wednesday;
      this.thursday = thursday;
      this.friday = friday;
      this.saturday = saturday;
      this.sunday = sunday;
      this.description = description;
      this.maintenanceDates = maintenanceDates;
      this.maintenanceMonthly = maintenanceMonthly;
      this.maintenanceWeekly = maintenanceWeekly;
      this.status = status;
    }
  }

  const facility = useState("facility", () => new MFacility());

  const facilities = useState("facilities", (): TFacility[] => []);
  const page = useState("facilityPage", () => 1);
  const pages = useState("facilityPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("facilitySearch", () => "");
  const selectedFilter = useState("facilitySelectedFilter", () => "all");
  const pageRange = useState("facilityPageRange", () => "-- - -- of --");
  const isFacilitiesLoaded = useState("isFacilitiesLoaded", () => false);
  const isFacilityBookingsLoaded = useState(
    "isFacilityBookingsLoaded",
    () => false,
  );

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    page.value++;
  }

  function prevPage(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    page.value--;
  }

  const filters = useState("filters", () => ({
    from: standardFormatDate(new Date()),
    to: standardFormatDate(new Date()),
  }));

  async function setFacilities({ sites } = {} as { sites?: string[] }) {
    try {
      isFacilitiesLoaded.value = true;
      const _facilities = (await getFacilitiesByPageSearch({
        page: page.value,
        search: search.value,
        sites,
      })) as TFacilityResponse;
      page.value = 1;

      facilities.value = _facilities.items as TFacility[];
      pageRange.value = _facilities.pageRange;
      pages.value = _facilities.pages;

      isFacilitiesLoaded.value = false;
    } catch (error) {
      facilities.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isFacilitiesLoaded.value = false;
    }
  }

  async function getFacilitiesByPageSearch({
    page = 1,
    search = "",
    limit = 10,
    sites = [],
    _id = "",
  }: {
    _id?: string;
    page?: number;
    search?: string;
    sites?: string[];
    limit?: number;
  }) {
    const { error, data } = await useLocalFetch("/api/facilities/search/v1", {
      method: "POST",
      body: JSON.stringify({
        page,
        search,
        limit,
        sites,
        _id,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addFacility(form: TFacility) {
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

  function setFacility(data?: TFacility) {
    facility.value = data || new MFacility();
  }

  async function onExportPdf(url: string) {
    const res = await useLocalFetchUtil<Blob | MediaSource>(
      `/api/facilities/v1/pdf`,
      "GET",
      {
        url: url,
        title: `FACILITY BOOKINGS - ${selectedFilter.value} - FROM ${filters.value.from} TO ${filters.value.to}`,
        orientation: "P", // (L|Landscape|P|Portrait)
      },
    );
    const downloadUrl = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `FACILITY BOOKINGS - ${getCapitalized(
      selectedFilter.value,
    )} - FROM ${filters.value.from} TO ${filters.value.to}.pdf`; // Specify the file name
    document.body.appendChild(a);
    a.click(); // Trigger the download
    window.URL.revokeObjectURL(downloadUrl); // Clean up
  }

  async function editFacilityById(facility: TFacility) {
    const { error, data } = await useLocalFetch(`/api/facilities/v1`, {
      method: "PUT",
      body: JSON.stringify(facility),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function setFacilitySettings({
    advanceBookingDays,
    bookingHours,
    pax,
    site,
  }: {
    advanceBookingDays?: number;
    bookingHours?: string;
    pax?: boolean;
    site: any;
  }) {
    const { error, data } = await useLocalFetch("/api/facilities-settings/v1", {
      method: "POST",
      body: JSON.stringify({ advanceBookingDays, bookingHours, pax, site }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function getFacilitiesSetting({ site }: { site: string }) {
    const { error, data } = await useLocalFetch("/api/facilities-settings/v1", {
      method: "PATCH",
      body: JSON.stringify({
        site,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function createBooking({
    facility,
    timeSlots,
    user,
    date,
    pax,
    site,
    invites,
  }: {
    facility: string;
    timeSlots: { _id: string; slot: string }[];
    user: string;
    site: string;
    date: any;
    pax: number;
    invites: any;
  }) {
    const { error, data } = await useLocalFetch("/api/facilities-booking/v1", {
      method: "POST",
      body: JSON.stringify({
        facility,
        timeSlots,
        user,
        date,
        pax,
        site,
        invites,
      }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(data.value as string);
    }

    return data;
  }

  async function getBookingSlot({
    facility,
    timeSlots,
    date,
    site,
  }: {
    facility: string;
    timeSlots: { _id: string; slot: string }[];
    user: string;
    site: string;
    date: any;
    pax: number;
  }) {
    const { error, data } = await useLocalFetch("/api/facilities-booking/v1", {
      method: "PATCH",
      body: JSON.stringify({
        facility,
        timeSlots,
        date,
        site,
      }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(data.value as string);
    }

    return data;
  }

  return {
    page,
    pages,
    itemsPerPage,
    search,
    selectedFilter,
    pageRange,
    isFacilityBookingsLoaded,
    filters,
    facilities,
    facility,
    addFacility,
    setFacility,
    onExportPdf,
    getFacilitiesByPageSearch,
    editFacilityById,
    MFacility,
    setFacilitySettings,
    getFacilitiesSetting,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    createBooking,
    getBookingSlot,
    setFacilities,
    isFacilitiesLoaded,
  };
}
