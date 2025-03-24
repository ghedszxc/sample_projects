import moment from "moment-timezone";

export default function useVirtualPatrol() {
  class MVirtualPatrol implements TVirtualPatrol {
    _id: string;
    routeName: string;
    assignedUser: string[];
    schedule: {
      startTime?: string;
      endTime?: string;
      startDay?: string;
      endDay?: string;
      daysOfWeek: string[];
      schedules?: any[];
    };

    cctvList?: TCctvList[];

    organization: string;
    site: string;
    items: [];

    constructor(
      {
        _id = "",
        routeName = "",
        assignedUser = [],
        schedule = {
          startTime: "",
          endTime: "",
          startDay: null,
          endDay: null,
          daysOfWeek: [],
          schedules: [],
        },

        cctvList = [],

        organization = "",
        site = "",
        items = [],
      } = {} as TVirtualPatrol,
    ) {
      this._id = _id;
      this.routeName = routeName;
      this.assignedUser = assignedUser;
      this.schedule = schedule as any;

      this.cctvList = cctvList;

      this.organization = organization;
      this.site = site;
      this.items = items;
    }
  }

  const daysWeek = useState("daysWeek", () => [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ]);
  const vPatrols = useState("vPatrols", (): TVirtualPatrol[] => []);
  const page = useState("vPatrolPage", () => 1);
  const pages = useState("vPatrolPages", () => 1);
  const routeCCTVPages = useState("routeCCTVPages", () => 1);
  const routeCCTVPage = useState("routeCCTVPage", () => 1);
  const routeSelectedItem = useState("routeSelectedItem", () => 4);
  const routeLimit = useState("routeCctvLimit", () => 4);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const pageRange = useState("vPatrolPageRange", () => "-- - -- of --");
  const questionsPageRange = useState(
    "vPatrolQuestionsPageRange",
    () => "-- - -- of --",
  );
  const pagesRangeRouteView = useState("pagesRangeRouteView", () => 1);
  const pageRangeRouteView = useState(
    "pageRangeRouteView",
    () => "-- - -- of --",
  );
  const pagesRangeRouteEmailView = useState(
    "pagesRangeRouteEmailView",
    () => 1,
  );
  const pageRangeRouteEmailView = useState(
    "pageRangeRouteEmailView",
    () => "-- - -- of --",
  );
  const search = useState("vPatrolSearch", () => "");
  const isVPatrolValid = useState("isVPatrolValid", () => false);
  const isVPatrolLoading = useState("isVPatrolLoading", () => false);
  const isVPatrolRouteViewLoading = useState(
    "isVPatrolRouteViewLoading",
    () => false,
  );
  const isVPatrolRouteEmailViewLoading = useState(
    "isVPatrolRouteViewLoading",
    () => false,
  );
  const isVPatrolQuestionsLoading = useState(
    "isVPatrolQuestionsLoading",
    () => false,
  );

  const isScreenshotLoading = useState(
    "isVPatrolQuestionsLoading",
    () => false,
  );
  const isDownloadingVPatrolReport = useState(
    "isDownloadingVPatrolReport",
    () => false,
  );
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const specificPatrolLog = useState("patrolLog", () => ({}));

  const newOptionValues = useState("newOptionValues", () => []);
  const currentPatrolLog = useState("currentPatrolLog", () => ({}));
  const incidentReports = useState("incidentReports", (): any => []);

  const isSendingEmail = useState("isSendingEmail", () => false);

  const addDialog = useState("addDialog", () => false);
  const editRouteDialog = useState("editRouteDialog", () => false);
  const patrolLogDialog = useState("patrolLogDialog", () => false);
  const addIncidentDialog = useState("addIncidentDialog", () => false);
  const patrolSettingsDialog = useState("patrolSettingsDialog", () => false);

  const patrolLogsPage = useState("patrolLogsPage", () => 1);
  const patrolLogsEmailPage = useState("patrolLogsEmailPage", () => 1);
  const patrolLogsItemsPerPage = useState(
    "patrolLogsItemsPerPageLogsPage",
    () => 10,
  );
  const patrolLogsEmailItemsPerPage = useState(
    "patrolLogsEmailItemsPerPageLogsPage",
    () => 10,
  );
  const patrolLogList = useState("patrolLogList", () => []);
  const patrolLogEmailList = useState("patrolLogEmailList", () => []);
  const patrolLogsPages = useState("patrolLogsPages", () => 1);
  const patrolLogsEmailPages = useState("patrolLogsEmailPages", () => 1);
  const patrolLogsPageRange = useState(
    "patrolLogsPageRange",
    () => "-- - -- of --",
  );
  const patrolLogsEmailPageRange = useState(
    "patrolLogsEmailPageRange",
    () => "-- - -- of --",
  );

  const specificPatrolLogDialog = useState(
    "specificPatrolLogDialog",
    () => false,
  );

  const addRouteSteps = useState("addRouteSteps", () => 1);
  const addQuestionSteps = useState("editQuestionSteps", () => 1);
  const editQuestionSteps = useState("editQuestionSteps", () => 1);
  const updatePatrolLogSteps = useState("updatePatrolLogSteps", () => 1);
  const addPatrolQuestionSteps = useState("addPatrolQuestionSteps", () => 1);

  const cctvLiveFeedDialog = useState("cctvLiveFeedDialog", () => false);
  const selectedCctv = useState("selectedCctv", () => false);

  const questionsPage = useState("questionsPage", () => 1);
  const questionsPages = useState("questionsPages", () => 1);
  const patrolQuestionnaires = useState("patrolQuestionnaires", () => []);
  const editDialog = useState("editDialog", () => false);
  const specificPatrolQuestion = useState(
    "specificPatrolQuestion",
    (): TPatrolLogQuestion => ({
      question: "",
      options: ["Yes", "No"],
      innerQuestions: [],
      site: "",
      routes: [],
      isAppliedAll: false,
    }),
  );
  const specificPatrolQuestionId = useState(
    "specificPatrolQuestionId",
    () => "",
  );

  const patrolMainQuestions = useState(
    "patrolMainQuestions",
    (): TPatrolLogQuestion[] => [],
  );

  const vPatrol = useState(
    "vPatrol",
    (): TVirtualPatrol => new MVirtualPatrol(),
  );

  const patrolInterval = useState("patrolInterval", () => 0);
  const patrolTimeDuration = useState("patrolTimeDuration", () => 0);
  const lastPatrolTimeDuration = useState("lastPatrolTimeDuration", () => 0);
  const patrolStartDateTimeDuration = useState(
    "patrolStartDateTimeDuration",
    () => "",
  );
  const patrolEndDateTimeDuration = useState(
    "patrolEndDateTimeDuration",
    () => "",
  );

  const isActiveReportStatus = useState("isActiveReportStatus", () => false);
  const reportStatus = useState("reportStatus", () => "");

  const isScheduleToday = useState("isScheduleToday", () => false);
  const isLatePatrolling = useState("isLatePatrolling", () => false);

  const validateNextCctv = useState("validateNextCctv", () => true);
  const isValidPatrolLog = useState("isValidPatrolLog", () => true);

  const newVPatrol = useState(
    "newVPatrol",
    (): TVirtualPatrol => new MVirtualPatrol(),
  );

  const isEditExistingPatrolLog = useState(
    "isEditExistingPatrolLog",
    () => false,
  );

  const isReportStatus = useState("isReportStatus", () => "");

  const canDoPatrolling = useState("canDoPatrolling", () => false);

  const showLogAttachmentDialog = useState("showLogAttachmentDialog", () => "");
  const dialogAttachments = useState("dialogAttachments", () => []);

  function setVPatrol(data?: TVirtualPatrol) {
    vPatrol.value = data || new MVirtualPatrol();
  }

  function setNewVPatrol(data?: TVirtualPatrol) {
    newVPatrol.value = data || new MVirtualPatrol();
  }

  async function getVPatrolByPageSearch(
    {
      page = 1,
      search = "",
      organization = "",
      site = "",
      routesFilter = "",
      assigneesFilter = "",
    } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
      routesFilter?: string;
      assigneesFilter?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/routes", {
      method: "GET",
      query: {
        page,
        search,
        organization,
        site,
        routesFilter,
        assigneesFilter,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getVPatrolById(
    _id: string,
    page: number | string,
    limit?: number | string,
  ) {
    const { error, data } = await useLocalFetch(`/api/routes/${_id}`, {
      method: "GET",
      query: { page, limit },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      routeCCTVPages.value = data.value.pages;
      return Promise.resolve(data.value);
    }
  }

  async function getSpecificPatrolLogById(
    patrolLogId: string,
    cctvId: string,
    routeId: string,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/routes/specific-patrol-log/${patrolLogId}`,
      {
        method: "GET",
        query: { cctvId, routeId },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getSpecificPatrolQuestionById(id: string) {
    const { error, data } = await useLocalFetch(
      `/api/routes/patrol-log/questions/${id}`,
      {
        method: "GET",
        // query: { cctvId, routeId },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setVPatrols(
    { organization, site, routeIds, assigneeIds } = {} as {
      organization?: string;
      site?: string;
      routeIds?: string;
      assigneeIds?: string;
    },
  ) {
    try {
      isVPatrolLoading.value = true;
      const _vPatrols = (await getVPatrolByPageSearch({
        page: page.value,
        search: search.value,
        organization: organization,
        site: site,
        routesFilter: routeIds,
        assigneesFilter: assigneeIds,
      })) as TGetVirtualPatrolResponse;
      vPatrols.value = _vPatrols.items as TVirtualPatrol[];
      pageRange.value = _vPatrols.pageRange;
      isVPatrolLoading.value = false;
      pages.value = _vPatrols.pages;
    } catch (error) {
      vPatrols.value = [];
      pageRange.value = "-- - -- of --";
      isVPatrolLoading.value = false;
    }
  }

  async function addVirtualPatrol(form: any) {
    const { error, data } = await useLocalFetch("/api/routes", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function updateVPatrol(form: any) {
    let _id = form._id;
    delete form._id;
    form.site;
    delete form.organization;
    delete form.createdAt;
    delete form.updatedAt;

    const { data, error } = await useLocalFetch(`/api/routes/${_id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateSpecificVPatrol({
    _id,
    irId,
  }: {
    _id: string;
    irId?: string;
  }) {
    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/route/attach-ir/${_id}`,
      {
        method: "PUT",
        body: JSON.stringify({ irId }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function getVPatrolScreenshot(_id: string) {
    const { data, error } = await useLocalFetch(
      `/api/routes/screenshot/${_id}`,
      {
        method: "GET",
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function deleteVPatrol(id: string) {
    const { error, data } = await useLocalFetch(`/api/routes/${id}`, {
      method: "DELETE",
      body: "",
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value++;
    setVPatrols({
      organization: organization,
      site: site,
    });
  }

  function prevPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value--;
    setVPatrols({
      organization: organization,
      site: site,
    });
  }

  function nextPageQuestions(
    { search = "", site, limit = 10 } = {} as {
      search?: string;
      site?: string;
      limit: number;
    },
  ) {
    questionsPage.value++;
    getPatrolQuestionnairesByPage({
      page: questionsPage.value,
      site: site,
      limit: limit,
      search: search,
    });
  }

  function prevPageQuestions(
    { search = "", site, limit = 10 } = {} as {
      search?: string;
      site?: string;
      limit: number;
    },
  ) {
    questionsPage.value--;
    getPatrolQuestionnairesByPage({
      page: questionsPage.value,
      site: site,
      limit: limit,
      search: search,
    });
  }

  async function getPatrolQuestionnaires(site: string, route: string) {
    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/all-questions`,
      {
        method: "GET",
        query: {
          site,
          route,
        },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getPatrolQuestionnairesByPage({
    page,
    site,
    limit,
    search,
    date,
  }: {
    page?: number;
    site?: string;
    limit?: number;
    search?: string;
    date?: Date | string;
  }) {
    isVPatrolQuestionsLoading.value = true;

    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/questions`,
      {
        method: "GET",
        query: {
          page,
          site,
          limit,
          search,
          date,
        },
      },
    );

    if (error && error.value && error.value.data) {
      isVPatrolQuestionsLoading.value = false;
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      isVPatrolQuestionsLoading.value = false;

      patrolMainQuestions.value = data.value.items;
      questionsPageRange.value = data.value.pageRange;
      questionsPages.value = data.value.pages;

      return Promise.resolve(data.value);
    }
  }

  async function deletePatrolQuestion(id: string) {
    questionsPage.value = 1;

    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/questions/${id}`,
      {
        method: "DELETE",
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addPatrolQuestionnaire(item: TPatrolLogQuestion) {
    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/questions`,
      {
        method: "POST",
        body: item,
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function updatePatrolQuestionnaire(item: TPatrolLogQuestion) {
    const { data, error } = await useLocalFetch(
      `/api/routes/patrol-log/questions/${item._id}`,
      {
        method: "PUT",
        body: item,
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getPatrolLogList(routeId: string, cctvId: string) {
    const { data, error } = await useLocalFetch(`/api/routes/patrol-log/all`, {
      method: "GET",
      query: { routeId, cctvId },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addPatrolLog(payload: any) {
    const { error, data } = await useLocalFetch("/api/routes/patrol-log", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function getPatrolLogListV2(payload: any) {
    isVPatrolLoading.value = true;

    try {
      const { error, data } = await useLocalFetch("/api/routes/v1/patrol-log", {
        method: "GET",
        query: payload,
      });

      isVPatrolLoading.value = false;

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message as string);
      }

      const result = data as any;
      if (result && result.value) {
        return Promise.resolve(result.value);
      }
    } catch (error) {
      isVPatrolLoading.value = false;
      return Promise.reject(error);
    }
  }

  async function getPatrolLogListByRoute(payload: any) {
    isVPatrolLoading.value = true;

    try {
      const { error, data } = await useLocalFetch(
        "/api/routes/v1/patrol-log-route",
        {
          method: "GET",
          query: payload,
        },
      );

      isVPatrolLoading.value = false;

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message as string);
      }

      const result = data as any;

      if (result && result.value) {
        return Promise.resolve(result.value);
      }
    } catch (error) {
      isVPatrolLoading.value = false;
      return Promise.reject(error);
    }
  }

  async function getPatrolLogListByRouteId(payload: {
    id: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    isVPatrolRouteViewLoading.value = true;

    try {
      const { id, page = 1, limit = 10, search = "" } = payload;
      const { error, data } = await useLocalFetch(
        `/api/routes/patrol-log/route/${id}`,
        {
          method: "GET",
          query: {
            page,
            limit,
            search,
          },
        },
      );

      isVPatrolRouteViewLoading.value = false;

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message);
      }

      const result = data;

      if (result && result.value) {
        pagesRangeRouteView.value = result.value.pages;
        pageRangeRouteView.value = result.value.pageRange;

        return Promise.resolve(result.value);
      }
    } catch (error) {
      isVPatrolLoading.value = false;
      return Promise.reject(error);
    }
  }

  async function getPatrolLogEmailList(payload: any) {
    isVPatrolLoading.value = true;

    try {
      console.log("API: ", payload);
      const { error, data } = await useLocalFetch(
        "/api/routes/v1/patrol-log-email",
        {
          method: "GET",
          query: payload,
        },
      );

      isVPatrolLoading.value = false;

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message as string);
      }

      const result = data as any;
      if (result && result.value) {
        return Promise.resolve(result.value);
      }
    } catch (error) {
      isVPatrolLoading.value = false;
      return Promise.reject(error);
    }
  }

  async function getPatrolLogListByEmailRouteId(payload: {
    id: string;
    page?: number;
    limit?: number;
    search?: string;
  }) {
    isVPatrolRouteEmailViewLoading.value = true;

    try {
      const { id, page = 1, limit = 10, search = "" } = payload;
      const { error, data } = await useLocalFetch(
        `/api/routes/patrol-log-email/route/${id}`,
        {
          method: "GET",
          query: {
            page,
            limit,
            search,
          },
        },
      );

      isVPatrolRouteEmailViewLoading.value = false;

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message);
      }

      const result = data;

      if (result && result.value) {
        pagesRangeRouteEmailView.value = result.value.pages;
        pageRangeRouteEmailView.value = result.value.pageRange;

        return Promise.resolve(result.value);
      }
    } catch (error) {
      isVPatrolRouteEmailViewLoading.value = false;
      return Promise.reject(error);
    }
  }

  // Send Patrol Logs (PDF File) to Specific Email
  async function sendPatrolLogs(form: {
    subject: string;
    emails: string[];
    items: string[];
    site: string;
    organization?: string;
  }) {
    const { data, error } = await useLocalFetch(
      `/api/routes/send-patrol-logs`,
      {
        method: "POST",
        body: JSON.stringify(form),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  // Generate Patrol Logs Report (Daily/Monthly)
  async function generatePatrolLogReport(form: {
    timeFrame: "daily" | "monthly";
    monthAndYear?: Date | string;
    date?: Date | string;
    site: string;
    organization?: string;
  }) {
    const response = await fetch(`/api/routes/generate-patrol-logs-report`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    if (!response.ok) {
      throw new Error(`Failed to download report: ${response.statusText}`);
    }

    const blob = await response.blob();
    if (blob.size > 0) {
      const fileSaver = await import("file-saver");
      fileSaver.saveAs(blob, `patrol-log-report_${form.timeFrame}.pdf`);
    } else {
      console.error("Empty PDF received.");
    }
  }

  // Generate All Patrol Logs Report - Date Range
  async function useGenerateAllReportsViaDateRange(form: {
    fileType: "csv" | "pdf";
    dateFrom: Date | string;
    dateTo: Date | string;
    site: string;
    organization?: string;
  }) {
    try {
      let response: any;
      if (form.fileType === "pdf") {
        response = await fetch(`/api/routes/download-all-patrol-logs-report`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        });

        if (!response.ok) {
          throw new Error(`Failed to download report: ${response.statusText}`);
        }

        const blob = await response.blob();
        if (blob.size > 0) {
          const fileSaver = await import("file-saver");
          const fileName = `patrol-log-report_${form.dateFrom}_${form.dateTo}.pdf`;
          fileSaver.saveAs(blob, fileName);
        } else {
          console.error("Empty PDF received.");
        }
      } else {
        response = await useLocalFetch(
          `/api/routes/download-all-patrol-logs-report`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(form),
          },
        );

        const headers = [
          [
            "Route",
            "CCTV",
            "Camera Report Status",
            "Main Question",
            "Main Answer",
            "Inner Question",
            "Inner Answer",
            "Submitted By",
            "Submitted Date",
            "Incident Report",
            "Incident Report Link",
          ],
        ];

        response?.data?.value.forEach((item: any) => {
          item.patrolLogs.forEach((i: any) => {
            const baseData = [
              item.route || "-",
              i.cctvName || "-",
              i.cameraReportStatus || "-",
              item.assignee || "-",
              item.submittedDate || "-",
              item.incidentReport?.reportId || "-",
              item.incidentReport?.irLink || "-",
            ];

            if (i.logQuestions && i.logQuestions.length > 0) {
              i.logQuestions.forEach((logQuestion: any, index: number) => {
                const row = [
                  index === 0 ? baseData[0] : "",
                  index === 0 ? baseData[1] : "",
                  index === 0 ? baseData[2] : "",
                  `"${logQuestion.mainQuestion || "-"}"`,
                  `"${logQuestion.mainAnswer || "-"}"`,
                  logQuestion.innerQuestions?.[0]?.innerQuestionLabel || "-",
                  logQuestion.innerQuestions?.[0]?.answer || "-",
                  index === 0 ? baseData[3] : "",
                  index === 0 ? baseData[4] : "",
                  index === 0 ? baseData[5] : "",
                  index === 0 ? baseData[6] : "",
                ];

                headers.push(row);

                logQuestion.innerQuestions
                  ?.slice(1)
                  .forEach((innerQuestion: any) => {
                    const innerRow = [
                      "",
                      "",
                      "",
                      "",
                      "",
                      `"${innerQuestion.innerQuestionLabel || "-"}"`,
                      `"${innerQuestion.answer || "-"}"`,
                      "",
                      "",
                      "",
                      "",
                    ];
                    headers.push(innerRow);
                  });
              });
            } else {
              const emptyRow = [
                baseData[0],
                baseData[1],
                baseData[2],
                "-",
                "-",
                "-",
                "-",
                baseData[3],
                baseData[4],
                baseData[5],
                baseData[6],
              ];
              headers.push(emptyRow);
            }
          });
        });

        const fileContent = `data:text/csv;charset=utf-8,${headers
          .map((e) => e.join(","))
          .join("\n")}`;

        let encodedUri = encodeURI(fileContent);
        let link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute(
          "download",
          `patrol-log-report_${form.dateFrom}-${form.dateTo}.csv`,
        );
        document.body.appendChild(link);
        link.click();
      }
    } catch (error) {
      console.error("Error generating the report:", error);
      throw error;
    }
  }

  async function getQuestionnairesWithAnswers(
    selected_patrol_log_form: any,
    questions: any,
  ) {
    const questionForm = questions.map((item: any, key: number) => {
      const findQuestion = selected_patrol_log_form.logQuestions.find(
        (find: any) => find._id == item._id,
      );

      if (
        findQuestion &&
        findQuestion.recordingAttachment &&
        findQuestion.recordingAttachment.includes(".mp4")
      ) {
        let getElements = setInterval(() => {
          if (
            document.getElementById(`div_video_${key}`) &&
            document.getElementById(`video_${key}`)
          ) {
            clearInterval(getElements);

            const getVideo = document.getElementById(`video_${key}`);
            const getDiv = document.getElementById(`div_video_${key}`);

            var sourceMP4 = document.createElement("source");
            sourceMP4.src = findQuestion?.recordingAttachment;
            sourceMP4.type = "video/mp4";
            sourceMP4.id = `source_${key}`;
            getVideo?.appendChild(sourceMP4);

            getDiv.style.display = "inline-block";
          }
        }, 1000);
      }

      if (
        findQuestion &&
        findQuestion.screenshotAttachment &&
        !findQuestion.screenshotAttachment.includes(".mp4")
      ) {
        let getElements = setInterval(() => {
          if (document.getElementById(`imageCanvas_${key}`)) {
            clearInterval(getElements);

            var canvas = document.getElementById(`imageCanvas_${key}`);
            var ctx = canvas.getContext("2d");

            var img = new Image();
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = 1100;

            img.onload = function () {
              ctx.drawImage(img, 0, 0, window.innerWidth, 1100);
            };
            img.src = findQuestion?.screenshotAttachment;

            useLocalFetch(`/api/files/${findQuestion?.screenshotAttachment}`, {
              method: "GET",
            }).then(async (res: any) => {
              var canvas = document.getElementById(`imageCanvas_${key}`);
              var ctx = canvas.getContext("2d");

              var img = new Image();

              img.onload = function () {
                var ratio = this.height / this.width;
                canvas.height = canvas.width * ratio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };

              const image = await convertBlobToBase64(res.data.value);
              img.src = image;
            });

            document.getElementById(`div_${key}`).style.display = "block";
            document.getElementById(`div_${key}`).style.opacity = 0.5;
          }
        }, 1000);
      }

      isReportStatus.value = selected_patrol_log_form?.isActiveReportStatus
        ? selected_patrol_log_form?.reportStatus.report
        : "";

      return {
        _id: item._id,
        question: item.question,
        options: findQuestion ? true : false,
        remarks: findQuestion?.remarks,
        screenshotAttachment: findQuestion?.screenshotAttachment,
        recordingAttachment: findQuestion?.recordingAttachment,
        reportStatus: findQuestion?.reportStatus,
        isActiveReportStatus: findQuestion?.isActiveReportStatus,

        innerQuestions: item.innerQuestions.map((inner: any) => {
          const findInnerQuestion = findQuestion?.innerQuestions.find(
            (find: any) => find._id == inner._id,
          );

          if (findInnerQuestion?.answer) {
            return {
              _id: inner._id,
              answer: findInnerQuestion?.answer || "",
              options: inner.options,
            };
          } else {
            return {
              _id: inner._id,
              options: inner.options,
              name: inner.name,
            };
          }
        }),
      };
    });

    patrolQuestionnaires.value = {
      questionnaires: questionForm,
      editHistory: selected_patrol_log_form.editHistory,
    };
  }

  async function getQuestionnairesWithoutAnswers(questions: any) {
    const questionForm = questions.map((item: any) => {
      return {
        _id: item._id,
        question: item.question,
        innerQuestions: item.innerQuestions,
        options: false,
        screenshotAttachment: "",
        recordingAttachment: "",
        remarks: "",
      };
    });

    patrolQuestionnaires.value = {
      questionnaires: questionForm,
      editHistory: [],
    };
  }

  async function renderAttachments(questions: any) {
    questions.map((item: TPatrolLogQuestion, key: number) => {
      if (item.recordingAttachment) {
        let getElements = setInterval(() => {
          if (
            document.getElementById(`div_video_${key}`) &&
            document.getElementById(`video_${key}`)
          ) {
            clearInterval(getElements);

            const getVideo = document.getElementById(`video_${key}`);
            const getDiv = document.getElementById(`div_video_${key}`);

            var sourceMP4 = document.createElement("source");
            sourceMP4.src = item.recordingAttachment as string;
            sourceMP4.type = "video/mp4";
            sourceMP4.id = `source_${key}`;
            getVideo?.appendChild(sourceMP4);

            getDiv.style.display = "inline-block";
          }
        }, 1000);
      }

      if (item.screenshotAttachment) {
        let getElements = setInterval(() => {
          if (document.getElementById(`imageCanvas_${key}`)) {
            clearInterval(getElements);

            var canvas = document.getElementById(`imageCanvas_${key}`);
            var ctx = canvas.getContext("2d");

            var img = new Image();
            ctx.canvas.width = window.innerWidth;
            ctx.canvas.height = 1100;

            img.onload = function () {
              ctx.drawImage(img, 0, 0, window.innerWidth, 1100);
            };
            img.src = item.screenshotAttachment as string;

            useLocalFetch(`/api/files/${item.screenshotAttachment}`, {
              method: "GET",
            }).then(async (res: any) => {
              var canvas = document.getElementById(`imageCanvas_${key}`);
              var ctx = canvas.getContext("2d");

              var img = new Image();

              img.onload = function () {
                var ratio = this.height / this.width;
                canvas.height = canvas.width * ratio;
                ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
              };

              const image = await convertBlobToBase64(res.data.value);
              img.src = image;
            });

            document.getElementById(`div_${key}`).style.display = "block";
            document.getElementById(`div_${key}`).style.opacity = 0.5;
          }
        }, 1000);
      }
    });
  }

  async function convertBlobToBase64(blob: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
      reader.readAsDataURL(blob);
    });
  }

  async function onStartRecording(cctvId: string) {
    patrolInterval.value = setInterval(() => {
      patrolTimeDuration.value++;
    }, 1000);
    // const logs = JSON.parse(localStorage.getItem("pre-reg-log"));

    // // CHECK LOCAL STORAGE IF THERE IS STORED DATA
    // if (logs?.length) {
    //   // THIS WILL CONTINUE THE EXISTING DURATION STORED IN LOCAL STORAGE
    //   const findLogIndex = logs?.findIndex(
    //     (find: any) => find.cctvId == cctvId,
    //   );

    //   patrolInterval.value = setInterval(() => {
    //     patrolTimeDuration.value++;
    //   }, 1000);

    //   if (findLogIndex != -1) {
    //     patrolTimeDuration.value = logs[findLogIndex]?.duration;
    //     patrolStartDateTimeDuration.value =
    //       logs[findLogIndex]?.startDateTimeDuration;

    //     isActiveReportStatus.value = logs[findLogIndex]?.isActiveReportStatus;
    //     reportStatus.value = logs[findLogIndex]?.reportStatus;
    //   } else {
    //     patrolStartDateTimeDuration.value = moment.tz(
    //       moment(new Date()),
    //       "Asia/Singapore",
    //     );

    //     isActiveReportStatus.value = false;
    //     reportStatus.value = "";
    //   }
    // } else {
    //   // WHEN LOCAL STORAGE IS EMPTY THEN START TIME DURATION
    //   let getStartTime = moment.tz(moment(new Date()), "Asia/Singapore");

    //   patrolStartDateTimeDuration.value = getStartTime;
    //   isActiveReportStatus.value = false;
    //   reportStatus.value = "";

    //   patrolInterval.value = setInterval(() => {
    //     let timeDiff = new Date() - getStartTime;

    //     timeDiff /= 1000;

    //     let seconds = Math.round(timeDiff);
    //     patrolTimeDuration.value = seconds;
    //   }, 1000);
    // }
  }

  async function onStopRecording() {
    patrolEndDateTimeDuration.value = moment.tz(
      moment(new Date()),
      "Asia/Singapore",
    );

    clearInterval(patrolInterval.value);
    lastPatrolTimeDuration.value = patrolTimeDuration.value;
    patrolTimeDuration.value = 0;
  }

  async function getScheduledPatrollingToday(
    siteId: string,
    dayToday: string,
    assigneeIds: string,
  ) {
    const { data, error } = await useLocalFetch(`/api/routes/schedule`, {
      method: "GET",
      query: {
        siteId,
        dayToday,
        assigneeIds,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getScheduledRouteToday({
    siteId,
    dayToday,
    currentTime,
    timeWithGrace,
    assigneeIds,
  }: {
    siteId: string;
    dayToday: string;
    currentTime: string;
    timeWithGrace: string;
    assigneeIds: string;
  }) {
    const { data, error } = await useLocalFetch(`/api/routes/scheduled-route`, {
      method: "GET",
      query: {
        siteId,
        dayToday,
        currentTime,
        timeWithGrace,
        assigneeIds,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function validateRouteIfAlreadyPatrolledToday(payload: any) {
    const { data, error } = await useLocalFetch(
      `/api/routes/check-patrol-log`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      canDoPatrolling.value = data.value?.exists;
      return Promise.resolve(data.value);
    }
  }

  async function deleteSelectedPatrolLog(id: string) {
    try {
      const { error, data } = await useLocalFetch(
        `/api/routes/patrol-log/route/${id}`,
        {
          method: "DELETE",
        },
      );

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message);
      }

      if (data && data.value) {
        return Promise.resolve(data.value);
      }
    } catch (err) {
      return Promise.reject(err);
    }
  }

  return {
    vPatrol,
    vPatrols,
    page,
    pages,
    daysWeek,
    setVPatrol,
    setVPatrols,
    isVPatrolValid,
    isVPatrolLoading,
    addVirtualPatrol,
    getVPatrolById,
    routeCCTVPage,
    routeCCTVPages,
    routeSelectedItem,
    routeLimit,

    specificPatrolLog,
    getSpecificPatrolLogById,
    pageRange,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    deleteVPatrol,
    updateVPatrol,
    itemsPerPage,
    filterOrganization,
    filterSite,

    addDialog,
    editRouteDialog,
    patrolLogDialog,
    addIncidentDialog,
    patrolSettingsDialog,

    addRouteSteps,
    addQuestionSteps,
    editQuestionSteps,
    addPatrolQuestionSteps,
    cctvLiveFeedDialog,
    selectedCctv,

    newOptionValues,
    specificPatrolLogDialog,
    currentPatrolLog,
    incidentReports,
    updateSpecificVPatrol,

    isVPatrolQuestionsLoading,
    getPatrolQuestionnaires,
    addPatrolQuestionnaire,
    updatePatrolQuestionnaire,
    patrolQuestionnaires,
    patrolMainQuestions,
    getPatrolQuestionnairesByPage,
    deletePatrolQuestion,
    specificPatrolQuestionId,
    editDialog,
    questionsPageRange,
    getSpecificPatrolQuestionById,

    specificPatrolQuestion,
    questionsPage,
    questionsPages,
    nextPageQuestions,
    prevPageQuestions,
    addPatrolLog,
    getPatrolLogList,
    getPatrolLogListV2,
    getPatrolLogListByRoute,
    getPatrolLogListByRouteId,
    getPatrolLogListByEmailRouteId,
    isVPatrolRouteEmailViewLoading,
    pageRangeRouteEmailView,
    pagesRangeRouteEmailView,
    isVPatrolRouteViewLoading,
    pageRangeRouteView,
    pagesRangeRouteView,
    getPatrolLogEmailList,

    getQuestionnairesWithAnswers,
    getQuestionnairesWithoutAnswers,

    patrolLogsPage,
    patrolLogsEmailPage,
    patrolLogsItemsPerPage,
    patrolLogsEmailItemsPerPage,
    patrolLogList,
    patrolLogEmailList,
    patrolLogsPages,
    patrolLogsEmailPages,
    patrolLogsPageRange,
    patrolLogsEmailPageRange,

    updatePatrolLogSteps,

    isSendingEmail,
    sendPatrolLogs,
    generatePatrolLogReport,
    useGenerateAllReportsViaDateRange,
    isDownloadingVPatrolReport,
    patrolInterval,
    patrolTimeDuration,
    lastPatrolTimeDuration,
    patrolStartDateTimeDuration,
    patrolEndDateTimeDuration,

    onStartRecording,
    onStopRecording,

    isActiveReportStatus,
    reportStatus,

    isScheduleToday,
    isLatePatrolling,

    getScheduledPatrollingToday,
    validateNextCctv,
    newVPatrol,
    setNewVPatrol,

    getVPatrolScreenshot,
    isScreenshotLoading,
    search,

    isEditExistingPatrolLog,

    isReportStatus,
    isValidPatrolLog,
    renderAttachments,
    getScheduledRouteToday,

    validateRouteIfAlreadyPatrolledToday,
    canDoPatrolling,

    deleteSelectedPatrolLog,
    showLogAttachmentDialog,
    dialogAttachments,
  };
}
