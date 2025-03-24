export default function useRenovation() {
  class MRenovation implements TRenovation {
    _id?: string;
    typeOfForm: TTypeOfFOrm; // Pet Records Form
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
    // Signatory
    signatureOfSubsidiaryProprietors?: string;
    signatureOfSubsidiaryDate?: string | Date;
    subsidiaryProprietorsEmail?: string;
    signatureOfContractor?: string;
    signatureOfContractorDate?: string | Date;
    contractorEmail?: string;
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
    // for stepper
    louiId?: string;
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

    constructor(data: Partial<TRenovation> = {}) {
      this._id = data._id || "";
      this.typeOfForm =
        data.typeOfForm ||
        "Application for Renovation/Addition & Alteration Works";
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
      this.startDate = data.startDate || "";
      this.endDate = data.endDate || "";
      this.hackingPeriodFrom = data.hackingPeriodFrom || "";
      this.hackingPeriodTo = data.hackingPeriodTo || "";
      // Signatory
      this.signatureOfSubsidiaryProprietors =
        data.signatureOfSubsidiaryProprietors || "";
      this.signatureOfSubsidiaryDate = data.signatureOfSubsidiaryDate || "";
      this.subsidiaryProprietorsEmail = data.subsidiaryProprietorsEmail || "";
      this.signatureOfContractor = data.signatureOfContractor || "";
      this.signatureOfContractorDate = data.signatureOfContractorDate || "";
      this.contractorEmail = data.contractorEmail || "";
      // For Management Used
      this.processedBy = data.processedBy || "";
      this.processedByName = data.processedByName || "";
      this.workToBeCompletedDate = data.workToBeCompletedDate;
      this.renovationDeposit = data.renovationDeposit || "";
      this.address = data.address || "";
      this.personInCharge = data.personInCharge || "";
      this.officeNumber = data.officeNumber || "";
      this.mobileNumber = data.mobileNumber || "";
      this.homePhone = data.homePhone || "";
      this.chequePayableTo = data.chequePayableTo || "";
      this.chequeNumber = data.chequeNumber || "";
      // for stepper
      this.louiId = data.louiId || '';
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
  async function updateItem(id: string, payload: TRenovation) {
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
    deleteItem,
    getItemById,
    getPaginatedItems,
    resetPageAndLimit,
  };
}
