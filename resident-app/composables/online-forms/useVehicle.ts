export default function useVehicleRecord() {
  class MVehicleRecord implements TVehicleRecord {
    _id?: string;
    typeOfForm: TTypeOfFOrm;
    management: string; // management name
    date: string | Date; // editable date
    // Unit Owner's Particulars
    unitOwner: string;
    ownerNRIC: string;
    ownerContactNumber: string;
    unitNumber: string;
    // Vehicle Information
    carOwner?: string;
    carPlateNumber?: string;
    make?: string;
    model?: string;
    colour?: string;
    //Acknowledgement of Application (Organization)
    recipientSignature?: string;
    recipientSignedDate?: string | Date;
    recipientEmail?: string;
    approvedDate?: string | Date;
    // Agreement
    isAgreeToAbideRules: boolean;
    isAgreeToUnderstandVehicleRisk: boolean;
    isAgreeToParkProperly: boolean;
    isAgreeToBallotingCar: boolean;
    isAgreeToSubsCarApplication: boolean;
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

    constructor(data: Partial<TVehicleRecord> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "Vehicle Registration Form";
      this.management = data.management || "";
      this.date = data.date || new Date();
      // Unit Owner's Particulars
      this.unitOwner = data.unitOwner || "";
      this.ownerNRIC = data.ownerNRIC || "";
      this.ownerContactNumber = data.ownerContactNumber || "";
      this.unitNumber = data.unitNumber || "";
      // Vehicle Information
      this.carOwner = data.carOwner || "";
      this.carPlateNumber = data.carPlateNumber || "";
      this.make = data.make || "";
      this.model = data.model || "";
      this.colour = data.colour || "";
      //Acknowledgement of Application (Organization)
      this.recipientSignature = data.recipientSignature || "";
      this.recipientSignedDate = data.recipientSignedDate || "";
      this.recipientEmail = data.recipientEmail || "";
      this.approvedDate = data.approvedDate || "";
      // Agreement
      this.isAgreeToAbideRules = data.isAgreeToAbideRules || false;
      this.isAgreeToUnderstandVehicleRisk =
        data.isAgreeToUnderstandVehicleRisk || false;
      this.isAgreeToParkProperly = data.isAgreeToParkProperly || false;
      this.isAgreeToBallotingCar = data.isAgreeToBallotingCar || false;
      this.isAgreeToSubsCarApplication =
        data.isAgreeToSubsCarApplication || false;
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

  const apiEndPoint = "/api/vehicle-registration/v1";
  const item = useState("vehicle-record", () => new MVehicleRecord());
  const items = useState("vehicle-record", (): TVehicleRecord[] => []);
  const page = useState("vehicle-recordPage", () => 1);
  const pages = useState("vehicle-recordPages", () => 1);
  const itemsPerPage = useState("vehicle-recordItemsPerPage", () => 10);
  const pageRange = useState("vehicle-recordPageRange", () => "-- - -- of --");
  const search = useState("vehicle-recordSearch", () => "");
  const filter = useState("vehicle-recordFilterSearch", () => "");
  const filterOptions = useState("vehicle-recordFilterOptions", () => []);
  const isLoading = useState("vehicle-recordIsLoading", () => false);
  const isAdding = useState("vehicle-recordIsAdding", () => false);
  const isUpdating = useState("vehicle-recordIsUpdating", () => false);
  const isDeleting = useState("vehicle-recordIsDeleting", () => false);
  const isValid = useState("vehicle-recordIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST
  async function addItem(payload: TVehicleRecord) {
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
  async function updateItem(id: string, payload: TVehicleRecord) {
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
      const response = await useLocalFetchUtil<TVehicleRecord | undefined>(
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
        TPaginatedResponse<TVehicleRecord>
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
  function setItem(payload?: TVehicleRecord) {
    item.value = payload || new MVehicleRecord();
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
