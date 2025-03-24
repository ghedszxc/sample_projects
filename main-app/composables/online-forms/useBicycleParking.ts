export default function useBicycleParking() {
  class MBicycleParking implements TBicycleParking {
    _id: string;
    typeOfForm: string;
    management: string;
    date: string;
    // Unit Owner's Particulars
    unitOwner: string;
    unitNumber: string;
    ownerContactNumber: string;
    ownerHome: string;
    ownerHP: string;
    // Reason for Application
    reasonForApplication: string;
    // Agreement
    isAgreeToAboveCondition: boolean;
    isAgreeToLeaseMoveOut: boolean;
    isAgree: boolean;
    // Signature of Applicant
    ownerSignature: string;
    ownerSignedDate: string | Date;
    ownerEmail: string;
    //Acknowledgement of Application (Organization)
    recipient: string; //Acknowledge By Who
    recipientSignature: string;
    recipientSignedDate: string | Date;
    recipientEmail: string;
    // For Management Use
    tagNumber: string;
    approvedBy: string;
    approvedDate: string;
    // Common fields
    site: string;
    siteName: string;
    createdBy: string;
    createdByName: string;
    status?: string;
    reason?: string;

    constructor(data: Partial<TBicycleParking> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "";
      this.management = data.management || "";
      this.date = data.date || "";
      // Unit Owner's Particulars
      this.unitOwner = data.unitOwner || "";
      this.unitNumber = data.unitNumber || "";
      this.ownerContactNumber = data.ownerContactNumber || "";
      this.ownerHome = data.ownerHome || "";
      this.ownerHP = data.ownerHP || "";
      // Reason for Application
      this.reasonForApplication = data.reasonForApplication || "";
      // Agreement
      this.isAgreeToAboveCondition = data.isAgreeToAboveCondition || false;
      this.isAgreeToLeaseMoveOut = data.isAgreeToLeaseMoveOut || false;
      this.isAgree = data.isAgree || false;
      // Signature of Applicant
      this.ownerSignature = data.ownerSignature || "";
      this.ownerSignedDate = data.ownerSignedDate || "";
      this.ownerEmail = data.ownerEmail || "";
      //Acknowledgement of Application (Organization)
      this.recipient = data.recipient || "";
      this.recipientSignature = data.recipientSignature || "";
      this.recipientSignedDate = data.recipientSignedDate || "";
      this.recipientEmail = data.recipientEmail || "";
      // For Management Use
      this.tagNumber = data.tagNumber || "";
      this.approvedBy = data.approvedBy || "";
      this.approvedDate = data.approvedDate || "";
      // Common fields
      this.site = data.site || "";
      this.siteName = data.siteName || "";
      this.createdBy = data.createdBy || "";
      this.createdByName = data.createdByName || "";
      this.status = data.status || "";
      this.reason = data.reason || "";
    }
  }

  const apiEndPoint = "/api/bike-parking-records/v1";
  const item = useState("bike-parking-records", () => new MBicycleParking());
  const items = useState("bike-parking-records", (): TBicycleParking[] => []);
  const page = useState("bike-parking-recordsPage", () => 1);
  const pages = useState("bike-parking-recordsPages", () => 1);
  const itemsPerPage = useState("bike-parking-recordsItemsPerPage", () => 10);
  const pageRange = useState(
    "bike-parking-recordsPageRange",
    () => "-- - -- of --",
  );
  const search = useState("bike-parking-recordsSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("bike-parking-recordsFilterOptions", () => []);
  const isLoading = useState("bike-parking-recordsIsLoading", () => false);
  const isAdding = useState("bike-parking-recordsIsAdding", () => false);
  const isUpdating = useState("bike-parking-recordsIsUpdating", () => false);
  const isDeleting = useState("bike-parking-recordsIsDeleting", () => false);
  const isValid = useState("bike-parking-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TBicycleParking) {
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
  async function updateItem(id: string, payload: TBicycleParking) {
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

  async function updateItemSignature(
    id: string,
    payload: TBicycleParkingSignatureUpdate,
  ) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
    try {
      isUpdating.value = true;
      const response = await useLocalFetchUtil<TUpdateResponse>(
        `${apiEndPoint}/${id}/signatory`,
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
      const response = await useLocalFetchUtil<TBicycleParking | undefined>(
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
        TPaginatedResponse<TBicycleParking>
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
  function setItem(payload?: TBicycleParking) {
    item.value = payload || new MBicycleParking();
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
    updateItemSignature,
    deleteItem,
    getItemById,
    getPaginatedItems,
    resetPageAndLimit,
  };
}
