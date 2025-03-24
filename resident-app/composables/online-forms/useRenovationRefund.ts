export default function useRenovationRefund() {
  class MRenovationRefund implements TRenovationRefund {
    _id?: string;
    typeOfForm: TTypeOfFOrm;
    // Dear...
    unitNumber: string;
    dateOfCompletion: string | Date; // Date of completion of Renovation / A & A works
    dateOfJointInspection: string | Date;
    remarks: string;
    // Submitted By
    submittedByApplicant?: string; // Name of Applicant Name of MA Staff (Subsidiary Proprietor)
    signedByApplicant?: string; // Signature of Applicant Name of MA Staff (Subsidiary Proprietor)
    applicantEmail?: string;
    dateOfRefund: string | Date;
    // Certified By
    certifiedByStaff: string; // Name of MA Staff
    signedByStaff: string; // Signature of MA Staff
    chequeNumber: string;
    // Received By
    receivedBy?: string;
    signedByReceiver?: string;
    receiverEmail?: string;
    signatureDate?: string | Date;
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
    renovationId?: string;
    louiId?: string;

    constructor(data: Partial<TRenovationRefund> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "Refund of Deposit";
      // Dear...
      this.unitNumber = data.unitNumber || "";
      this.dateOfCompletion = data.dateOfCompletion || new Date();
      this.dateOfJointInspection = data.dateOfJointInspection || new Date();
      this.remarks = data.remarks || "";
      // Submitted By
      this.submittedByApplicant = data.submittedByApplicant || "";
      this.signedByApplicant = data.signedByApplicant || "";
      this.applicantEmail = data.applicantEmail || "";
      this.dateOfRefund = data.dateOfRefund || new Date();
      // Certified By
      this.certifiedByStaff = data.certifiedByStaff || "";
      this.signedByStaff = data.signedByStaff || "";
      this.chequeNumber = data.chequeNumber || "";
      // Received By
      this.receivedBy = data.receivedBy || "";
      this.signedByReceiver = data.signedByReceiver || "";
      this.receiverEmail = data.receiverEmail || "";
      this.signatureDate = data.signatureDate || "";
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
      this.renovationId = data.renovationId || "";
      this.louiId = data.louiId || "";
    }
  }

  const apiEndPoint = "/api/renovation-refund/v1";
  const item = useState("renovation-refund", () => new MRenovationRefund());
  const items = useState("renovation-refund", (): TRenovationRefund[] => []);
  const page = useState("renovation-refundPage", () => 1);
  const pages = useState("renovation-refundPages", () => 1);
  const itemsPerPage = useState("renovation-refundItemsPerPage", () => 10);
  const pageRange = useState(
    "renovation-refundPageRange",
    () => "-- - -- of --",
  );
  const search = useState("renovation-refundSearch", () => "");
  const filter = useState("renovation-refundTicketSearch", () => "");
  const filterOptions = useState("renovation-refundFilterOptions", () => []);
  const isLoading = useState("renovation-refundIsLoading", () => false);
  const isAdding = useState("renovation-refundIsAdding", () => false);
  const isUpdating = useState("renovation-refundIsUpdating", () => false);
  const isDeleting = useState("renovation-refundIsDeleting", () => false);
  const isValid = useState("renovation-refundIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TRenovationRefund) {
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
  async function updateItem(id: string, payload: TRenovationRefund) {
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
      const response = await useLocalFetchUtil<TRenovationRefund | undefined>(
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
        TPaginatedResponse<TRenovationRefund>
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
  function setItem(payload?: TRenovationRefund) {
    item.value = payload || new MRenovationRefund();
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
