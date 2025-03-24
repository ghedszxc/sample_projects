const { useLocalFetchUtil, formatDateAndTime } = useUtils();

export default function useIncident() {
  class MIncident implements IIncident {
    _id?: string;
    reportId?: string;
    incidentInformation: IIncidentInformation;
    affectedEntities: IAffectedEntities;
    authorities: IAuthorities;
    briefSummary: string;
    organization?: string;
    site?: string;
    photos?: IPhotos[];
    approvedBy?: string;
    reasonForReject?: string;
    status?: string; // pending || reject || approved
    createdAt?: string | Date;
    updatedAt?: string | Date;
    constructor(
      {
        // common
        _id = "",
        reportId,
        organization = "",
        site = "",
        photos = [],
        reasonForReject = "",
        status = "",
        approvedBy = "",
        incidentInformation = {
          siteInfo: {
            site: "",
            designation: "",
            irNumber: "",
            submittedBy: "",
          },
          placeOfIncident: {
            block: "",
            level: "",
            unit: "",
            other: "",
            isOther: "",
          },
          incidentTypeAndTime: {
            incidentEnd: "",
            incidentStart: "",
            typeOfIncident: "",
          },
          submissionForm: {
            dateOfReport: "",
            time: "",
            timeOfResponse: "",
          },
          complaintInfo: {
            complainant: "",
            contact: "",
            nric: "",
          },
          recipientOfComplaint: {
            contact: "",
            nric: "",
            recipient: "",
          },
          complaintReceivedTo: {
            briefDescription: "",
            otherDescription: "",
            receivedVia: "phone",
          },
        },
        affectedEntities = {
          anyUnitAffectedValue: "",
          affectedUnit: {
            block: "",
            contact: "",
            description: "",
            level: "",
            resident: "",
            unit: "",
            other: "",
            isOther: false,
          },
          anyoneAffectedValue: "",
          affectedInjured: [],
          anyPropertyAffectedValue: "",
          anyoneDamageToProperty: [],
        },
        authorities = {
          authoritiesValue: "",
          authoritiesCalled: [],
          incidentThereAfter: {
            actionTaken: "",
            status: "",
            time: "",
          },
          managementNotified: {
            actionTaken: "",
            status: "",
            time: "",
          },
          incidentResolved: {
            actionTaken: "",
            status: "",
            time: "",
          },
          causeOfIncident: {
            actionTaken: "",
            status: "",
            time: "",
          },
          systemUsed: {
            actionTaken: "",
            status: "",
            time: "",
          },
          cctvRecord: {
            actionTaken: "",
            status: "",
            time: "",
          },
          particularsOwner: {
            actionTaken: "",
            status: "",
            time: "",
          },
          whenIncidentResolve: {
            actionTaken: "",
            status: "",
            time: "",
          },
          nameOfShiftIncharge: {
            personInCharge: "",
            actionTaken: "",
            shiftStart: "",
            shiftEnd: "",
            time: "",
          },
          securityImplication: {
            actionTaken: "",
            status: "",
            time: "",
          },
        },
        briefSummary = "",
      } = {} as IIncident,
    ) {
      this._id = _id;
      this.reportId = reportId;
      this.incidentInformation = incidentInformation;
      this.affectedEntities = affectedEntities;
      this.authorities = authorities;
      this.briefSummary = briefSummary;
      this.organization = organization;
      this.site = site;
      this.photos = photos;
      this.status = status;
      this.reasonForReject = reasonForReject;
      this.approvedBy = approvedBy;
    }
  }

  const incidentApiUrl = "/api/incidents/v1";
  const generatesummaryApiUrl = "/api/incidents/v1/generate-summary";
  const occurrenceApiUrl = "/api/occurrences/v1";
  const incident = useState("incident", () => new MIncident());
  const incidents = useState("incidents", (): IIncident[] => []);
  const search = useState("search", () => "");
  const selectFilter = useState("selectFilterIncident", () => "");
  const dateSelected = useState("dateSelectedIncident", () => "");
  const page = useState("pageIncident", () => 1);
  const pages = useState("pagesIncident", () => 0);
  const itemsPerPage = useState("itemsPerPageIncident", () => 10);
  const pageRange = useState("pageRangeIncident", () => "-- - -- of --");
  const isTableLoading = useState("isTableLoadingIncident", () => false);
  const isIncidentValid = useState("isIncidentValidIncident", () => false);
  const isLoaded = useState("isLoadedIncident", () => false);
  const isSummary = useState("isSummaryIncident", () => false);
  const isCreate = useState("isCreateIncident", () => false);
  const isUpdate = useState("isUpdateIncident", () => false);
  const filterOrganization = useState("filterOrganizationIncident", () => "");
  const filterSite = useState("filterSiteIncident", () => "");
  const photoId = useState("photoId", () => "");

  async function downloadDobPdf(url: string) {
    const res = await useLocalFetchUtil<Blob | MediaSource>(
      `${occurrenceApiUrl}/pdf`,
      "GET",
      {
        url: url,
        title: "INCIDENT REPORT",
        orientation: "P", // (L|Landscape|P|Portrait)
      },
    );
    const downloadUrl = window.URL.createObjectURL(res);
    const a = document.createElement("a");
    a.href = downloadUrl;
    a.download = `IR_DOWNLOADED_${formatDateAndTime(new Date(), true)}.pdf`; // Specify the file name
    document.body.appendChild(a);
    a.click(); // Trigger the download
    window.URL.revokeObjectURL(downloadUrl); // Clean up
  }

  async function getImage(url: string) {
    const getImage = await useLocalFetch(url);
    const image = URL.createObjectURL(getImage.data.value as Blob);
    return image;
  }

  function setIncident(data?: IIncident) {
    incident.value = data || new MIncident();
  }

  async function getIncidentsByPageSearch(
    {
      date = "",
      search = "",
      page = 0,
      limit = 10,
      organization,
      site,
      status = "",
    } = {} as IIncidentSearch,
  ) {
    const data = await useLocalFetchUtil<TIncidentResponse>(
      incidentApiUrl,
      "GET",
      {
        page,
        search,
        limit,
        organization,
        site,
        date,
        status,
      },
    );
    return data;
  }

  async function getIncidentById(id: string) {
    isLoaded.value = false;
    const data = await useLocalFetchUtil<IIncident>(
      `${incidentApiUrl}/${id}`,
      "GET",
    );
    isLoaded.value = true;
    return data;
  }

  async function getGenerateSummary(payload: IIncident) {
    isLoaded.value = false;
    const data = await useLocalFetchUtil<string>(
      generatesummaryApiUrl,
      "POST",
      payload,
    );
    isLoaded.value = true;
    return data;
  }

  async function setIncidents(
    { organization, site, status = "" } = {} as {
      organization?: string;
      site?: string;
      status?: string;
    },
  ) {
    try {
      isTableLoading.value = true;
      const _incidents = await getIncidentsByPageSearch({
        page: page.value,
        search: search.value,
        limit: itemsPerPage.value,
        date: dateSelected.value,
        organization: organization,
        site: site,
        status: selectFilter.value || status,
      });

      incidents.value = _incidents.items;
      pageRange.value = _incidents.pageRange;
      pages.value = _incidents.pages;
      isTableLoading.value = false;
    } catch (error) {
      incidents.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isTableLoading.value = false;
    }
  }

  async function addIncident(payload: IIncident) {
    return await useLocalFetchUtil(incidentApiUrl, "POST", payload);
  }

  async function deleteIncidentById(id: string, irStatus?: string) {
    const data = await useLocalFetchUtil<IIncident>(
      `${incidentApiUrl}/${id}/status/${irStatus}`,
      "PUT",
    );
    return data;
  }

  async function updateIncident(form: IIncident) {
    if (
      form.status &&
      /^(reject|rejected)$/i.test(form.status) &&
      Boolean(form.approvedBy) &&
      typeof form.approvedBy === "object"
    ) {
      form.approvedBy = null;
      form.status = "pending";
    }
    const data = await useLocalFetchUtil<IIncident | undefined>(
      incidentApiUrl,
      "PUT",
      form,
    );
    return data;
  }

  async function approveOrRejectIncidentReport(form: TConfirmPayload) {
    const data = await useLocalFetchUtil<TConfirmPayload | undefined>(
      `${incidentApiUrl}/approve-reject/${form._id}`,
      "PUT",
      form,
    );

    if (!data) {
      throw new Error("No data returned from useLocalFetchUtil");
    }

    return data;
  }

  async function getIncrementedReportId(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    const res = await useLocalFetchUtil<string>(
      `${incidentApiUrl}/reference-number`,
      "GET",
      {
        organization,
        site,
      },
    );
    return res;
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site, status } = {} as {
      organization?: string;
      site?: string;
      status?: string;
    },
  ) {
    page.value++;
    setIncidents({
      site: site,
      status: status,
    });
  }

  function prevPage(
    { organization, site, status } = {} as {
      organization?: string;
      site?: string;
      status?: string;
    },
  ) {
    page.value--;
    setIncidents({
      site: site,
      status: status,
    });
  }

  return {
    incident,
    incidents,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setIncident,
    isTableLoading,
    isCreate,
    isUpdate,
    setIncidents,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    isIncidentValid,
    isSummary,
    addIncident,
    updateIncident,
    approveOrRejectIncidentReport,
    deleteIncidentById,
    getIncidentById,
    filterOrganization,
    filterSite,
    search,
    selectFilter,
    dateSelected,
    getIncrementedReportId,
    downloadDobPdf,
    isLoaded,
    getImage,
    photoId,
    getGenerateSummary,
  };
}
