export default function useElectronicAccessCard() {
  class MElectronicAccessCard implements TElectronicAccessCard {
    _id: string;
    typeOfForm: string;
    management: string;
    date: string;
    // Unit Owner's Particulars
    nameOfOwner: string;
    unitNumber: string;
    accessCardNumber: string;
    ownerNricNumber: string;
    ownerHomePhone: string;
    ownerR: string;
    // Nominator's Particular
    nominatorName?: string;
    nominatorUnitNumber?: string;
    // Nominee's Particulars (IF Applicable)
    tenantResidentType: string;
    tenantAccessCardNumber: string;
    nameOfTenant: string;
    tenancyCommencement: string;
    tenancyExpiry: string;
    tenantICPassportNumber: string;
    tenantContactNumber: string;
    tenantHp: string;
    tenantR: string;
    // Signature of Applicant
    signature: string;
    signedDate: string | Date;
    isAgree: boolean;
    // For Management Use
    applicationFee: string;
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

    constructor(data: Partial<TElectronicAccessCard> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "";
      this.management = data.management || "";
      this.date = data.date || "";
      // Unit Owner's Particulars
      this.nameOfOwner = data.nameOfOwner || "";
      this.unitNumber = data.unitNumber || "";
      this.accessCardNumber = data.accessCardNumber || "";
      this.ownerNricNumber = data.ownerNricNumber || "";
      this.ownerHomePhone = data.ownerHomePhone || "";
      this.ownerR = data.ownerR || "";
      // Nominator's Particular
      this.nominatorName = data.nominatorName || "";
      this.nominatorUnitNumber = data.nominatorUnitNumber || "";
      // Nominee's Particulars (IF Applicable)
      this.tenantResidentType = data.tenantResidentType || "";
      this.tenantAccessCardNumber = data.tenantAccessCardNumber || "";
      this.nameOfTenant = data.nameOfTenant || "";
      this.tenancyCommencement = data.tenancyCommencement || "";
      // Common fields:
      this.tenancyExpiry = data.tenancyExpiry || "";
      this.tenantICPassportNumber = data.tenantICPassportNumber || "";
      this.tenantContactNumber = data.tenantContactNumber || "";
      this.tenantHp = data.tenantHp || "";
      this.tenantR = data.tenantR || "";
      // Signature of Applicant
      this.signature = data.signature || "";
      this.signedDate = data.signedDate || "";
      this.isAgree = data.isAgree || false;
      // For Management Use
      this.applicationFee = data.applicationFee || "";
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
    }
  }

  const apiEndPoint = "/api/eac-records/v1";
  const item = useState("eac-records", () => new MElectronicAccessCard());
  const items = useState("eac-records", (): TElectronicAccessCard[] => []);
  const page = useState("eac-recordsPage", () => 1);
  const pages = useState("eac-recordsPages", () => 1);
  const itemsPerPage = useState("eac-recordsItemsPerPage", () => 10);
  const pageRange = useState("eac-recordsPageRange", () => "-- - -- of --");
  const search = useState("eac-recordsSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("eac-recordsFilterOptions", () => []);
  const isLoading = useState("eac-recordsIsLoading", () => false);
  const isAdding = useState("eac-recordsIsAdding", () => false);
  const isUpdating = useState("eac-recordsIsUpdating", () => false);
  const isDeleting = useState("eac-recordsIsDeleting", () => false);
  const isValid = useState("eac-recordsIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TElectronicAccessCard) {
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
  async function updateItem(id: string, payload: TElectronicAccessCard) {
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
    payload: TElectronicAccessCardUpdateSignature,
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
      const response = await useLocalFetchUtil<
        TElectronicAccessCard | undefined
      >(`${apiEndPoint}/${id}`, "GET");
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
        TPaginatedResponse<TElectronicAccessCard>
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
  function setItem(payload?: TElectronicAccessCard) {
    item.value = payload || new MElectronicAccessCard();
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
