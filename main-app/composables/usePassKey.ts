export default function usePassKey() {
  class MPassKey implements TPassKey {
    _id?: string;
    passId?: string;
    templateId?: string;
    templateName?: string;
    roomName?: string;
    createdAt?: Date;
    site: string;
    status?: string;

    constructor(
      {
        _id = "",
        passId = "",
        templateId = "",
        templateName = "",
        roomName = "",
        createdAt,
        site = "",
        status = "",
      } = {} as TPassKey,
    ) {
      this._id = _id;
      this.passId = passId;
      this.templateId = templateId;
      this.templateName = templateName;
      this.roomName = roomName;
      this.createdAt = createdAt;
      this.site = site;
      this.status = status;
    }
  }
  const tab = useState("passKeyTab", () => "pass");
  const passKey = useState("passKey", () => new MPassKey());
  const passKeys = useState("passKeys", (): TPassKey[] => []);
  const page = useState("passKeyPage", () => 1);
  const pages = useState("passKeyPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("passKeySearch", () => "");
  const filterByTemplateName = useState("filterByTemplateName", () => "All");
  const pageRange = useState("passKeyPageRange", () => "-- - -- of --");
  const isPassKeysLoading = useState("isPassKeysLoading", () => false);

  const isPassListLoading = useState("isPassListLoading", () => false);
  const isKeyListLoading = useState("isKeyListLoading", () => false);

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  const dialog = useState("passKeysDialog", () => false);
  const dialogType = useState("passKeysDialogType", () => "");
  const generatePass = useState("passKeysGeneratePass", () => false);

  const selectedTemplate = useState("passKeySelectedTemplate", (): any => null);

  const selectedKeysToPrint = useState("passKeysSelectedToPrint", () => []);

  async function getNextNumber(
    { template = "", passType = "", site = "" } = {} as {
      template?: any | null;
      passType?: any | null;
      site?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/keys/generate/v1", {
      method: "PATCH",
      body: JSON.stringify({
        template,
        passType,
        site,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  function setPassKey(data?: TPassKey) {
    passKey.value = data || new MPassKey();
  }

  async function setPassKeys(
    { search, passTypes, template, sites, statuses } = {} as {
      search?: string;
      passTypes?: string[] | null;
      template?: any | null;
      sites?: string[];
      statuses?: string[] | null;
    },
  ) {
    try {
      isPassKeysLoading.value = true;
      const _passKeys = (await getPassKeysByPageSearch({
        page: page.value,
        search,
        passTypes,
        template,
        sites,
        statuses,
      })) as TPassKeyResponse;

      passKeys.value = _passKeys.items as TPassKey[];
      pageRange.value = _passKeys.pageRange;
      pages.value = _passKeys.pages;
      isPassKeysLoading.value = false;
    } catch (error) {
      passKeys.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isPassKeysLoading.value = false;
    }
  }

  async function getPassKeysByPageSearch({
    _ids = [],
    page = 1,
    limit = 10,
    search = "",
    passTypes = [],
    template = "",
    sites = [],
    passOrKey = "",
    statuses = [],
    sortBy,
    prefixAndName,
  }: {
    _ids?: any;
    page?: number;
    limit?: number;
    search?: string;
    passTypes?: string[] | null;
    template?: any | null;
    sites?: string[];
    passOrKey?: string;
    statuses?: string[] | null;
    sortBy?: object;
    prefixAndName?: string;
  }) {
    const { error, data } = await useLocalFetch("/api/keys/search/v1", {
      method: "POST",
      body: JSON.stringify({
        _ids,
        page,
        limit,
        search,
        passTypes,
        template,
        sites,
        passOrKey,
        statuses,
        sortBy,
        prefixAndName,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function generatePassesKeys(
    {
      template = "",
      passType = "",
      site = "",
      quantity = 0,
      nextNumber = 0,
    } = {} as {
      template?: any | null;
      passType?: any | null;
      site?: any;
      quantity?: number | null;
      nextNumber: number;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/keys/generate/v1", {
      method: "POST",
      body: JSON.stringify({
        template,
        passType,
        site,
        quantity,
        nextNumber,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function updatePassKeyStatus({
    _id,
    site,
    status,
  }: {
    _id?: string;
    site?: string;
    status?: string;
  }) {
    const { error, data } = await useLocalFetch("/api/qr-code-templates/v1", {
      method: "PUT",
      body: JSON.stringify({ _id, site, status }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  function nextPage(
    { search, passTypes, template, sites, statuses } = {} as {
      search?: string;
      passTypes?: string[] | null;
      template?: any | null;
      sites?: string[];
      statuses?: string[] | null;
    },
  ) {
    page.value++;
    setPassKeys({
      search,
      passTypes,
      template,
      sites,
      statuses,
    });
  }

  function prevPage(
    { search, passTypes, template, sites, statuses } = {} as {
      search?: string;
      passTypes?: string[] | null;
      template?: any | null;
      sites?: string[];
      statuses?: string[] | null;
    },
  ) {
    page.value--;
    setPassKeys({
      search,
      passTypes,
      template,
      sites,
      statuses,
    });
  }

  return {
    tab,
    passKey,
    passKeys,
    search,
    filterByTemplateName,
    setPassKeys,
    setPassKey,
    getPassKeysByPageSearch,
    isPassKeysLoading,
    itemsPerPage,
    page,
    pages,
    pageRange,
    canNextPage,
    nextPage,
    prevPage,
    canPrevPage,
    getNextNumber,
    generatePassesKeys,
    updatePassKeyStatus,
    isPassListLoading,
    isKeyListLoading,
    dialog,
    dialogType,
    generatePass,
    selectedTemplate,
    selectedKeysToPrint,
  };
}
