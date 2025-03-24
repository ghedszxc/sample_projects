/* eslint-disable no-unused-vars */

import { Capacitor } from "@capacitor/core";
import { Filesystem, Directory, Encoding } from "@capacitor/filesystem";

export default function useForms() {
  const apiEndPoint = "/api/form/v1";
  const isLoading = useState("form-recordsIsLoading", () => false);
  const items = useState("form-records", (): TForms[] => []);
  const page = useState("form-recordsPage", () => 1);
  const pages = useState("form-recordsPages", () => 1);
  const itemsPerPage = useState("form-recordsItemsPerPage", () => 10);
  const pageRange = useState("form-recordsPageRange", () => "-- - -- of --");
  const search = useState("form-recordsSearch", () => "");
  const filter = useState("form-ticketSearch", () => "");
  const filterOptions = useState("form-recordsFilterOptions", () => []);
  const isValid = useState("form-recordsIsValid", () => false);
  const isUpdating = useState("form-recordsIsCancelling", () => false);

  // PUT
  async function updateFormStatus(id: string, payload: TUpdateFormStatus) {
    const { useLocalFetchUtil, removeEmptyPropertiesUtil } = useUtils();
    const { setSnackbar } = useLocal();
    const { currentUser } = useLocalAuth();
    try {
      isUpdating.value = true;
      const response = await useLocalFetchUtil<TUpdateResponse>(
        `${apiEndPoint}/${id}/cancel`,
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
        site: currentUser.value.site,
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
      pageParam = 1,
      limitParam = 10,
      searchParam = "",
      filterType = "",
      filterStatus = "",
      site,
      createdBy,
    } = {} as TSearchFilter,
  ) {
    page.value++;
    setItems({
      pageParam,
      limitParam,
      searchParam,
      site,
      filterType,
      filterStatus,
      createdBy,
    });
  }

  async function prevPage(
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
    page.value--;
    setItems({
      pageParam,
      limitParam,
      searchParam,
      site,
      filterType,
      filterStatus,
      createdBy,
    });
  }

  function resetPageAndLimit() {
    page.value = 1;
    itemsPerPage.value = 10;
  }

  async function downloadDobPdf(url: string, title: string = "Unknown Title") {
    try {
      const { useLocalFetchUtil, formatDateAndTime } = useUtils();
      const formattedDate = formatDateAndTime(new Date().toDateString());
      const fileName = `${title}_DOWNLOADED_${formattedDate}.pdf`;

      // Fetch the PDF file
      const blob = await useLocalFetchUtil<Blob | undefined>(
        `${apiEndPoint}/pdf`,
        "GET",
        {
          url: url,
          title: title || "Unknown Title",
          orientation: "P", // (L|Landscape|P|Portrait)
        },
      );
      if (!blob) throw new Error("No data received for PDF download");

      if (Capacitor.isNativePlatform()) {
        // **Native App**: Use Capacitor Filesystem to save the file
        // Convert Blob to Base64
        const base64Data = await blob.text(); // Cleaner approach
        await Filesystem.writeFile({
          path: fileName,
          data: base64Data.split(",")[1], // Remove metadata header
          directory: Directory.Documents,
          encoding: Encoding.UTF8,
        });

        console.log(`File saved as: ${fileName}`);
        alert(`Downloaded successfully! File saved as: ${fileName}`);
      } else {
        // Web-based download
        const downloadUrl = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = downloadUrl;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(downloadUrl);
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Error downloading PDF:", error.message);
      alert(`Failed to download the file: ${error.message}`);
    }
  }

  return {
    updateFormStatus,
    isLoading,
    items,
    page,
    pages,
    itemsPerPage,
    pageRange,
    filter,
    filterOptions,
    search,
    nextPage,
    prevPage,
    setItems,
    getPaginatedItems,
    resetPageAndLimit,
    downloadDobPdf,
    isValid,
    isUpdating,
  };
}
