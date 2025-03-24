export default function usetFacility() {
  const { useLocalFetchUtil, getCapitalized, standardFormatDate } = useUtils();

  class MFacility implements TFacility {
    _id?: string;
    name: string;
    site: string;
    featuredImage: { _id: string; name: string } | null;
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
    about: string;
    maintenanceDates: Date[];
    maintenanceWeekly: string[];
    maintenanceMonthly: string[];
    createdAt?: Date;
    updatedAt?: Date;
    status?: string;
    rulesAndPolicies?: string;
    icon?: string;
    hourInterval?: number;

    constructor(
      {
        _id = "",
        name = "",
        featuredImage = null,
        site = "",
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
        about = "",
        maintenanceDates = [],
        maintenanceWeekly = [],
        maintenanceMonthly = [],
        status = "",
        rulesAndPolicies = "",
        icon = "",
        hourInterval = 1,
      } = {} as TFacility,
    ) {
      this._id = _id;
      this.name = name;
      this.site = site;
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
      this.about = about;
      this.maintenanceDates = maintenanceDates;
      this.maintenanceWeekly = maintenanceWeekly;
      this.maintenanceMonthly = maintenanceMonthly;
      this.status = status;
      this.rulesAndPolicies = rulesAndPolicies;
      this.icon = icon;
      this.hourInterval = hourInterval;
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

  const filters = useState("filters", () => ({
    from: standardFormatDate(new Date()),
    to: standardFormatDate(new Date()),
  }));

  const affectedBookingsTab = useState("affectedBookingsTab", () => "approved");

  async function setFacilities({ sites } = {} as { sites?: string[] }) {
    try {
      isFacilitiesLoaded.value = true;
      const _facilities = (await getFacilitiesByPageSearch({
        page: page.value,
        search: search.value,
        sites,
      })) as TFacilityResponse;

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

  async function updateMaintenance({
    _id = "invalid",
    site = "invalid",
    maintenanceDates = [],
    maintenanceWeekly = [],
    maintenanceMonthly = [],
  }: {
    _id: string;
    site: string;
    maintenanceDates: Date[] | null;
    maintenanceWeekly?: String[] | null;
    maintenanceMonthly?: String[] | null;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities/maintenance/v1",
      {
        method: "POST",
        body: JSON.stringify({
          _id,
          site,
          maintenanceDates,
          maintenanceWeekly,
          maintenanceMonthly,
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

  async function getAffectedBookings({
    page = 1,
    limit = 10,
    facility = "",
    site = "",
    maintenanceDates = [],
    maintenanceWeekly = [],
    maintenanceMonthly = [],
    status = "",
  }: {
    page?: number;
    limit?: number;
    facility: string;
    site: string;
    maintenanceDates: Date[] | null;
    maintenanceWeekly?: String[];
    maintenanceMonthly?: String[];
    status?: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/maintenance-affected/v1",
      {
        method: "POST",
        body: JSON.stringify({
          page,
          limit,
          facility,
          site,
          maintenanceDates,
          maintenanceWeekly,
          maintenanceMonthly,
          status,
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

  async function deleteFacility({
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
    a.download = `FACILITY BOOKINGS - ${getCapitalized(selectedFilter.value)} - FROM ${filters.value.from} TO ${filters.value.to}.pdf`; // Specify the file name
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
      return Promise.resolve(result.value);
    }
  }

  async function setFacilitySettings({
    advanceBookingDays,
    bookingHours,
    pax,
    site,
    monday,
    tuesday,
    wednesday,
    thursday,
    friday,
    saturday,
    sunday,
    onePending,
  }: {
    advanceBookingDays?: number;
    bookingHours?: string;
    pax?: boolean;
    site: any;
    monday: any;
    tuesday: any;
    wednesday: any;
    thursday: any;
    friday: any;
    saturday: any;
    sunday: any;
    onePending: boolean;
  }) {
    const { error, data } = await useLocalFetch("/api/facilities-settings/v1", {
      method: "POST",
      body: JSON.stringify({
        advanceBookingDays,
        bookingHours,
        pax,
        site,
        monday,
        tuesday,
        wednesday,
        thursday,
        friday,
        saturday,
        sunday,
        onePending,
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

  function nextPage(
    { sites } = {} as {
      sites?: string[];
    },
  ) {
    page.value++;
    setFacilities({
      sites,
    });
  }

  function prevPage(
    { sites } = {} as {
      sites?: string[];
    },
  ) {
    page.value--;
    setFacilities({
      sites,
    });
  }

  async function getAffectedBookedSlot({
    page = 1,
    limit = 1,
    facility,
    timeSlots,
    date,
    site,
    status,
  }: {
    page: number;
    limit: number;
    facility: string;
    timeSlots: { _id: string; slot: string }[];
    user: string;
    site: string;
    date?: any;
    pax: number;
    status?: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/search/v1",
      {
        method: "POST",
        body: JSON.stringify({
          page,
          limit,
          facility,
          timeSlots,
          date,
          site,
          status,
        }),
      },
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(data.value as string);
    }

    return data;
  }

  async function cancelFacilityBooking({
    _ids,
    facility,
    site,
    remarks,
  }: {
    _ids?: string[];
    facility: string;
    site: string;
    remarks: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/cancel-booking/v1",
      {
        method: "POST",
        body: JSON.stringify({ _ids, facility, site, remarks }),
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

  return {
    page,
    pages,
    itemsPerPage,
    search,
    selectedFilter,
    pageRange,
    isFacilitiesLoaded,
    isFacilityBookingsLoaded,
    filters,
    facilities,
    facility,
    addFacility,
    setFacility,
    onExportPdf,
    setFacilities,
    getFacilitiesByPageSearch,
    updateMaintenance,
    getAffectedBookings,
    editFacilityById,
    setFacilitySettings,
    getFacilitiesSetting,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    getAffectedBookedSlot,
    affectedBookingsTab,
    cancelFacilityBooking,
    deleteFacility,
  };
}
