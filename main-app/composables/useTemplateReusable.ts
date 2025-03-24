export default function useTemplateReusable() {
  class MQrCodeTemplate implements TQrCodeTemplate {
    _id?: string;
    name: string;
    createdAt?: Date;
    updatedAt?: Date;
    updatedBy?: string;
    site: string;
    status?: string;
    A4Enabled?: boolean;
    A4Orientation?: string;
    A4FrontWysiwyg?: string;
    A4FrontQRCodeTop?: number;
    A4FrontQRCodeLeft?: number;
    A4FrontQRCodeSize?: number;
    A4FrontPassSize?: number;
    A4FrontPassTop?: number;
    A4FrontPassLeft?: number;
    A4BackWysiwyg?: string;
    A4BackQRCodeTop?: number;
    A4BackQRCodeLeft?: number;
    A4BackQRCodeSize?: number;
    A4BackPassSize?: number;
    A4BackPassTop?: number;
    A4BackPassLeft?: number;
    CCEnabled?: boolean;
    CCOrientation?: string;
    CCFrontWysiwyg?: string;
    CCFrontQRCodeTop?: number;
    CCFrontQRCodeLeft?: number;
    CCFrontQRCodeSize?: number;
    CCFrontPassSize?: number;
    CCFrontPassTop?: number;
    CCFrontPassLeft?: number;
    CCBackWysiwyg?: string;
    CCBackQRCodeTop?: number;
    CCBackQRCodeLeft?: number;
    CCBackQRCodeSize?: number;
    CCBackPassSize?: number;
    CCBackPassTop?: number;
    CCBackPassLeft?: number;
    prefixPass?: string;
    A4FrontQREnabled?: boolean;
    A4BackQREnabled?: boolean;
    CCBackQREnabled?: boolean;
    CCFrontQREnabled?: boolean;
    // prefixKey?: string;

    constructor(
      {
        _id = "",
        name = "",
        createdAt,
        updatedAt,
        updatedBy,
        site,
        status = "",
        A4Enabled = false,
        A4Orientation = "portrait",
        A4FrontWysiwyg = "",
        A4FrontQRCodeTop = 0,
        A4FrontQRCodeLeft = 0,
        A4FrontQRCodeSize = 0,
        A4FrontPassSize = 0,
        A4FrontPassTop = 0,
        A4FrontPassLeft = 0,
        A4BackWysiwyg = "",
        A4BackQRCodeTop = 0,
        A4BackQRCodeLeft = 0,
        A4BackQRCodeSize = 0,
        A4BackPassSize = 0,
        A4BackPassTop = 0,
        A4BackPassLeft = 0,
        CCEnabled = false,
        CCOrientation = "portrait",
        CCFrontWysiwyg = "",
        CCFrontQRCodeTop = 0,
        CCFrontQRCodeLeft = 0,
        CCFrontQRCodeSize = 0,
        CCFrontPassSize = 0,
        CCFrontPassTop = 0,
        CCFrontPassLeft = 0,
        CCBackWysiwyg = "",
        CCBackQRCodeTop = 0,
        CCBackQRCodeLeft = 0,
        CCBackQRCodeSize = 0,
        CCBackPassSize = 0,
        CCBackPassTop = 0,
        CCBackPassLeft = 0,
        prefixPass = "",
        A4FrontQREnabled = false,
        A4BackQREnabled = false,
        CCBackQREnabled = false,
        CCFrontQREnabled = false,
        // prefixKey = "",
      } = {} as TQrCodeTemplate,
    ) {
      this._id = _id;
      this.name = name;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.updatedBy = updatedBy;
      this.site = site;
      this.status = status;
      this.A4Enabled = A4Enabled;
      this.A4Orientation = A4Orientation;
      this.A4FrontWysiwyg = A4FrontWysiwyg;
      this.A4FrontQRCodeTop = A4FrontQRCodeTop;
      this.A4FrontQRCodeLeft = A4FrontQRCodeLeft;
      this.A4FrontQRCodeSize = A4FrontQRCodeSize;
      this.A4FrontPassSize = A4FrontPassSize;
      this.A4FrontPassTop = A4FrontPassTop;
      this.A4FrontPassLeft = A4FrontPassLeft;
      this.A4BackWysiwyg = A4BackWysiwyg;
      this.A4BackQRCodeTop = A4BackQRCodeTop;
      this.A4BackQRCodeLeft = A4BackQRCodeLeft;
      this.A4BackQRCodeSize = A4BackQRCodeSize;
      this.A4BackPassSize = A4BackPassSize;
      this.A4BackPassTop = A4BackPassTop;
      this.A4BackPassLeft = A4BackPassLeft;
      this.CCEnabled = CCEnabled;
      this.CCOrientation = CCOrientation;
      this.CCFrontWysiwyg = CCFrontWysiwyg;
      this.CCFrontQRCodeTop = CCFrontQRCodeTop;
      this.CCFrontQRCodeLeft = CCFrontQRCodeLeft;
      this.CCFrontQRCodeSize = CCFrontQRCodeSize;
      this.CCFrontPassSize = CCFrontPassSize;
      this.CCFrontPassTop = CCFrontPassTop;
      this.CCFrontPassLeft = CCFrontPassLeft;
      this.CCBackWysiwyg = CCBackWysiwyg;
      this.CCBackQRCodeTop = CCBackQRCodeTop;
      this.CCBackQRCodeLeft = CCBackQRCodeLeft;
      this.CCBackQRCodeSize = CCBackQRCodeSize;
      this.CCBackPassSize = CCBackPassSize;
      this.CCBackPassTop = CCBackPassTop;
      this.CCBackPassLeft = CCBackPassLeft;
      this.prefixPass = prefixPass;
      this.A4FrontQREnabled = A4FrontQREnabled;
      this.A4BackQREnabled = A4BackQREnabled;
      this.CCBackQREnabled = CCBackQREnabled;
      this.CCFrontQREnabled = CCFrontQREnabled;
      // this.prefixKey = prefixKey;
    }
  }
  const tab = useState("templatesTab", () => "active");
  const templateQrCode = useState(
    "templateQrCode",
    () => new MQrCodeTemplate(),
  );
  const templateQrCodes = useState(
    "templateQrCodes",
    (): TQrCodeTemplate[] => [],
  );
  const page = useState("templatesPage", () => 1);
  const pages = useState("templatesPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("templateSearch", () => "");

  const pageRange = useState("templatesPageRange", () => "-- - -- of --");
  const isTemplatesLoading = useState("isTemplatesLoading", () => false);

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function setTemplate(data?: TQrCodeTemplate) {
    templateQrCode.value = data || new MQrCodeTemplate();
  }

  async function setTemplates(
    {
      _id,
      sites,
      search,
      name,
      statuses,
      //date
    } = {} as {
      _id?: string;
      sites?: string[];
      search?: string;
      name?: string;
      statuses?: string[];
      //date?: any;
    },
  ) {
    try {
      isTemplatesLoading.value = true;
      const _templateQrCodes = (await getTemplatesByPageSearch({
        _id,
        page: page.value,
        search: search,
        name,
        sites,
        statuses,
        //date,
      })) as TQrCodeTemplateResponse;

      templateQrCodes.value = _templateQrCodes.items as TQrCodeTemplate[];
      pageRange.value = _templateQrCodes.pageRange;
      pages.value = _templateQrCodes.pages;
      isTemplatesLoading.value = false;
    } catch (error) {
      templateQrCodes.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isTemplatesLoading.value = false;
    }
  }

  async function getTemplatesByPageSearch({
    _id = "",
    page = 1,
    search = "",
    name = "",
    limit = 10,
    sites = [],
    statuses = [],
    //date = "",
  }: {
    _id?: string;
    page?: number;
    search?: string;
    name?: string;
    sites?: string[];
    limit?: number;
    statuses?: string[];
    //date?: any;
  }) {
    const { error, data } = await useLocalFetch("/api/qr-code-templates/v1", {
      method: "PATCH",
      body: JSON.stringify({
        _id,
        page,
        search,
        name,
        limit,
        sites,
        statuses,
        //date,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

  async function getTemplatesByPageSearchReusable({
    dataArgument,
    method = "GET",
  }: {
    dataArgument: any;
    method?: HttpMethod;
  }) {
    const { error, data } = await useLocalFetch("/api/qr-code-templates/v1", {
      method,
      body: JSON.stringify(dataArgument),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addQrCodeTemplate(templateQrCode: TQrCodeTemplate) {
    const { error, data } = await useLocalFetch("/api/qr-code-templates/v1", {
      method: "POST",
      body: JSON.stringify(new MQrCodeTemplate(templateQrCode)),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateTemplateStatus({
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
    {
      sites,
      search,
      // name,
      statuses,
      //date
    } = {} as {
      sites?: string[];
      search?: string;
      // name?: string;
      statuses?: string[];
      //date?: any;
    },
  ) {
    page.value++;
    setTemplates({
      sites,
      search,
      // name,
      statuses,
      //date,
    });
  }

  function prevPage(
    {
      sites,
      search,
      //  name,
      statuses,
      //date
    } = {} as {
      sites?: string[];
      search?: string;
      // name?: string;
      statuses?: string[];
      //date?: any;
    },
  ) {
    page.value--;
    setTemplates({
      sites,
      search,
      //  name,
      statuses,
      //date,
    });
  }

  return {
    tab,
    templateQrCode,
    templateQrCodes,
    search,
    setTemplates,
    setTemplate,
    getTemplatesByPageSearch,
    isTemplatesLoading,
    page,
    itemsPerPage,
    pageRange,
    canNextPage,
    nextPage,
    prevPage,
    canPrevPage,
    addQrCodeTemplate,
    getTemplatesByPageSearchReusable,
    updateTemplateStatus,
  };
}
