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
  const tab = useState("facilityBookingTab", () => "approved");
  const page = useState("facilityBookingPage", () => 1);
  const pages = useState("facilityBookingPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("facilityBookingSearch", () => "");
  const bookingPageRange = useState(
    "facilityBookingPageRange",
    () => "-- - -- of --",
  );
  const isFacilityBookingsLoaded = useState(
    "isFacilityBookingsLoaded",
    () => false,
  );

  const filters = useState("filters", () => ({
    from: standardFormatDate(new Date()),
    to: standardFormatDate(new Date()),
  }));

  async function setFacilityBookings(
    { status, search, site, dataType, limit, date, facility } = {} as {
      status?: string;
      search?: string;
      site?: string;
      dataType?: any;
      limit?: number;
      date?: { start: any; end: any } | null;
      facility?: string | null;
    },
  ) {
    try {
      isFacilityBookingsLoaded.value = true;
      const _facilityBookings = (await getFacilityBookingsByPageSearch({
        page: page.value,
        status,
        search,
        limit,
        site,
        dataType,
        date,
        facility,
      })) as TFacilityBookingsByPageSearchResponse;

      facilityBookings.value = _facilityBookings.items as TFacilityBooking[];
      bookingPageRange.value = _facilityBookings.pageRange;
      pages.value = _facilityBookings.pages;
      isFacilityBookingsLoaded.value = false;
    } catch (error) {
      facilityBookings.value = [];
      bookingPageRange.value = "-- - -- of --";
      pages.value = 0;
      isFacilityBookingsLoaded.value = false;
    }
  }

  async function getFacilityBookingsByPageSearch({
    page = 1,
    status = "",
    search = "",
    limit = 10,
    site = "",
    dataType = null,
    date = null,
    facility = null,
  }: {
    page?: number;
    status?: string;
    search?: string;
    limit?: number;
    site?: string;
    dataType?: string | null;
    date?: { start: any; end: any } | null;
    facility?: string | null;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/search/v1",
      {
        method: "POST",
        body: JSON.stringify({
          page,
          status,
          search,
          limit,
          site,
          dataType,
          date,
          facility,
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

  function setFacilityBooking(data?: TFacilityBooking) {
    facilityBooking.value = data || new MFacilityBooking();
  }

  async function updateStatus({
    _ids = [],
    remarks = "",
    status = "",
    site = "",
  }: {
    _ids?: string[];
    remarks?: string;
    status?: string;
    site?: string;
  }) {
    const { error, data } = await useLocalFetch(
      `/api/facilities-booking/update-booking/v1`,
      {
        method: "POST",
        body: JSON.stringify({ _ids, remarks, status, site }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function getSimilarBookingSlot({
    page = 1,
    limit = 10,
    _ids = [],
    site,
  }: {
    page?: number;
    limit?: number;
    _ids: string[];
    site: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-booking/similar-booking/v1",
      {
        method: "POST",
        body: JSON.stringify({
          page,
          limit,
          _ids,
          site,
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

  async function generateBookingHistoryPdfOrCsv({
    dataType,
    date = null,
    site = "",
    limit,
  }: {
    limit?: number;
    site?: string;
    dataType?: string | null;
    date?: { start: any; end: any } | null;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/facilities-pdf/csv-pdf/v1",
      {
        method: "POST",
        body: { dataType, date, site, limit },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  const canNextBookingPage = computed(() => pages.value > page.value);
  const canPrevBookingPage = computed(() => page.value <= 1);

  function nextBookingPage(
    { status, search, site, dataType, date, facility } = {} as {
      status?: string;
      search?: string;
      site?: string;
      dataType?: string | null;
      date?: { start: any; end: any };
      facility?: string;
    },
  ) {
    page.value++;
    setFacilityBookings({
      status,
      search,
      site,
      dataType,
      date,
      facility,
    });
  }

  function prevBookingPage(
    { status, search, site, dataType, date, facility } = {} as {
      status?: string;
      search?: string;
      site?: string;
      dataType?: string | null;
      date?: { start: any; end: any };
      facility?: string;
    },
  ) {
    page.value--;
    setFacilityBookings({
      status,
      search,
      site,
      dataType,
      date,
      facility,
    });
  }

  return {
    tab,
    page,
    pages,
    itemsPerPage,
    search,
    bookingPageRange,
    isFacilityBookingsLoaded,
    filters,
    facilityBookings,
    facilityBooking,
    setFacilityBooking,
    setFacilityBookings,
    getFacilityBookingsByPageSearch,
    nextBookingPage,
    prevBookingPage,
    canNextBookingPage,
    canPrevBookingPage,
    updateStatus,
    getSimilarBookingSlot,
    generateBookingHistoryPdfOrCsv,
  };
}
