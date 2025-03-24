const { useLocalFetchUtil, formatDateAndTime, formatDateToDB } = useUtils();
export default function useOccurrence() {
  class MOccurrence implements TOccurrence {
    _id?: string;
    occurrenceId: string;
    date: string;
    totalInput: number;
    status: string; // open or close
    entryCounter?: number;
    closedAt?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    constructor(
      {
        _id = "",
        occurrenceId = "",
        date = "",
        totalInput = 0,
        status = "open",
        entryCounter,
        createdAt,
        updatedAt,
        closedAt,
      } = {} as TOccurrence
    ) {
      this._id = _id;
      this.occurrenceId = occurrenceId;
      this.date = date;
      this.totalInput = totalInput;
      this.status = status;
      this.entryCounter = entryCounter;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.closedAt = closedAt;
    }
  }

  const occurrenceApiUrl = "/api/occurrences/v1";
  const occurrence = useState("occurrence", () => new MOccurrence());
  const occurrences = useState("occurrences", (): TOccurrence[] => []);
  const search = useState("searchOccurrence", () => "");
  const selectFilter = useState("selectFilterOccurrence", () => "");
  const dateSelected = useState("dateSelectedOccurrence", () => "");
  const page = useState("pageOccurrence", () => 1);
  const pages = useState("pagesOccurrence", () => 1);
  const filterOrganization = useState("filterOrganizationOccurrence", () => "");
  const filterSite = useState("filterSiteOccurrence", () => "");
  const itemsPerPage = useState("itemsPerPageOccurrence", () => 10);
  const pageRange = useState("pageRangeOccurrence", () => "-- - -- of --");
  const isTableLoading = useState("isTableLoadingOccurrence", () => false);

  async function downloadDobPdf(url: string) {
    const res = (await useLocalFetchUtil<Blob | MediaSource>(`${occurrenceApiUrl}/pdf`, "GET", {
      url: url,
      title: "DAILY OCCURRENCE BOOK",
      orientation: "L", // (L|Landscape|P|Portrait)
    }));
    const downloadUrl = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `DOB_DOWNLOADED_${formatDateAndTime(new Date(), true)}.pdf`; // Specify the file name
    document.body.appendChild(a);
    a.click(); // Trigger the download
    window.URL.revokeObjectURL(downloadUrl); // Clean up
  }

  async function getOccurrencesByPageSearch(
    { page = 1, search = "", limit = 10, date, organization, site } = {} as {
      page?: number;
      search?: string;
      limit?: number;
      date?: string;
      organization?: string;
      site?: string;
    }
  ) {
    const data = (await useLocalFetchUtil<TOccurrenceResponse>(occurrenceApiUrl, "GET", {
      page,
      search,
      limit,
      organization,
      site,
      date,
    }));
    return data;
  }

  async function getOccurrencesOpen(
    { organization, site, date } = {} as {
      organization?: string;
      site?: string;
      date?: string;
    }
  ) {
    const data = (await useLocalFetchUtil(`${occurrenceApiUrl}/today`, "GET", {
      organization,
      site,
      date,
    })) as { items: TOccurrence[] } | undefined;
    return data;
  }

  async function getOccurrenceById(id: string) {
    const data = await useLocalFetchUtil<TOccurrence | undefined>(
      `${occurrenceApiUrl}/${id}`,
      "GET"
    );
    return data;
  }

  async function setOccurrence(data?: TOccurrence) {
    occurrence.value = data || new MOccurrence();
  }

  async function setOccurrences(
    { organization, site = "" } = {} as { organization?: string; site?: string }
  ) {
    try {
      isTableLoading.value = true;
      const _occurrences = (await getOccurrencesByPageSearch({
        page: page.value,
        search: search.value || selectFilter.value,
        limit: itemsPerPage.value,
        date: formatDateToDB(dateSelected.value) || "",
        organization: organization,
        site: site,
      }));
      occurrences.value = _occurrences.items;
      pageRange.value = _occurrences.pageRange;
      pages.value = _occurrences.pages;
      isTableLoading.value = false;
    } catch (error) {
      occurrences.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isTableLoading.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  function nextPage({ site = "" } = {} as { site?: string }) {
    page.value++;
    setOccurrences({
      site: site,
    });
  }

  const canPrevPage = computed(() => page.value <= 1);
  function prevPage({ site = "" } = {} as { site?: string }) {
    page.value--;
    setOccurrences({
      site: site,
    });
  }

  return {
    occurrence,
    occurrences,
    search,
    selectFilter,
    page,
    pages,
    itemsPerPage,
    pageRange,
    dateSelected,
    isTableLoading,
    nextPage,
    prevPage,
    canNextPage,
    canPrevPage,
    setOccurrence,
    getOccurrencesOpen,
    getOccurrenceById,
    setOccurrences,
    downloadDobPdf,
    filterOrganization,
    filterSite,
  };
}
