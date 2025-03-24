const { useLocalFetchUtil, formatDateToDB, formatDate } = useUtils();

export default function useOccurrenceEntry() {
  class MOccurrenceEntry implements TOccurrenceEntry {
    _id?: string;
    organization?: string;
    site?: string;
    dailyOccurrenceBookId: string;
    serialNumber: string;
    subject?: string | TLogSubject;
    date: string | Date;
    attachmentReport?: string | IIncident;
    occurrence: string;
    signature?: string | TUser;
    version?: string;
    isCrossOut?: boolean;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    constructor(
      {
        _id = "",
        organization = "",
        site = "",
        dailyOccurrenceBookId,
        serialNumber = "",
        subject,
        date,
        attachmentReport,
        occurrence,
        signature,
        version,
        isCrossOut = false,
        createdAt,
        updatedAt,
      } = {} as TOccurrenceEntry
    ) {
      this._id = _id;
      this.organization = organization;
      this.site = site;
      this.dailyOccurrenceBookId = dailyOccurrenceBookId;
      this.serialNumber = serialNumber;
      this.subject = subject;
      this.date = date;
      this.attachmentReport = attachmentReport;
      this.occurrence = occurrence;
      this.signature = signature;
      this.version = version;
      this.isCrossOut = isCrossOut;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  const occurrenceEntryApiUrl = "/api/occurrence-entries/v1";
  const occurrenceEntry = useState(
    "occurrenceEntry",
    () => new MOccurrenceEntry()
  );
  const occurrencesEntry = useState(
    "occurrencesEntry",
    (): TOccurrenceEntry[] => []
  );
  const searchOccurrencesEntry = useState(
    "searchOccurrencesEntry",
    (): TSearchOccurrenceEntry[] => []
  );
  const search = useState("searchOccurrenceEntry", () => "");
  const searchEntries = useState("searchEntries", () => "");
  const timeSelected = useState("timeSelectedIncident", () => "");
  const selectDateForm = useState(
    "selectDateForm",
    () => formatDate(new Date()) as string | Date
  );
  const dateSelectedForm = useState("dateSelectedForm", () => "");
  const page = useState("page", () => 1);
  const pages = useState("pages", () => 1);
  const itemsPerPage = useState("itemsPerPageOccurrenceEntry", () => 10);
  const isOccurrenceEntryValid = useState(
    "isOccurrenceEntryValid",
    () => false
  );
  const isSigned = useState("isSigned", () => false);
  const signedBy = useState("signedBy", () => "");
  const pageRange = useState("pageRange", () => "-- - -- of --");
  const isTableLoading = useState("isTableLoading", () => false);
  const isBtnLoading = useState("isBtnLoadingOccurrence", () => false);
  const isConfirmModal = useState("isConfirmModal", () => false);
  const isConfirmModalCross = useState("isConfirmModalCross", () => false);
  const isConfirmModalAttach = useState("isConfirmModalAttach", () => false);
  const isFormLoading = useState("isFormLoading", () => false);
  const isIncidentList = useState("isIncidentList", () => false);
  const isShowOccurrenceEntryDialog = useState(
    "isShowOccurrenceEntryDialog",
    () => false
  );
  const attachBy = useState("attachBy", () => "");

  async function getOccurrencesEntryByPageSearch(
    {
      page = 1,
      search = "",
      limit = 50,
      date,
      organization,
      site,
      dailyOccurrenceBookId,
    } = {} as {
      page?: number;
      search?: string;
      limit?: number;
      date?: string;
      organization?: string;
      site?: string;
      dailyOccurrenceBookId?: string;
    }
  ) {
    const data = await useLocalFetchUtil<TOccurrenceEntryResponse>(
      occurrenceEntryApiUrl,
      "GET",
      {
        page,
        search,
        limit,
        date,
        organization,
        site,
        dailyOccurrenceBookId,
      }
    );
    return data;
  }

  async function searchDobEntries(
    { page = 1, search = "", limit = 50, organization, site } = {} as {
      search?: string;
      page?: number;
      limit?: number;
      organization?: string;
      site?: string;
    }
  ) {
    const data = await useLocalFetchUtil<TSearchOccurrenceEntryResponse>(
      `${occurrenceEntryApiUrl}/search-entries`,
      "GET",
      {
        search,
        page,
        limit,
        organization,
        site,
      }
    );
    return data;
  }

  async function addOccurrenceEntry(_occurrencesEntry: MOccurrenceEntry) {
    isBtnLoading.value = true;
    const { error, data } = await useLocalFetch(occurrenceEntryApiUrl, {
      method: "POST",
      body: JSON.stringify(_occurrencesEntry),
    });

    if (error && error.value && error.value.data) {
      isBtnLoading.value = false;
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      isBtnLoading.value = false;
      return Promise.resolve(result.value.message as string);
    }
  }

  async function setOccurrenceEntry(data?: TOccurrenceEntry) {
    occurrenceEntry.value = data || new MOccurrenceEntry();
  }

  async function setOccurrencesEntry(
    { organization, site, dailyOccurrenceBookId, date } = {} as {
      organization?: string;
      site?: string;
      dailyOccurrenceBookId?: string;
      date?: string | Date;
    }
  ) {
    // try {
    isTableLoading.value = true;
    const _occurrencesEntry = await getOccurrencesEntryByPageSearch({
      page: page.value,
      search: search.value,
      limit: itemsPerPage.value,
      date:
        formatDateToDB(date || "") || formatDateToDB(dateSelectedForm.value),
      organization: organization,
      site: site,
      dailyOccurrenceBookId: dailyOccurrenceBookId,
    });
    occurrencesEntry.value = _occurrencesEntry.items;
    // pageRange.value = _occurrencesEntry.pageRange;
    // pages.value = _occurrencesEntry.pages;
    isTableLoading.value = false;
    // } catch (error) {
    //   occurrencesEntry.value = [];
    //   pageRange.value = "-- - -- of --";
    //   pages.value = 0;
    //   isTableLoading.value = false;
    // }
  }

  async function setSearchOccurrencesEntry(
    { organization, site, keywords } = {} as {
      organization?: string;
      site?: string;
      keywords?: string;
    }
  ) {
    isTableLoading.value = true;
    const _occurrencesEntry = await searchDobEntries({
      page: page.value,
      limit: itemsPerPage.value,
      search: keywords || search.value,
      organization: organization,
      site: site,
    });
    searchOccurrencesEntry.value = _occurrencesEntry.items;
    isTableLoading.value = false;
  }

  async function getOccurrenceEntryGeneratedId(
    { dailyOccurrenceBookId, serialNumber, site } = {} as {
      dailyOccurrenceBookId: string;
      serialNumber: string;
      site: string;
    }
  ) {
    const data = await useLocalFetchUtil<string | undefined>(
      `${occurrenceEntryApiUrl}/${dailyOccurrenceBookId}/generate`,
      "GET",
      {
        dailyOccurrenceBookId,
        serialNumber,
        site
      }
    );
    return data;
  }

  async function confirmSign(
    { user, password } = {} as { user: string; password: string }
  ): Promise<{ message: string } | undefined> {
    const { error, data } = await useLocalFetch(`/users/verify-password`, {
      method: "POST",
      body: JSON.stringify({
        id: user,
        password: password,
      }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    if (data.value) {
      return Promise.resolve(data.value as { message: string });
    }
  }

  async function getIncrementedSerialNumber(
    { id, organization, site } = {} as {
      id: string;
      organization?: string;
      site: string;
    }
  ) {
    isFormLoading.value = true;
    const data = await useLocalFetchUtil<string | undefined>(
      `${occurrenceEntryApiUrl}/${id}/serialnumber`,
      "GET",
      {
        dailyOccurrenceBookId: id,
        organization,
        site,
      }
    );
    isFormLoading.value = false;

    return data;
  }

  async function updateAttachIR(
    { id, organization, site, attachmentId } = {} as {
      id: string;
      organization?: string;
      site: string;
      attachmentId: string;
    }
  ): Promise<{ message: string } | undefined> {
    const { error, data } = await useLocalFetch(
      `${occurrenceEntryApiUrl}/${id}/attachment-report`,
      {
        method: "PATCH",
        body: {
          attachmentId: attachmentId,
        },
        query: {
          organization: organization,
          site: site,
        }
      }
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    if (data.value) {
      return Promise.resolve(data.value as { message: string });
    }
  }

  async function updateCrossOut(
    { id, organization, site, isCrossOut } = {} as {
      id: string;
      organization?: string;
      site: string;
      isCrossOut: Boolean;
    }
  ) {
    const query = { organization, site };
    const body = { isCrossOut };
    const data = await useLocalFetchUtil<string | undefined>(
      `${occurrenceEntryApiUrl}/${id}/cross-out`,
      "PATCH",
      query,
      body
    );
    return data;
  }

  const canNextPage = computed(() => pages.value > page.value);
  function nextPage(
    { site, occurrence } = {} as { site?: string; occurrence?: string }
  ) {
    page.value++;
    getOccurrencesEntryByPageSearch({
      page: page.value,
      search: search.value,
      site: site,
      dailyOccurrenceBookId: occurrence,
    });
  }
  const canPrevPage = computed(() => page.value <= 1);
  function prevPage(
    { site, occurrence } = {} as { site?: string; occurrence?: string }
  ) {
    page.value--;
    getOccurrencesEntryByPageSearch({
      page: page.value,
      search: search.value,
      site: site,
      dailyOccurrenceBookId: occurrence,
    });
  }

  return {
    occurrenceEntry,
    occurrencesEntry,
    search,
    isSigned,
    signedBy,
    attachBy,
    page,
    pages,
    itemsPerPage,
    pageRange,
    dateSelectedForm,
    isTableLoading,
    isIncidentList,
    nextPage,
    prevPage,
    isConfirmModal,
    isConfirmModalCross,
    isConfirmModalAttach,
    isFormLoading,
    canNextPage,
    canPrevPage,
    isOccurrenceEntryValid,
    timeSelected,
    selectDateForm,
    isBtnLoading,
    addOccurrenceEntry,
    confirmSign,
    setOccurrenceEntry,
    setOccurrencesEntry,
    getOccurrenceEntryGeneratedId,
    getIncrementedSerialNumber,
    updateCrossOut,
    updateAttachIR,
    setSearchOccurrencesEntry,
    searchOccurrencesEntry,
    isShowOccurrenceEntryDialog,
    searchEntries,
  };
}
