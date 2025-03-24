export default function useBillingUnits() {
  class MBillingUnits implements TBillingUnits {
    _id?: string; // Used for Reference only temporary
    billId?: string;
    unitId?: string;
    unit?: string; // Block / Level / Unit
    unitOwner?: string;
    email?: string; // Prompt user of their invoice via email
    contactNumber?: string;
    category?: string;
    dueDate?: string | Date; // Due date of this unit bill
    startDate?: string | Date; // Start date of billing period
    preDueDateAlert?: string; // Date when the bill was sent (ex. 5 days before the dueDate)
    startPaymentDate?: string | Date; // Days set before the dueDate (preDueDateAlert - dueDate)
    referenceNumber?: string; // ex. INV-IDNo.-Date-0001
    paymentStatus?: string;
    amountPaid?: string | number; // Paid for amount
    balance?: string | number; // If paymentStatus is partial, then there is always a balance
    billStatus?: string; // Active or Inactive
    paidBy?: string; // Management or resident
    billDetails: TBillDetails
    constructor(data: Partial<TBillingUnits> = {}) {
      this._id = data._id || "";
      this.billId = data.billId || "";
      this.unitId = data.unitId || "";
      this.unit = data.unit || "";
      this.unitOwner = data.unitOwner || "";
      this.email = data.email || "";
      this.contactNumber = data.contactNumber || "";
      this.category = data.category || "";
      this.dueDate = data.dueDate || new Date();
      this.startDate = data.startDate || new Date();
      this.preDueDateAlert = data.preDueDateAlert || "";
      this.startPaymentDate = data.startPaymentDate || new Date();
      this.referenceNumber = data.referenceNumber || "";
      this.paymentStatus = data.paymentStatus || "";
      this.amountPaid = data.amountPaid || 0;
      this.balance = data.balance || 0;
      this.billStatus = data.billStatus || "";
      this.paidBy = data.paidBy || "";
      this.billDetails = data.billDetails || {} as TBillDetails;
    }
  }

  const apiEndPoint = "/api/unit-bill/v1";
  const item = useState("unit-bill", () => new MBillingUnits());
  const items = useState("unit-bills", (): TBillingUnits[] => []);
  const page = useState("unit-billPage", () => 1);
  const pages = useState("unit-billPages", () => 1);
  const itemsPerPage = useState("unit-billItemsPerPage", () => 10);
  const pageRange = useState("unit-billPageRange", () => "-- - -- of --");
  const search = useState("unit-billSearch", () => "");
  const filter = useState("billing-ticketSearch", () => "");
  const filterOptions = useState("unit-billFilterOptions", () => []);
  const isLoading = useState("unit-billIsLoading", () => false);
  const isAdding = useState("unit-billIsAdding", () => false);
  const isUpdating = useState("unit-billIsUpdating", () => false);
  const isDeleting = useState("unit-billIsDeleting", () => false);
  const isValid = useState("unit-billIsValid", () => false);
  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TBillingUnits) {
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
  async function updateItem(id: string, payload: TBillingUnits) {
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
      const response = await useLocalFetchUtil<TBillingUnits | undefined>(
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
        TPaginatedResponse<TBillingUnits>
      >(`${apiEndPoint}/unit-bill/search`, "GET", {
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
  function setItem(payload?: TBillingUnits) {
    item.value = payload || new MBillingUnits();
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

  // GET
  async function getUserBillings(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    try {
      isLoading.value = true;
      const response = await useLocalFetchUtil<TBillingUnits | undefined>(
        `${apiEndPoint}/billing?unitId=${id}`,
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
    getUserBillings,
  };
}
