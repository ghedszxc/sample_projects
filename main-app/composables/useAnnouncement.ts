import Table from "~/components/spgroup/assigned/table.vue";

export default function useAnnouncement() {
  class MAnnouncement implements TAnnouncement {
    _id?: string;
    title: string;
    content?: string;
    file?: Array<Record<string, { _id: string; name: string }>>;
    recipients?: string[];
    site?: string;
    noExpiration?: boolean;
    startDate?: Date | string;
    endDate?: Date | string;
    organization?: string;
    createdAt?: Date | string;
    updatedAt?: Date | string;

    constructor(
      {
        _id = "",
        title = "",
        content = "",
        file = [],
        recipients = [],
        site = "",
        startDate = "",
        endDate = "",
        organization = "",
        createdAt = "",
        updatedAt = "",
      } = {} as TAnnouncement,
    ) {
      this._id = _id || "";
      this.title = title || "";
      this.content = content || "";
      this.file = file || [];
      this.recipients = recipients || [];
      this.site = site || "";
      this.startDate = startDate || "";
      this.endDate = endDate || "";
      this.organization = organization || "";
      this.createdAt = createdAt || "";
      this.updatedAt = updatedAt || "";
    }
  }
  const tab = useState("announcementTab", () => "active-upcoming");
  const announcements = useState("announcements", (): TAnnouncement[] => []);
  const page = useState("announcementPage", () => 1);
  const pages = useState("announcementPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const pageRange = useState("announcementPageRange", () => "-- - -- of --");
  const search = useState("announcementSearch", () => "");
  const isVehicleValid = useState("isVehicleValid", () => false);
  const isAnnouncementLoaded = useState("isAnnouncementLoaded", () => false);
  const announcement = useState(
    "announcement",
    (): TAnnouncement => new MAnnouncement(),
  );
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const selectedAnnouncement = useState("selectedAnnouncement", () => "");
  const addAnnouncementSteps = useState("addAnnouncementSteps", () => 1);
  const editAnnouncementSteps = useState("editAnnouncementSteps", () => 1);

  const filterByType = useState("filterByType", () => "all");
  const filterByStatus = useState("filterByStatus", () => "all");
  const announcementInfoDialog = useState(
    "announcementInfoDialog",
    () => false,
  );
  const updateVehicleStatusDialog = useState(
    "updateVehicleStatusDialog",
    () => false,
  );
  const addAnnouncementDialog = useState("addAnnouncementDialog", () => false);
  const editAnnouncementDialog = useState(
    "editAnnouncementDialog",
    () => false,
  );
  const deleteAnnouncementDialog = useState(
    "deleteAnnouncementDialog",
    () => false,
  );

  const vehicleStatuses = useState("vehicleStatuses", () => [
    { title: "All", value: "all" },
    { title: "Whitelist", value: "whitelist" },
    { title: "Blocklist", value: "blocklist" },
  ]);

  const vehicleTypes = useState("vehicleTypes", () => [
    { title: "All", value: "all" },
    { title: "Visitor", value: "visitor" },
    { title: "Resident", value: "resident" },
  ]);

  const date = useState("date", () => [new Date()]);
  const dates = useState("dates", () => []);

  function setAnnouncement(data?: TAnnouncement) {
    announcement.value = data || new MAnnouncement();
  }

  async function getAnnouncementsByPageSearch({
    tab = "",
    page = 1,
    search = "",
    organization = "",
    limit = 10,
    //   type = "all",
    //   status = "all",
    site,
    dates,
  }: {
    tab?: string;
    page?: number;
    search?: string;
    organization?: string;
    site?: string;
    limit?: number;
    dates?: Array<object>;
    //   type?: string;
    //   status?: string;
  }) {
    const { error, data } = await useLocalFetch("/announcements/v1/all", {
      method: "POST",
      body: JSON.stringify({
        tab,
        page,
        search,
        dates,
        organization,
        site,
        limit,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function searchAnnouncements({
    tab,
    search,
    site,
    organization,
    dates,
  }: {
    tab?: string;
    search: string;
    site: string;
    organization?: string;
    dates?: Array<object>;
  }) {
    const getAnnouncements = (await getAnnouncementsByPageSearch({
      tab,
      page: page.value,
      limit: itemsPerPage.value,
      search,
      site,
      organization,
      dates,
    })) as TGetAnnouncementsByPageSearchResponse;
    announcements.value = getAnnouncements.items as TAnnouncement[];
    pageRange.value = getAnnouncements.pageRange;
    pages.value = getAnnouncements.pages;
  }

  async function getAnnouncementById(_id: string) {
    const { error, data } = await useLocalFetch(
      `/api/visitors/list/anpr/${_id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TVehicle);
    }
  }

  async function setAnnouncements({
    tab,
    search,
    organization,
    site,
    dates,
  }: {
    tab?: string;
    search?: string;
    organization?: string;
    site: string;
    dates?: Array<object>;
  }) {
    try {
      isAnnouncementLoaded.value = true;

      const _announcements = (await getAnnouncementsByPageSearch({
        tab,
        search,
        page: page.value,
        organization,
        site,
        dates,
      })) as TDataRequestResponse;
      announcements.value = _announcements.items as TAnnouncement[];
      pageRange.value = _announcements.pageRange;
      pages.value = _announcements.pages;
      isAnnouncementLoaded.value = false;
    } catch (error) {
      announcements.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isAnnouncementLoaded.value = false;
    }
  }

  async function addAnnouncement(_announcement: TAnnouncement) {
    delete _announcement._id;

    const { error, data } = await useLocalFetch(`/api/announcements/v1`, {
      method: "POST",
      body: JSON.stringify(_announcement),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function editAnnouncementById(
    _id: string,
    _announcement: TAnnouncement,
  ) {
    delete _announcement._id;

    const { error, data } = await useLocalFetch(
      `/api/announcements/v1/${_id}`,
      {
        method: "PUT",
        body: JSON.stringify(_announcement),
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

  async function nextPage({
    tab,
    search,
    organization,
    site,
    dates,
  }: {
    tab?: string;
    search?: string;
    organization?: string;
    site: string;
    dates?: Array<object>;
  }) {
    page.value++;
    await setAnnouncements({
      tab,
      search,
      organization,
      site,
      dates,
    });
  }

  async function prevPage({
    tab,
    search,
    organization,
    site,
    dates,
  }: {
    search?: string;
    organization?: string;
    site: string;
    dates?: Array<object>;
    tab?: string;
  }) {
    page.value--;
    await setAnnouncements({
      tab,
      search,
      organization,
      site,
      dates,
    });
  }

  async function deleteAnnouncementById(id: string) {
    const { error, data } = await useLocalFetch(`/api/announcements/v1/${id}`, {
      method: "DELETE",
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  return {
    tab,
    announcement,
    announcements,
    setAnnouncement,
    setAnnouncements,
    isVehicleValid,
    isAnnouncementLoaded,
    addAnnouncement,
    editAnnouncementById,
    getAnnouncementById,
    page,
    pages,
    itemsPerPage,
    pageRange,
    search,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    filterOrganization,
    filterSite,
    filterByType,
    filterByStatus,
    vehicleStatuses,
    announcementInfoDialog,
    updateVehicleStatusDialog,
    selectedAnnouncement,
    addAnnouncementSteps,
    editAnnouncementSteps,
    vehicleTypes,
    addAnnouncementDialog,
    editAnnouncementDialog,
    deleteAnnouncementDialog,
    deleteAnnouncementById,
    searchAnnouncements,
    date,
    dates,
  };
}
