export default function usePetRecords() {
  class MMoving implements TMoving {
    _id?: string;
    typeOfForm: TTypeOfFOrm;
    management: string; // management name
    date: string | Date; // editable date
    // Unit Owner's Particulars
    unitBlockId: string;
    unitBlockName: string;
    unitLevelId: string;
    unitLevelName: string;
    unitId: string;
    unitName: string;
    nameOfOwner?: string;
    icPassportNumber?: string;
    ownerContactNumber: string;
    ownerHP?: string;
    ownerOffice?: string;
    // Mover's Particulars
    companyName: string;
    office: string;
    hp?: string;
    nameOfSupervisor: string;
    iDPassportNumber?: string;
    workPermit?: string;
    address: string;
    vehicleType: string;
    vehicleRgn: string;
    // Undertakings by Subsidiary Proprietor / Tenant Signatory
    signature?: string;
    signedDate?: string | Date;
    signatoryEmail?: string;
    // For Management Use
    chequeNumber?: string;
    chequeDate?: string | Date;
    // Common fields:
    unitNumber: string;
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

    constructor(data: Partial<TMoving> = {}) {
      this._id = data._id || "";
      this.typeOfForm =
        data.typeOfForm || "Application for Moving In/Out & Delivery";
      this.management = data.management || "";
      this.date = data.date || new Date();
      // Unit Owner's Particulars
      this.unitBlockId = data.unitBlockId || "";
      this.unitBlockName = data.unitBlockName || "";
      this.unitLevelId = data.unitLevelId || "";
      this.unitLevelName = data.unitLevelName || "";
      this.unitId = data.unitId || "";
      this.unitName = data.unitName || "";
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
      this.signatoryEmail = data.signatoryEmail || '';
      // For Management Use
      this.chequeNumber = data.chequeNumber || "";
      this.chequeDate = data.chequeDate || "";
      // Common fields:
      this.isAgree = data.isAgree || false;
      this.unitNumber = data.unitNumber || "";
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

  const apiEndPoint = "/api/miod-records/v1";
  const item = useState("moving-records", () => new MMoving());
  const items = useState("moving-records", (): TMoving[] => []);
  const page = useState("moving-recordsPage", () => 1);
  const pages = useState("moving-recordsPages", () => 1);
  const itemsPerPage = useState("moving-recordsItemsPerPage", () => 10);
  const pageRange = useState("moving-recordsPageRange", () => "-- - -- of --");
  const search = useState("moving-recordsSearch", () => "");
  const filter = useState("moving-recordsFilterSearch", () => "");
  const filterOptions = useState("moving-recordsFilterOptions", () => []);
  const isLoading = useState("moving-recordsIsLoading", () => false);
  const isAdding = useState("moving-recordsIsAdding", () => false);
  const isUpdating = useState("moving-recordsIsUpdating", () => false);
  const isDeleting = useState("moving-recordsIsDeleting", () => false);
  const isValid = useState("moving-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TMoving) {
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
  async function updateItem(id: string, payload: TMoving) {
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
    deleteItem,
    getItemById,
    getPaginatedItems,
    resetPageAndLimit,
  };
}
