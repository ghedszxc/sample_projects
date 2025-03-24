const { useLocalFetchUtil } = useUtils();

export interface ISearch {
  name?: string;
  passType: string;
}

import moment from "moment-timezone";

export default function useKey() {
  class MKeyLog implements TKeyLog {
    _id?: string;
    name: string;
    codes?: string[];
    code?: string;
    site?: string;
    organization?: string;
    serviceProvider?: string;
    passType?: string; // Visitor Pass || Pass Key
    passId?: string;
    createdAt?: string;
    updatedAt?: string;
    location?: string;
    description?: string;
    qty?: number;
    nextNumber?: number;
    prefix?: string;
    keyNo?: number;
    constructor(
      {
        _id = "",
        name = "",
        codes = [],
        code = "",
        site = "",
        organization = "",
        serviceProvider = "",
        passType = "",
        passId = "",
        createdAt,
        updatedAt,
        location = "",
        description = "",
        qty = 0,
        nextNumber = "",
        prefix = "",
        keyNo,
      } = {} as TKeyLog,
    ) {
      this._id = _id;
      this.name = name;
      this.codes = codes;
      this.passType = passType;
      this.passId = passId;
      this.codes = codes;
      this.codes = codes;
      this.site = site;
      this.organization = organization;
      this.serviceProvider = serviceProvider;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.location = location;
      this.description = description;
      this.qty = qty;
      this.nextNumber = Number(nextNumber);
      this.prefix = prefix;
      this.keyNo = keyNo;
    }
  }

  const keyLogApiUrl = "/api/keys/v1";
  const passApiUrl = "/api/keys/v1/pass";
  const keyApiUrl = "/api/keys/v1/keys";

  const keyLog = useState("keyLog", (): TKeyLog => new MKeyLog());
  const keyLogs = useState("keyLogs", (): TKeyLog[] => []);
  const page = useState("keyPage", () => 1);
  const pages = useState("keyPages", () => 1);
  const pageLimit = useState("keyLimit", () => 10);
  const pageRange = useState("keyPageRange", () => "-- - -- of --");
  const search = useState("keySearch", () => "");
  const isAdding = useState("isAdding", () => false);
  const isTableLoading = useState("isTableLoading", () => false);
  const isKeyLogValid = useState("isKeyLogValid", () => false);

  const passList = useState("passList", (): TKeyLog[] => []);
  const keyList = useState("keyList", (): TKeyLog[] => []);
  const passTypes = useState(
    "passTypes",
    () =>
      <any>[
        { title: "Visitor Pass", value: "visitor-pass" },
        { title: "Contractor Pass", value: "contractor-pass" },
        { title: "Agent Pass", value: "agent-pass" },
      ],
  );
  const passTypesStatus = useState("passTypesStatus", () => [
    { title: "Available", value: "Available" },
    { title: "In Use", value: "In Use" },
    { title: "Damaged", value: "Damaged" },
    { title: "Lost", value: "Lost" },
    { title: "Deleted", value: "Deleted" },
    { title: "Others", value: "Others" },
  ]);

  async function onSearchKey(term: string) {
    isTableLoading.value = true;
    const data = await useLocalFetchUtil<string | undefined>(
      keyLogApiUrl,
      "GET",
      {
        name: term,
      },
    );
    isTableLoading.value = false;
  }

  async function onFilterKeyByType(value: string) {
    isTableLoading.value = true;
    const data = await useLocalFetchUtil<string | undefined>(
      keyLogApiUrl,
      "GET",
      {
        passType: value,
      },
    );
    isTableLoading.value = false;
  }

  function setKey(data?: TKeyLog) {
    console.log("data", data);
    keyLog.value = data || new MKeyLog();
  }

  async function addKeyLog(_keyLog: TKeyLog) {
    isAdding.value = true;
    delete _keyLog._id;
    const data = await useLocalFetchUtil<{
      message: string | undefined;
    }>(keyLogApiUrl, "POST", _keyLog);
    isAdding.value = false;
    return data.message;
  }

  async function getKeyById(id: string) {
    const data = await useLocalFetchUtil<TKeyLog | undefined>(
      `${keyLogApiUrl}/${id}`,
      "GET",
    );
    if (data && typeof data === "object") {
      setKey(data);
    }
    return data;
  }

  async function updateKeyById(id: string, payload: TKeyLog) {
    payload.codes =
      payload.codes instanceof Array && payload.codes.length > 0
        ? payload.codes
        : [];
    const data = await useLocalFetchUtil<{
      message: { acknowledged: boolean };
    }>(`${keyLogApiUrl}/${id}`, "PUT", payload);
    return data.message;
  }

  async function deleteKeyById(id: string) {
    const data = await useLocalFetchUtil<{ message: TKeyLog }>(
      `${keyLogApiUrl}/${id}`,
      "DELETE",
      {
        _id: id,
      },
    );
    return data;
  }

  async function getKeysByKeyPageSearch({
    page = 1,
    search = "",
    limit = 10,
    site,
    serviceProvider,
    organization,
    startDateTime,
    endDateTime,
  }: {
    page?: number;
    search?: string | ISearch;
    limit?: number;
    site?: string;
    serviceProvider?: string;
    organization?: string;
    startDateTime?: string;
    endDateTime?: string;
  } = {}) {
    /*
      search here should accept
      empty string or ISearch
    */
    const data = await useLocalFetchUtil<TKeyLogResponse>(keyLogApiUrl, "GET", {
      page,
      search,
      limit,
      site,
      serviceProvider,
      organization,
      startDateTime,
      endDateTime,
    });
    return data;
  }

  async function setKeyLogs(
    site?: string,
    serviceProvider?: string,
    organization?: string,
    startDate?: string,
    endDate?: string,
  ) {
    try {
      isTableLoading.value = true;
      const _keyLogs = await getKeysByKeyPageSearch({
        page: page.value,
        search: search.value,
        limit: pageLimit.value,
        site: site,
        serviceProvider: serviceProvider,
        organization: organization,
      });
      keyLogs.value = _keyLogs.items;
      pageRange.value = _keyLogs.pageRange;
      pages.value = _keyLogs.pages;
      isTableLoading.value = false;
    } catch (error) {
      keyLogs.value = [];
      pageRange.value = "-- - -- of --";
      isTableLoading.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  function nextPage(
    { site, serviceProvider, startDate, endDate } = {} as {
      site?: string;
      serviceProvider?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    page.value++;
    setKeyLogs(site, serviceProvider, undefined, startDate, endDate);
  }

  const canPrevPage = computed(() => page.value <= 1);
  function prevPage(
    { site, serviceProvider, startDate, endDate } = {} as {
      site?: string;
      serviceProvider?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    page.value--;
    setKeyLogs(site, serviceProvider, undefined, startDate, endDate);
  }

  async function getPassList(
    { site, serviceProvider, passType } = {} as {
      site?: string;
      serviceProvider?: string;
      passType?: string;
    },
  ) {
    const response = await useLocalFetchUtil<TKeyLog[]>(passApiUrl, "GET", {
      site,
      serviceProvider,
      passType,
    });
    passList.value = response;
  }

  async function getKeyList(
    { site, serviceProvider } = {} as {
      site?: string;
      serviceProvider?: string;
    },
  ) {
    const response = await useLocalFetchUtil<TKeyLog[]>(keyApiUrl, "GET", {
      site,
      serviceProvider,
    });
    keyList.value = response;
  }

  async function getCountTotalKeys(
    { site } = {} as {
      site?: string;
    },
  ) {
    try {
      const response = await useLocalFetchUtil<TKeyLog[]>(
        keyLogApiUrl,
        "PATCH",
        {
          site,
        },
      );
      keyList.value = response;
      console.log("keyList", keyList.value);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  }

  async function getKeyWithSequence(
    { site, _id } = {} as {
      site?: string;
      _id?: string;
    },
  ) {
    try {
      const response = await useLocalFetchUtil<TKeyLog[]>(keyLogApiUrl, "PUT", {
        site,
        _id,
      });
      keyList.value = response;
      console.log("keyList", keyList.value);
      return response;
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return {
    onSearchKey,
    onFilterKeyByType,
    deleteKeyById,
    updateKeyById,
    getKeyById,
    addKeyLog,
    setKeyLogs,
    setKey,
    nextPage,
    prevPage,
    page,
    pages,
    pageRange,
    pageLimit,
    canNextPage,
    canPrevPage,
    keyLogs,
    keyLog,
    isTableLoading,
    isAdding,
    isKeyLogValid,
    getPassList,
    getKeyList,
    passList,
    keyList,
    passTypes,
    passTypesStatus,
    getCountTotalKeys,
    getKeyWithSequence,
  };
}
