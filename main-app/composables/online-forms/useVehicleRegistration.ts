export default function useVehicleRegistration() {
  class MVehicleRegistration implements TVehicleRegistration {
    _id?: string;
    typeOfForm: string;
    management: string;
    date: string;
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
    // Agreement
    isAgreeToAbideRules: boolean;
    isAgreeToUnderstandVehicleRisk: boolean;
    isAgreeToParkProperly: boolean;
    isAgreeToBallotingCar: boolean;
    isAgreeToSubsCarApplication: boolean;
    //Acknowledgement of Application (Organization)
    recipientSignature: string;
    recipientSignedDate: string;
    // Common fields:
    site: string;
    siteName: string;
    attachments?: string[];
    createdBy: string;
    createdByName: string;
    status?: string;
    reason?: string;

    constructor(data: Partial<TVehicleRegistration> = {}) {
      this._id = data._id || "";
      this.typeOfForm = data.typeOfForm || "";
      this.management = data.management || "";
      this.date = data.date || "";
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
      // Agreement
      this.isAgreeToAbideRules = data.isAgreeToAbideRules || false;
      this.isAgreeToUnderstandVehicleRisk =
        data.isAgreeToUnderstandVehicleRisk || false;
      this.isAgreeToParkProperly = data.isAgreeToParkProperly || false;
      this.isAgreeToBallotingCar = data.isAgreeToBallotingCar || false;
      this.isAgreeToSubsCarApplication =
        data.isAgreeToSubsCarApplication || false;
      //Acknowledgement of Application (Organization)
      this.recipientSignature = data.recipientSignature || "";
      this.recipientSignedDate = data.recipientSignedDate || "";

      // Common fields
      this.site = data.site || "";
      this.siteName = data.siteName || "";
      this.attachments = data.attachments || [];
      this.createdBy = data.createdBy || "";
      this.createdByName = data.createdByName || "";
      this.status = data.status || "";
      this.reason = data.reason || "";
    }
  }

  const apiEndPoint = "/api/vehicle-registration/v1";
  const item = useState(
    "vehicle-registration",
    () => new MVehicleRegistration(),
  );
  const items = useState(
    "vehicle-registration",
    (): TVehicleRegistration[] => [],
  );
  const page = useState("vehicle-registrationPage", () => 1);
  const pages = useState("vehicle-registrationPages", () => 1);
  const itemsPerPage = useState("vehicle-registrationItemsPerPage", () => 10);
  const pageRange = useState(
    "vehicle-registrationPageRange",
    () => "-- - -- of --",
  );
  const search = useState("vehicle-registrationSearch", () => "");
  const filter = useState("ticketSearch", () => "");
  const filterOptions = useState("vehicle-registrationFilterOptions", () => []);
  const isLoading = useState("vehicle-registrationIsLoading", () => false);
  const isAdding = useState("vehicle-registrationIsAdding", () => false);
  const isUpdating = useState("vehicle-registrationIsUpdating", () => false);
  const isDeleting = useState("vehicle-registrationIsDeleting", () => false);
  const isValid = useState("vehicle-registrationIsValid", () => false);

  /**
   * CRUD OPERATIONS FROM BE:
   * **/

  // POST

  async function addItem(payload: TVehicleRegistration) {
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
  async function updateItem(id: string, payload: TVehicleRegistration) {
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
    payload: TVehicleRecordsUpdateSignature,
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
        TVehicleRegistration | undefined
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
        TPaginatedResponse<TVehicleRegistration>
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
  function setItem(payload?: TVehicleRegistration) {
    item.value = payload || new MVehicleRegistration();
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
