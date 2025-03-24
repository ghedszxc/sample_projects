export default function useForms() {
  const apiEndPoint = "/api/form/v1";
  const isLoading = useState("form-recordsIsLoading", () => false);
  const isUpdating = useState("form-recordsIsDeleting", () => false);
  const isDeleting = useState("form-recordsIsDeleting", () => false);
  const isValid = useState("form-recordsIsValid", () => false);
  const items = useState("form-records", (): TForm[] => []);
  const page = useState("form-recordsPage", () => 1);
  const pages = useState("form-recordsPages", () => 1);
  const itemsPerPage = useState("form-recordsItemsPerPage", () => 10);
  const pageRange = useState("form-recordsPageRange", () => "-- - -- of --");
  const search = useState("form-recordsSearch", () => "");
  const filter = useState("form-ticketSearch", () => "");
  const filterOptions = useState("form-recordsFilterOptions", () => []);

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

  // PUT
  async function updateFormStatus(id: string, payload: TUpdateFormStatus) {
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

  //UPDATE MANAGEMENT INFO
  async function updateManagementInfo(
    id: string,
    payload: TUpdateManagementInfo,
  ) {
    const { useLocalFetchUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { mySite } = useFilter();
    try {
      isUpdating.value = true;
      const response = await useLocalFetchUtil<TUpdateResponse>(
        `${apiEndPoint}/${id}/manage`,
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

  // GET PAGINATED
  async function getPaginatedItems(
    {
      pageParam = 1,
      limitParam = 10,
      searchParam = "",
      filterType = "",
      filterStatus = "",
      site,
      createdBy,
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
          type: filterType,
          status: filterStatus,
          site,
          createdBy,
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

  // SETTERS
  async function setItems(
    {
      pageParam,
      limitParam,
      searchParam,
      site,
      filterType,
      filterStatus,
      createdBy,
    } = {} as TSearchFilter,
  ) {
    const response = await getPaginatedItems({
      pageParam: pageParam || page.value,
      limitParam: limitParam || itemsPerPage.value,
      searchParam: searchParam || search.value,
      filterType,
      filterStatus,
      site,
      createdBy,
    });
    if (response) {
      items.value = response.items;
      pageRange.value = response.pageRange;
      pages.value = response.pages;
    }
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

  async function downloadDobPdf(url: string, title?: string) {
    const { useLocalFetchUtil, formatDateAndTime } = useUtils();
    const res = await useLocalFetchUtil<Blob | MediaSource | undefined>(
      `${apiEndPoint}/pdf`,
      "GET",
      {
        url: url,
        title: title || "Unknown Title",
        orientation: "P", // (L|Landscape|P|Portrait)
      },
    );
    if (!res) throw new Error("Error downloading PDF");
    const downloadUrl = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `${title}_DOWNLOADED_${formatDateAndTime(new Date(), true)}.pdf`; // Specify the file name
    document.body.appendChild(a);
    a.click(); // Trigger the download
    window.URL.revokeObjectURL(downloadUrl); // Clean up
  }

  return {
    items,
    page,
    pages,
    itemsPerPage,
    pageRange,
    isValid,
    isLoading,
    isUpdating,
    isDeleting,
    filter,
    filterOptions,
    search,
    nextPage,
    prevPage,
    setItems,
    getPaginatedItems,
    resetPageAndLimit,
    downloadDobPdf,
    updateFormStatus,
    deleteItem,
    updateManagementInfo,
  };
}
