export default function useLOUI() {
  class MLOUI implements TLOUI {
    _id?: string;
    typeOfForm: TTypeOfFOrm;
    management: string;
    date: string | Date; // editable date
    unitNumber: string;
    contractor: string;
    contractorOwner: string;
    dateFrom?: string;
    dateTo?: string;
    nameOfSubProp?: string;
    signature?: string;
    signedDate?: string | Date;
    subsidiaryEmail?: string;
    // for stepper
    renovationId?: string;
    refundId?: string;
    // Common fields:
    isAgree: boolean;
    organization?: string;
    site: string;
    siteName: string; // full site name for indexing
    createdBy: string;
    createdByName: string; // use indexing here
    approvedBy?: string;
    approvedName?: string;
    approvedByName?: string; // full name
    attachments?: string[];
    createdAt?: string | Date; // timestamp
    updatedAt?: string | Date;
    status?: string;
    reason?: string;

    constructor(data: Partial<TLOUI> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "Letter of Undertaking & Indemnity";
      this.management = data.management || "";
      this.date = data.date || new Date();
      this.unitNumber = data.unitNumber || "";
      this.contractor = data.contractor || "";
      this.contractorOwner = data.contractorOwner || "";
      this.dateFrom = data.dateFrom || "";
      this.dateTo = data.dateTo || "";
      this.nameOfSubProp = data.nameOfSubProp || "";
      this.signature = data.signature || "";
      this.signedDate = data.signedDate || "";
      this.subsidiaryEmail = data.subsidiaryEmail || '';
      // for stepper
      this.renovationId = data.renovationId || '';
      this.refundId = data.refundId || '';
      // Common fields:
      this.isAgree = data.isAgree || false;
      this.organization = data.organization || "";
      this.site = data.site || "";
      this.siteName = data.siteName || "";
      this.createdBy = data.createdBy || "";
      this.createdByName = data.createdByName || "";
      this.approvedBy = data.approvedBy || "";
      this.approvedByName = data.approvedByName || "";
      this.attachments = data.attachments || [];
      this.status = data.status || "";
      this.reason = data.reason || "";
    }
  }

  const apiEndPoint = "/api/loui-records/v1";
  const item = useState("loui-records", () => new MLOUI());
  const items = useState("loui-records", (): TLOUI[] => []);
  const page = useState("loui-recordsPage", () => 1);
  const pages = useState("loui-recordsPages", () => 1);
  const itemsPerPage = useState("loui-recordsItemsPerPage", () => 10);
  const pageRange = useState("loui-recordsPageRange", () => "-- - -- of --");
  const search = useState("loui-recordsSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("loui-recordsFilterOptions", () => []);
  const isLoading = useState("loui-recordsIsLoading", () => false);
  const isAdding = useState("loui-recordsIsAdding", () => false);
  const isUpdating = useState("loui-recordsIsUpdating", () => false);
  const isDeleting = useState("loui-recordsIsDeleting", () => false);
  const isValid = useState("loui-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TLOUI) {
    const { useLocalFetchUtil, removeEmptyPropertiesUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { currentUser } = useLocalAuth();
    const router = useRouter();
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
      // Route
      router.replace({ name: "online-forms" });
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
      await setItems({
        site: currentUser.value.site,
      });
      isAdding.value = false;
      isValid.value = false;
    }
  }

  // PUT
  async function updateItem(id: string, payload: TLOUI) {
    const { useLocalFetchUtil, removeEmptyPropertiesUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { currentUser } = useLocalAuth();
    const router = useRouter();
    try {
      isUpdating.value = true;
      if (payload._id) delete payload._id;
      const response = await useLocalFetchUtil<TUpdateResponse>(
        `${apiEndPoint}/${id}`,
        "PUT",
        removeEmptyPropertiesUtil(payload),
      );
      // Route
      router.replace({ name: "online-forms" });
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
      const response = await useLocalFetchUtil<TLOUI | undefined>(
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
      const response = await useLocalFetchUtil<TPaginatedResponse<TLOUI>>(
        `${apiEndPoint}/search`,
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
  function setItem(payload?: TLOUI) {
    item.value = payload || new MLOUI();
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
  };
}
