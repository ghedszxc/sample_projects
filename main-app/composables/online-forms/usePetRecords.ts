export default function usePetRecords() {
  class MPetRecords implements TPetRecords {
    _id?: string;
    typeOfForm: string; // Pet Records Form
    management: string; // management name
    date: string | Date; // editable date
    // Details of Pet:
    nameOfPet: string;
    typeOfPet: string;
    breed?: string;
    licenseNumber?: string;
    // Owner's Particulars:
    nameOfOwner: string;
    unitId: string;
    unitNumber: string; // full unit name for indexing example: 28 / 30 / 02
    residentType?: string;
    contactNumber: string;
    email: string;
    correspondenceAddress: string;
    signature: string;
    signedDate: string | Date;
    isAgree: boolean;
    // Common fields:
    organization?: string;
    site: string;
    siteName: string; // full site name for indexing
    createdBy: string;
    createdByName: string; // use indexing here
    approvedBy?: string;
    approvedByName?: string; // full name
    attachments?: string[];
    createdAt?: string | Date; // timestamp
    updatedAt?: string | Date;
    status?: string;
    reason?: string;

    constructor(data: Partial<TPetRecords> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "Unknown Form";
      this.management = data.management || "";
      this.date = data.date || new Date();
      // Details of Pet:
      this.nameOfPet = data.nameOfPet || "";
      this.typeOfPet = data.typeOfPet || "";
      this.breed = data.breed || "";
      this.licenseNumber = data.licenseNumber || "";
      // Owner's Particulars:
      this.nameOfOwner = data.nameOfOwner || "";
      this.unitId = data.unitId || "";
      this.unitNumber = data.unitNumber || "";
      this.residentType = data.residentType || "";
      this.contactNumber = data.contactNumber || "";
      this.email = data.email || "";
      this.correspondenceAddress = data.correspondenceAddress || "";
      this.signature = data.signature || "";
      this.signedDate = data.signedDate || "";
      this.isAgree = data.isAgree || false;
      // Common fields:
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

  const apiEndPoint = "/api/pet-records/v1";
  const item = useState("pet-record", () => new MPetRecords());
  const items = useState("pet-records", (): TPetRecords[] => []);
  const page = useState("pet-recordsPage", () => 1);
  const pages = useState("pet-recordsPages", () => 1);
  const itemsPerPage = useState("pet-recordsItemsPerPage", () => 10);
  const pageRange = useState("pet-recordsPageRange", () => "-- - -- of --");
  const search = useState("pet-recordsSearch", () => "");
  const filter = useState("pet-ticketSearch", () => "");
  const filterOptions = useState("pet-recordsFilterOptions", () => []);
  const isLoading = useState("pet-recordsIsLoading", () => false);
  const isAdding = useState("pet-recordsIsAdding", () => false);
  const isUpdating = useState("pet-recordsIsUpdating", () => false);
  const isDeleting = useState("pet-recordsIsDeleting", () => false);
  const isValid = useState("pet-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TPetRecords) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
    try {
      isAdding.value = true;
      const response = await useLocalFetchUtil<TCreateResponse>(
        `${apiEndPoint}`,
        "POST",
        payload,
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
  async function updateItem(id: string, payload: TPetRecords) {
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

  // PUT
  async function updateItemSignature(
    id: string,
    payload: TPetRecordsUpdateSignature,
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
      await setItems({
        site: mySite.value,
      });
      isUpdating.value = false;
      isValid.value = false;
    }
  }

  // PUT
  async function updateStatus(id: string, payload: TUpdatePetRecordStatus) {
    const { useLocalFetchUtil, removeEmptyPropertiesUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
    try {
      isUpdating.value = true;
      const response = await useLocalFetchUtil<TUpdateResponse>(
        `${apiEndPoint}/${id}/status`,
        "PUT",
        removeEmptyPropertiesUtil(payload),
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
      const response = await useLocalFetchUtil<TPetRecords | undefined>(
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
      const response = await useLocalFetchUtil<TPaginatedResponse<TPetRecords>>(
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
  function setItem(payload?: TPetRecords) {
    item.value = payload || new MPetRecords();
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
    updateStatus,
    deleteItem,
    getItemById,
    getPaginatedItems,
    resetPageAndLimit,
  };
}
