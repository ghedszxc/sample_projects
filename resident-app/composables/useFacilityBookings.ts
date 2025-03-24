export default function useFacilityBookings() {
  const { useLocalFetchUtil, getCapitalized, standardFormatDate } = useUtils();

  class MFacilityBooking implements TFacilityBooking {
    _id?: string;
    facility: string;
    site: string;
    timeSlots: string[];
    user: string;
    date: string;
    pax: number;
    status?: string;

    constructor(
      {
        _id = "",
        facility = "",
        site = "",
        timeSlots = [],
        user = "",
        date = "",
        pax = 0,
        status = "",
      } = {} as TFacilityBooking,
    ) {
      this._id = _id;
      this.facility = facility;
      this.site = site;
      this.timeSlots = timeSlots;
      this.user = user;
      this.date = date;
      this.pax = pax;
      this.status = status;
    }
  }

  const facilityBooking = useState(
    "facilityBooking",
    () => new MFacilityBooking(),
  );
  const facilityBookings = useState(
    "facilityBookings",
    (): TFacilityBooking[] => [],
  );
  const facilityBookingsHistory = useState(
    "facilityBookingsHistory",
    (): TFacilityBooking[] => [],
  );
  const pageBook = useState("facilityBookingPage", () => 1);
  const pagesBook = useState("facilityBookingPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);

  const pageHistory = useState("facilityBookingPageHistory", () => 1);
  const pagesHistory = useState("facilityBookingPagesHistory", () => 0);
  const itemsPerPageHistory = useState("itemsPerPageHistory", () => 10);

  const search = useState("facilityBookingSearch", () => "");
  const selectedFilter = useState("facilityBookingSelectedFilter", () => "all");
  const pageRange = useState("facilityBookingPageRange", () => "-- - -- of --");
  const isFacilityBookingsLoaded = useState(
    "isFacilityBookingsLoaded",
    () => false,
  );

  const canNextPages = computed(() => pagesBook.value > pageBook.value);
  const canPrevPages = computed(() => pageBook.value <= 1);

  function nextPages(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    pageBook.value++;
  }

  function prevPages(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    pageBook.value--;
  }

  const canNextPageHistory = computed(
    () => pagesHistory.value > pageHistory.value,
  );
  const canPrevPageHistory = computed(() => pageHistory.value <= 1);

  function nextPageHistory(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    pageHistory.value++;
  }

  function prevPageHistory(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    pageHistory.value--;
  }

  const filters = useState("filters", () => ({
    from: standardFormatDate(new Date()),
    to: standardFormatDate(new Date()),
  }));

  async function setFacilityBookings(
    { site, user, dataType } = {} as {
      site?: string;
      user?: string;
      dataType?: string;
    },
  ) {
    try {
      isFacilityBookingsLoaded.value = true;

      const _facilityBookings = (await getFacilityBookingsByPageSearch({
        page: pageBook.value,
        //search: search.value,
        site,
        user,
        dataType,
      })) as TFacilityBookingsByPageSearchResponse;

      facilityBookings.value = _facilityBookings.items as TFacilityBooking[];

      pageRange.value = _facilityBookings.pageRange;
      pagesBook.value = _facilityBookings.pages;
      isFacilityBookingsLoaded.value = false;
    } catch (error) {
      facilityBookings.value = [];

      pageRange.value = "-- - -- of --";
      pagesBook.value = 0;
      isFacilityBookingsLoaded.value = false;
    }
  }

  async function setFacilityBookingsHistory(
    { site, user, dataType } = {} as {
      site?: string;
      user?: string;
      dataType?: string;
    },
  ) {
    try {
      isFacilityBookingsLoaded.value = true;

      const _facilityBookings = (await getFacilityBookingsByPageSearch({
        page: pageBook.value,
        //search: search.value,
        site,
        user,
        dataType,
      })) as TFacilityBookingsByPageSearchResponse;

      facilityBookingsHistory.value =
        _facilityBookings.items as TFacilityBooking[];
      pageRange.value = _facilityBookings.pageRange;
      pagesHistory.value = _facilityBookings.pages;
      isFacilityBookingsLoaded.value = false;
    } catch (error) {
      facilityBookings.value = [];
      facilityBookingsHistory.value = [];
      pageRange.value = "-- - -- of --";
      pagesHistory.value = 0;
      isFacilityBookingsLoaded.value = false;
    }
  }

  async function getFacilityBookingsByPageSearch({
    page = 1,
    // search = "",
    limit = 10,
    site = "",
    user = "",
    dataType = "",
  }: {
    page?: number;
    // search?: string;
    limit?: number;
    site?: string;
    user?: string;
    dataType?: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/search/v1",
      {
        method: "POST",
        body: JSON.stringify({
          page,
          //search,
          limit,
          site,
          user,
          dataType,
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

  //   async function addFacility(form: TFacility) {
  //     const { error, data } = await useLocalFetch("/api/facilities/v1", {
  //       method: "POST",
  //       body: JSON.stringify(form),
  //     });
  //     if (error && error.value && error.value.data) {
  //       return Promise.reject(error.value.data.message as string);
  //     }

  //     const result = data as any;
  //     if (result && result.value) {
  //       return Promise.resolve(result.value.message as string);
  //     }
  //   }

  function setFacilityBooking(data?: TFacilityBooking) {
    facilityBooking.value = data || new MFacilityBooking();
  }

  async function onExportPdf(url: string) {
    const res = await useLocalFetchUtil<Blob | MediaSource>(
      `/api/facilities-pdf/pdf/v1`,
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

  async function cancelFacilityBooking({
    _ids = [],
    remarks = "",
    facility = "",
    site = "",
    status = "",
  }: {
    _ids?: string[];
    remarks?: string;
    facility?: string;
    site?: string;
    status?: string;
  }) {
    const { error, data } = await useLocalFetch(
      `/api/facilities-booking/update-booking/v1`,
      {
        method: "POST",
        body: JSON.stringify({ _ids, remarks, facility, site, status }),
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

  async function getBookingVacantSlot({
    facility,
    date,
    site,
  }: {
    facility?: string;
    site: string;
    date: any;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/vacant-slot/v1",
      {
        method: "POST",
        body: JSON.stringify({
          facility,
          date,
          site,
        }),
      },
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(data.value);
    }

    return data;
  }

  return {
    pageBook,
    pagesBook,
    itemsPerPage,
    search,
    selectedFilter,
    pageRange,
    isFacilityBookingsLoaded,
    filters,
    facilityBookings,
    facilityBooking,
    // addFacility,
    setFacilityBooking,
    onExportPdf,
    setFacilityBookings,
    getFacilityBookingsByPageSearch,
    // editFacilityById,
    // setFacilitySettings,
    // getFacilitiesSetting,
    nextPages,
    prevPages,
    canNextPages,
    canPrevPages,
    pagesHistory,
    itemsPerPageHistory,
    pageHistory,
    nextPageHistory,
    prevPageHistory,
    canNextPageHistory,
    canPrevPageHistory,
    cancelFacilityBooking,
    facilityBookingsHistory,
    setFacilityBookingsHistory,
    getBookingVacantSlot,
  };
}
