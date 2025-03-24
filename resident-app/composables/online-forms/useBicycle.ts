export default function useBicycleRecord() {
  class MBicycleRecord implements TBicycleRecord {
    _id?: string;
    typeOfForm: TTypeOfFOrm;
    management: string; // management name
    date: string | Date; // editable date
    // Unit Owner's Particulars
    unitOwner: string;
    unitNumber: string;
    ownerContactNumber: string;
    ownerHP: string;
    // Reason for Application
    reasonForApplication: string;
    // Signature of Applicant
    ownerSignature: string;
    ownerSignedDate: string | Date;
    ownerEmail: string;
    //Acknowledgement of Application (Organization)
    recipient: string;
    recipientSignature: string;
    recipientSignedDate: string | Date;
    recipientEmail: string;
    // For Management Use
    tagNumber?: string;
    approvedDate?: string | Date;
    // Agreement
    isAgreeToAboveCondition: boolean;
    isAgreeToLeaseMoveOut: boolean;
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

    constructor(data: Partial<TBicycleRecord> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "Application for Bicycle Parking";
      this.management = data.management || "";
      this.date = data.date || new Date();
      // Unit Owner's Particulars
      this.unitOwner = data.unitOwner || "";
      this.unitNumber = data.unitNumber || "";
      this.ownerContactNumber = data.ownerContactNumber || "";
      this.ownerHP = data.ownerHP || "";
      // Reason for Application
      this.reasonForApplication = data.reasonForApplication || "";
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
      this.approvedByName = data.approvedByName || "";
      this.approvedDate = data.approvedDate || "";
      // Agreement
      this.isAgreeToAboveCondition = data.isAgreeToAboveCondition || false;
      this.isAgreeToLeaseMoveOut = data.isAgreeToLeaseMoveOut || false;
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

  const apiEndPoint = "/api/bike-parking-records/v1";
  const item = useState("bicycle-records", () => new MBicycleRecord());
  const items = useState("bicycle-records", (): TBicycleRecord[] => []);
  const page = useState("bicycle-recordsPage", () => 1);
  const pages = useState("bicycle-recordsPages", () => 1);
  const itemsPerPage = useState("bicycle-recordsItemsPerPage", () => 10);
  const pageRange = useState("bicycle-recordsPageRange", () => "-- - -- of --");
  const search = useState("bicycle-recordsSearch", () => "");
  const filter = useState("bicycle-recordsFilterSearch", () => "");
  const filterOptions = useState("bicycle-recordsFilterOptions", () => []);
  const isLoading = useState("bicycle-recordsIsLoading", () => false);
  const isAdding = useState("bicycle-recordsIsAdding", () => false);
  const isUpdating = useState("bicycle-recordsIsUpdating", () => false);
  const isDeleting = useState("bicycle-recordsIsDeleting", () => false);
  const isValid = useState("bicycle-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TBicycleRecord) {
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
  async function updateItem(id: string, payload: TBicycleRecord) {
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
      const response = await useLocalFetchUtil<TBicycleRecord | undefined>(
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
        TPaginatedResponse<TBicycleRecord>
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
  function setItem(payload?: TBicycleRecord) {
    item.value = payload || new MBicycleRecord();
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
