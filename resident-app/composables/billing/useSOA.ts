export default function useLOUI() {
  class MSOA implements TSOA {
    _id?: string;
    unitId?: string;
    unit?: string;
    unitOwner?: string;
    contactNumber?: string;
    duration?: string; // From and To what Date
    billing?: string[]; // unit-bill documents (SOA)
    requester?: string; // if the resident requests a SOA
    type: string; // if resident or management
    email?: string; // for requester sending soa
    status?: string; // if Management is requesting, approved
    site?: string;
    siteName?: string; // full site name for indexing
    organization?: string;
    createdBy?: string;
    createdAt?: string | Date;
    updatedAt?: string | Date;

    constructor(data: Partial<TSOA> = {}) {
      this._id = data._id || "";
      this.unitId = data.unitId || "";
      this.unit = data.unit || "";
      this.unitOwner = data.unitOwner || "";
      this.contactNumber = data.contactNumber || "";
      this.duration = data.duration || "";
      this.billing = data.billing || [];
      this.requester = data.requester || "";
      this.type = data.type || "";
      this.email = data.email || "";
      this.status = data.status || "";
      this.site = data.site || "";
      this.siteName = data.siteName || "";
      this.organization = data.organization || "";
      this.createdBy = data.createdBy || "";
      this.site = data.site || "";
      this.siteName = data.siteName || "";
      this.createdBy = data.createdBy || "";
      this.createdAt = data.createdAt || "";
      this.updatedAt = data.updatedAt || "";
    }
  }

  const apiEndPoint = "/api/summary-of-account/v1";
  const item = useState("summary-of-account", () => new MSOA());
  const items = useState("summary-of-accounts", (): TSOA[] => []);
  const page = useState("summary-of-accountPage", () => 1);
  const pages = useState("summary-of-accountPages", () => 1);
  const itemsPerPage = useState("summary-of-accountItemsPerPage", () => 10);
  const pageRange = useState(
    "summary-of-accountPageRange",
    () => "-- - -- of --",
  );
  const search = useState("summary-of-accountSearch", () => "");
  const filter = useState("billing-ticketSearch", () => "");
  const filterOptions = useState("summary-of-accountFilterOptions", () => []);
  const isLoading = useState("summary-of-accountIsLoading", () => false);
  const isAdding = useState("summary-of-accountIsAdding", () => false);
  const isUpdating = useState("summary-of-accountIsUpdating", () => false);
  const isDeleting = useState("summary-of-accountIsDeleting", () => false);
  const isValid = useState("summary-of-accountIsValid", () => false);
  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TSOA) {
    const { useLocalFetchUtil, removeEmptyPropertiesUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { currentUser } = useLocalAuth();
    try {
      isAdding.value = true;
      const response = await useLocalFetchUtil<TCreateResponse>(
        `${apiEndPoint}`,
        "POST",
        removeEmptyPropertiesUtil(payload),
      );
      if (!response.acknowledged && !response.insertedId) {
        throw new Error("Error happened when adding");
      }
      // Reset
      setItem();
      setSnackbar({ text: "Successfully Added", modal: true });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      // Redisplay if Operation Success
      isAdding.value = false;
      await setItems({
        site: currentUser.value.site,
      });
      isValid.value = false;
    }
  }

  // PUT
  async function updateItem(id: string, payload: TSOA) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { currentUser } = useLocalAuth();
    try {
      isUpdating.value = true;
      const response = await useLocalFetchUtil<TUpdateResponse>(
        `${apiEndPoint}/${id}`,
        "PUT",
        payload,
      );
      // Reset
      setSnackbar({ text: "Successfully Updated", modal: true });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      await setItems({
        site: currentUser.value.site,
      });
      isUpdating.value = false;
      isValid.value = false;
    }
  }

  // DELETE
  async function deleteItem(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { currentUser } = useLocalAuth();
    try {
      isDeleting.value = true;
      const response = await useLocalFetchUtil<TDeleteResponse>(
        `${apiEndPoint}/${id}`,
        "DELETE",
      );
      setSnackbar({ text: "Successfully Deleted", modal: true });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      await setItems({
        site: currentUser.value.site,
      });
      isDeleting.value = false;
    }
  }

  // GET
  async function getItemById(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    try {
      isLoading.value = true;
      const response = await useLocalFetchUtil<TSOA | undefined>(
        `${apiEndPoint}/${id}`,
        "GET",
      );
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  // GET PAGINATED
  async function getPaginatedItems(
    {
      pageParam = 1,
      limitParam = 10,
      searchParam = "",
      startDateParam = "",
      endDateParam = "",
      site,
    } = {} as TSearchFilter,
  ) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    try {
      isLoading.value = true;
      const response = await useLocalFetchUtil<TPaginatedResponse<TSOA>>(
        `${apiEndPoint}/summary-of-account/search`,
        "GET",
        {
          page: pageParam,
          limit: limitParam,
          search: searchParam,
          startDate: startDateParam,
          endDate: endDateParam,
          site,
        },
      );
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  // SETTER

  async function setItems(
    {
      pageParam,
      limitParam,
      searchParam,
      startDateParam,
      endDateParam,
      site,
    } = {} as TSearchFilter,
  ) {
    const response = await getPaginatedItems({
      pageParam: pageParam || page.value,
      limitParam: limitParam || itemsPerPage.value,
      searchParam: searchParam || search.value,
      startDateParam,
      endDateParam,
      site,
    });
    if (response) {
      items.value = response.items;
      pageRange.value = response.pageRange;
      pages.value = response.pages;
    }
  }

  // SETTER
  function setItem(payload?: TSOA) {
    item.value = payload || new MSOA();
  }

  async function nextPage(
    {
      pageParam,
      limitParam,
      searchParam,
      startDateParam,
      endDateParam,
      site,
    } = {} as TSearchFilter,
  ) {
    page.value++;
    setItems({
      pageParam,
      limitParam,
      searchParam,
      startDateParam,
      endDateParam,
      site,
    });
  }

  function prevPage(
    {
      pageParam,
      limitParam,
      searchParam,
      startDateParam,
      endDateParam,
      site,
    } = {} as TSearchFilter,
  ) {
    page.value--;
    setItems({
      pageParam,
      limitParam,
      searchParam,
      startDateParam,
      endDateParam,
      site,
    });
  }

  function resetPageAndLimit() {
    page.value = 1;
    itemsPerPage.value = 10;
  }

  /**
   * COMPLEX BUSINESS LOGIC FROM BE IS HERE:
   * **/

  async function requestSOA(
    id: string,
    dateFrom: string,
    dateTo: string,
    site: string,
    organization: string,
    userId: string,
  ) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    try {
      isLoading.value = true;
      const response = await useLocalFetchUtil<TSOA | undefined>(
        `${apiEndPoint}/unit-soa/?unitId=${id}&dateFrom=${dateFrom}&dateTo=${dateTo}&site=${site}&organization=${organization}&userId=${userId}`,
        "GET",
      );
      setSnackbar({ text: "SOA successfully requested. ", modal: true });
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  // GET PAGINATED with Filter
  async function getStatementOfAccounts(
    { pageParam = 1, limitParam = 10, unitId, status } = {} as TSearchFilter,
  ) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    try {
      isLoading.value = true;
      const response = await useLocalFetchUtil<TPaginatedResponse<TSOA>>(
        `${apiEndPoint}/search?unitId=${unitId}&status=${status}&page=${pageParam}&limit=${limitParam}`,
        "GET",
      );
      return response;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      setSnackbar({
        text: error.message || error,
        modal: true,
        type: "error",
      });
    } finally {
      isLoading.value = false;
    }
  }

  return {
    item,
    items,
    page,
    pages,
    itemsPerPage,
    pageRange,
    isValid,
    isLoading,
    isAdding,
    isUpdating,
    isDeleting,
    filter,
    filterOptions,
    search,
    nextPage,
    prevPage,
    setItem,
    setItems,
    addItem,
    updateItem,
    deleteItem,
    getItemById,
    getPaginatedItems,
    resetPageAndLimit,
    requestSOA,
    getStatementOfAccounts,
  };
}
