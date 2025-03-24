export default function useMoving() {
  class MMoving implements TMoving {
    _id?: string;
    typeOfForm: string;
    management: string;
    date: string;
    // Unit Owner's Particulars
    unitBlock: string;
    unitLevel: string;
    unitNumber: string;
    nameOfOwner: string;
    icPassportNumber: string;
    ownerContactNumber: string;
    ownerHP: string;
    ownerOffice: string;
    // Mover's Particulars
    companyName: string;
    office: string;
    hp: string;
    nameOfSupervisor: string;
    iDPassportNumber: string;
    workPermit: string;
    address: string;
    vehicleType: string;
    vehicleRgn: string;
    // Undertakings by Subsidiary Proprietor / Tenant Signatory
    signature: string;
    signedDate: string | Date;
    // For Management Use
    chequeNumber: string;
    approvedBy: string;
    chequeDate: string;
    // Common fields
    site: string;
    siteName: string;
    createdBy: string;
    createdByName: string;
    status?: string;
    reason?: string;
    isAgree: boolean;

    constructor(data: Partial<TMoving> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "";
      this.management = data.management || "";
      this.date = data.date || "";
      // Unit Owner's Particulars
      this.unitBlock = data.unitBlock || "";
      this.unitLevel = data.unitLevel || "";
      this.unitNumber = data.unitNumber || "";
      this.nameOfOwner = data.nameOfOwner || "";
      this.icPassportNumber = data.icPassportNumber || "";
      this.ownerContactNumber = data.ownerContactNumber || "";
      this.ownerHP = data.ownerHP || "";
      this.ownerOffice = data.ownerOffice || "";
      // Mover's Particulars
      this.companyName = data.companyName || "";
      this.office = data.office || "";
      this.hp = data.hp || "";
      this.nameOfSupervisor = data.nameOfSupervisor || "";
      this.iDPassportNumber = data.iDPassportNumber || "";
      this.workPermit = data.workPermit || "";
      this.address = data.address || "";
      this.vehicleType = data.vehicleType || "";
      this.vehicleRgn = data.vehicleRgn || "";
      // Undertakings by Subsidiary Proprietor / Tenant Signatory
      this.signature = data.signature || "";
      this.signedDate = data.signedDate || "";
      // For Management Use
      this.chequeNumber = data.chequeNumber || "";
      this.approvedBy = data.approvedBy || "";
      this.chequeDate = data.chequeDate || "";
      // Common fields
      this.site = data.site || "";
      this.siteName = data.siteName || "";
      this.createdBy = data.createdBy || "";
      this.createdByName = data.createdByName || "";
      this.status = data.status || "";
      this.reason = data.reason || "";
      this.isAgree = data.isAgree || false;
    }
  }

  const apiEndPoint = "/api/miod-records/v1";
  const item = useState("miod-records", () => new MMoving());
  const items = useState("miod-records", (): TMoving[] => []);
  const page = useState("miod-recordsPage", () => 1);
  const pages = useState("miod-recordsPages", () => 1);
  const itemsPerPage = useState("miod-recordsItemsPerPage", () => 10);
  const pageRange = useState("miod-recordsPageRange", () => "-- - -- of --");
  const search = useState("miod-recordsSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("miod-recordsFilterOptions", () => []);
  const isLoading = useState("miod-recordsIsLoading", () => false);
  const isAdding = useState("miod-recordsIsAdding", () => false);
  const isUpdating = useState("miod-recordsIsUpdating", () => false);
  const isDeleting = useState("miod-recordsIsDeleting", () => false);
  const isValid = useState("miod-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TMoving) {
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
  async function updateItem(id: string, payload: TMoving) {
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
    payload: TMovingUpdateSignature,
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
      const response = await useLocalFetchUtil<TMoving | undefined>(
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
      const response = await useLocalFetchUtil<TPaginatedResponse<TMoving>>(
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
  function setItem(payload?: TMoving) {
    item.value = payload || new MMoving();
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
