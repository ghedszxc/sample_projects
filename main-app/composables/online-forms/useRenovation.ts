export default function useRenovation() {
  class MRenovation implements TRenovation {
    _id?: string;
    typeOfForm: string; // Pet Records Form
    management: string; // management name
    date: string | Date; // editable date
    // Unit Owner's Particulars
    nameOfOwner: string;
    unitNumber: string;
    ownerContactNumber: string; // Home
    ownerOfficeNumber?: string;
    ownerMobileNumber?: string;
    // Contractor's Particulars
    companyName: string;
    registrationNumber: string;
    contractorAddress: string;
    contractorPersonInCharge: string;
    contractorContactNumber: string;
    contractorOfficeNumber?: string;
    contractorHomePhone?: string;
    // Summary of Proposed Renovation / Addition & Alteration Works (Attach separate sheet if applicable)
    startDate: string | Date;
    endDate: string | Date;
    hackingPeriodFrom: string | Date;
    hackingPeriodTo: string | Date;
    isAgree: boolean;
    // Signatory
    signatureOfSubsidiaryProprietors: string;
    signatureOfSubsidiaryDate: string | Date;
    signatureOfContractor: string;
    signatureOfContractorDate: string | Date;
    // For Management Used (Optional)
    processedBy?: string;
    processedByName?: string;
    workToBeCompletedDate?: string | Date;
    renovationDeposit?: string; // $$$
    address?: string;
    personInCharge?: string;
    officeNumber?: string;
    mobileNumber?: string;
    homePhone?: string;
    chequePayableTo?: string;
    chequeNumber?: string;
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

    constructor(data: Partial<TRenovation> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "Unknown Form";
      this.management = data.management || "";
      this.date = data.date || new Date();
      // Unit Owner's Particulars
      this.nameOfOwner = data.nameOfOwner || "";
      this.unitNumber = data.unitNumber || "";
      this.ownerContactNumber = data.ownerContactNumber || "";
      this.ownerOfficeNumber = data.ownerOfficeNumber || "";
      this.ownerMobileNumber = data.ownerMobileNumber || "";
      // Contractor's Particulars
      this.companyName = data.companyName || "";
      this.registrationNumber = data.registrationNumber || "";
      this.contractorAddress = data.contractorAddress || "";
      this.contractorPersonInCharge = data.contractorPersonInCharge || "";
      this.contractorContactNumber = data.contractorContactNumber || "";
      this.contractorOfficeNumber = data.contractorOfficeNumber || "";
      this.contractorHomePhone = data.contractorHomePhone || "";
      // Summary of Proposed Renovation / Addition & Alteration Works (Attach separate sheet if applicable)
      this.startDate = data.startDate || new Date();
      this.endDate = data.endDate || new Date();
      this.hackingPeriodFrom = data.hackingPeriodFrom || new Date();
      this.hackingPeriodTo = data.hackingPeriodTo || new Date();
      this.isAgree = data.isAgree || false;
      // Signatory
      this.signatureOfSubsidiaryProprietors =
        data.signatureOfSubsidiaryProprietors || "";
      this.signatureOfSubsidiaryDate =
        data.signatureOfSubsidiaryDate || new Date();
      this.signatureOfContractor = data.signatureOfContractor || "";
      this.signatureOfContractorDate =
        data.signatureOfContractorDate || new Date();
      // For Management Used
      this.processedBy = data.processedBy || "";
      this.processedByName = data.processedByName || "";
      this.workToBeCompletedDate = data.workToBeCompletedDate || new Date();
      this.renovationDeposit = data.renovationDeposit || "";
      this.address = data.address || "";
      this.personInCharge = data.personInCharge || "";
      this.officeNumber = data.officeNumber || "";
      this.mobileNumber = data.mobileNumber || "";
      this.homePhone = data.homePhone || "";
      this.chequePayableTo = data.chequePayableTo || "";
      this.chequeNumber = data.chequeNumber || "";
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

  const apiEndPoint = "/api/renovation/v1";
  const item = useState("renovation", () => new MRenovation());
  const items = useState("renovation", (): TRenovation[] => []);
  const page = useState("renovationPage", () => 1);
  const pages = useState("renovationPages", () => 1);
  const itemsPerPage = useState("renovationItemsPerPage", () => 10);
  const pageRange = useState("renovationPageRange", () => "-- - -- of --");
  const search = useState("renovationSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("renovationFilterOptions", () => []);
  const isLoading = useState("renovationIsLoading", () => false);
  const isAdding = useState("renovationIsAdding", () => false);
  const isUpdating = useState("renovationIsUpdating", () => false);
  const isDeleting = useState("renovationIsDeleting", () => false);
  const isValid = useState("renovationIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TRenovation) {
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
  async function updateItem(id: string, payload: TRenovation) {
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
    payload: TRenovationUpdateSignature,
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
      const response = await useLocalFetchUtil<TRenovation | undefined>(
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
      const response = await useLocalFetchUtil<TPaginatedResponse<TRenovation>>(
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
  function setItem(payload?: TRenovation) {
    item.value = payload || new MRenovation();
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
