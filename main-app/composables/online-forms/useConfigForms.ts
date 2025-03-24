export default function useConfigForms() {
  class MConfigForms implements TConfigForms {
    _id: string;
    typeOfForm?: string; // Bicycle Parking Records Form
    isActivate?: boolean; // management name
    isShowFirstSignature?: boolean;
    isShowSecondSignature?: boolean;
    isShowThirdSignature?: boolean;
    isAgreeLabel?: string; // management name
    // Common fields:
    site: string;
    createdAt?: string | Date; // timestamp
    updatedAt?: string | Date;

    constructor(data: Partial<TConfigForms> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "";
      this.isActivate = data.isActivate || false;
      this.isShowFirstSignature = data.isShowFirstSignature || false;
      this.isShowSecondSignature = data.isShowSecondSignature || false;
      this.isShowThirdSignature = data.isShowThirdSignature || false;
      this.isAgreeLabel = data.isAgreeLabel || "";
      // Common fields:
      this.site = data.site || "";
    }
  }

  const apiEndPoint = "/api/config-forms/v1";
  const item = useState("config-form", () => new MConfigForms());
  const items = useState("config-forms", (): TConfigForms[] => []);
  const page = useState("config-formsPage", () => 1);
  const pages = useState("config-formsPages", () => 1);
  const itemsPerPage = useState("config-formsItemsPerPage", () => 10);
  const pageRange = useState("config-formsPageRange", () => "-- - -- of --");
  const search = useState("config-formsSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("config-formsFilterOptions", () => []);
  const isLoading = useState("config-formsIsLoading", () => false);
  const isAdding = useState("config-formsIsAdding", () => false);
  const isUpdating = useState("config-formsIsUpdating", () => false);
  const isDeleting = useState("config-formsIsDeleting", () => false);
  const isValid = useState("config-formsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TConfigForms) {
    const { useLocalFetchUtil, removeEmptyPropertiesUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
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
      await setItems({
        site: mySite.value,
      });
      isAdding.value = false;
      isValid.value = false;
    }
  }

  // PUT
  async function updateItem(id: string, payload: TConfigForms) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
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
        site: mySite.value,
      });
      isUpdating.value = false;
      isValid.value = false;
    }
  }

  // DELETE
  async function deleteItem(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
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
        site: mySite.value,
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
      const response = await useLocalFetchUtil<TConfigForms | undefined>(
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
      const response = await useLocalFetchUtil<
        TPaginatedResponse<TConfigForms>
      >(`${apiEndPoint}/search`, "GET", {
        page: pageParam,
        limit: limitParam,
        search: searchParam,
        startDate: startDateParam,
        endDate: endDateParam,
        site,
      });
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
  function setItem(payload?: TConfigForms) {
    item.value = payload || new MConfigForms();
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
