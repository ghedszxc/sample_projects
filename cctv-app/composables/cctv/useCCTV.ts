export default function useCctv() {
  class MCctv implements TCctv {
    _id?: string;
    name: string;
    ip: string;
    isActive: boolean;
    cctvBlock: string;

    constructor(cctv: Partial<TCctv> = {}) {
      this._id = cctv._id || "";
      this.name = cctv.name || "";
      this.ip = cctv.ip || "";
      this.isActive = cctv.isActive || false;
      this.cctvBlock = cctv.cctvBlock || "";
    }
  }

  const cctv = useState("cctv", () => new MCctv());
  const cctvs = useState("cctvs", (): TCctv[] => []);
  const blockCctvs = useState("blockCctvs", (): TBlockCctv[] => []);
  const page = useState("cctvPage", () => 1);
  const limit = useState("cctvLimit", () => 4);
  const pages = useState("cctvPages", () => 1);
  const search = useState("cctvSearch", () => "");
  const pageRange = useState("cctvPageRange", () => "-- - -- of --");
  const isCctvsLoaded = useState("isCctvsLoaded", () => false);
  const isCctvValid = useState("isCctvValid", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const filterBlocks = useState("filterBlocks", () => "");
  const filterLevels = useState("filterLevels", () => "");

  const cctvCameraInput = useState("cctvCameraInput", () => ({
    cameraName: "",
    cctvLink: "",
  }));
  const cctvCameras = useState("cctvCameras", (): any[] => []);

  const selectedItem = useState("selectedItem", () => 4);
  const filterPageNumber = useState("filterPageNumber", () => [
    1, 2, 4, 6, 8, 9, 10, 12,
  ]);

  async function getCctvById(id: string) {
    const { data, error } = await useLocalFetch(`/api/cctvs/${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getCctvsByBlockId(
    { page = 1, limit = 4, block = "" } = {} as {
      page?: number;
      limit?: number;
      block?: string;
    },
  ) {
    const { data, error } = await useLocalFetch(`/api/cctvs/block-cctvs`, {
      method: "GET",
      query: { page, limit, block },
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function addCCTV(form: TCctv) {
    const { error, data } = await useLocalFetch("/api/cctvs", {
      method: "POST",
      body: JSON.stringify(form),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function addCCTVBlock({
    organization = "",
    site = "",
    block = "",
    level = "",
    cctvCameras,
  }: {
    organization?: string;
    site: string;
    block: string;
    level: string;
    cctvCameras: { cameraName: string; cctvLink: string }[];
  }) {
    const { error, data } = await useLocalFetch("/api/cctvs", {
      method: "POST",
      body: JSON.stringify({
        organization,
        site,
        block,
        level,
        cctvCameras,
      }),
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result);
    }
  }

  async function getCctvBlockById(id: string, site?: string) {
    const { error, data } = await useLocalFetch("/api/cctvs/get-cctv-block", {
      method: "GET",
      query: { id, site },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function updateCCTV(form: any) {
    let _id = form._id;
    delete form._id;
    const { data, error } = await useLocalFetch(`/api/cctvs/${_id}`, {
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

  async function updateCctvBlock(
    id: string,
    block: string,
    level: string,
    cctvItems: any,
  ) {
    try {
      const { data, error } = await useLocalFetch(
        `/api/cctvs/update-block/${id}`,
        {
          method: "PUT",
          body: JSON.stringify({ block, level, cctvItems }),
        },
      );

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message as string);
      }

      return Promise.resolve(data.value);
    } catch (error: any) {
      return Promise.reject(error.message || error);
    }
  }

  async function deleteCctvBlock(id: string) {
    try {
      const { data, error } = await useLocalFetch(
        `/api/cctvs/delete-block/${id}`,
        {
          method: "DELETE",
        },
      );

      if (error && error.value && error.value.data) {
        return Promise.reject(error.value.data.message as string);
      }

      return Promise.resolve(data.value);
    } catch (error: any) {
      return Promise.reject(error.message || error);
    }
  }

  async function updateCCTVIpName(cctvData: TCctv) {
    let _id = cctvData._id;
    delete cctvData._id;
    const { data, error } = await useLocalFetch(`/api/cctvs/ip-name/${_id}`, {
      method: "PUT",
      body: JSON.stringify(cctvData),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function captureCctvFeed(url: string) {
    const screenshotUrl = insertScreenshot(url);

    const { data, error } = await useLocalFetch(screenshotUrl, {
      method: "GET",
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function recordCctvFeed(payload: any) {
    const { error, data } = await useLocalFetch(
      `/api/storage/upload/digital-ocean`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  function insertScreenshot(cctvUrl: string) {
    const urlParts = cctvUrl.split("/");

    urlParts.splice(urlParts.length - 1, 0, "screenshot");

    const newUrl = urlParts.join("/");

    return newUrl;
  }

  async function deleteCCTV(id: string) {
    const { error, data } = await useLocalFetch(`/api/cctvs/${id}`, {
      method: "DELETE",
      body: "",
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  function setCctv(data?: TCctv) {
    cctv.value = new MCctv(data);
  }

  async function getCctvsByPageSearch(
    { page = 1, search = "", organization = "", site, date } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
      date?: Date | string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/cctvs", {
      method: "GET",
      query: { page, search, organization, site, date },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getBlockInfo({ block = "" } = {} as { block: string }) {
    const { error, data } = await useLocalFetch("/api/cctvs/get-info", {
      method: "GET",
      query: { block },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setCctvs(
    { pageVal = 1, searchVal = "", organization = "", site, date } = {} as {
      pageVal?: number;
      searchVal?: string;
      organization?: string;
      site?: string;
      date?: Date | string;
    },
  ) {
    try {
      isCctvsLoaded.value = true;
      const _cctvs = (await getCctvsByPageSearch({
        page: pageVal || page.value,
        search: searchVal || search.value,
        organization,
        site,
        date,
      })) as TGetCctvsByPageSearchResponse;
      cctvs.value = _cctvs.items as TCctv[];
      pageRange.value = _cctvs.pageRange;
      pages.value = _cctvs.pages;
      isCctvsLoaded.value = false;
    } catch (error) {
      isCctvsLoaded.value = false;
    }
  }

  async function setBlockCctvs({ block } = {} as { block: string }) {
    try {
      isCctvsLoaded.value = true;
      const _cctvs = (await getCctvsByBlockId({
        page: page.value,
        limit: limit.value,
        block: block,
      })) as TGetCctvsByBlockIdResponse;
      blockCctvs.value = _cctvs.items as TBlockCctv[];
      pages.value = _cctvs.pages;
      isCctvsLoaded.value = false;
    } catch (error) {
      isCctvsLoaded.value = false;
    }
  }

  async function getBlocks(
    { organization, site } = {} as { organization?: string; site: string },
  ) {
    const { data, error } = await useLocalFetch(`/api/cctvs/blocks`, {
      method: "GET",
      query: { organization, site },
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      const filterData = data.value.items.map((item: any) => {
        return {
          _id: item._id,
          name: `${item.block.name} ${item.level.level} - Total Cam: ${item.totalCamCount}`,
        };
      });
      return Promise.resolve(filterData);
    }
  }

  async function getCctvOfBlock({ block } = {} as { block: string }) {
    const { data, error } = await useLocalFetch(`/api/cctvs/list`, {
      method: "GET",
      query: { block },
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value++;
    setCctvs({
      pageVal: page.value,
      searchVal: search.value,
      organization,
      site,
    });
  }

  function prevPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value--;
    setCctvs({
      pageVal: page.value,
      searchVal: search.value,
      organization,
      site,
    });
  }

  function getTotalCCTVs() {
    return pageRange.value.split(" of ")[1].trim();
  }

  async function upload(file: any) {
    const { error, data } = await useLocalFetch("/api/cctvs/upload", {
      method: "POST",
      body: file,
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  return {
    cctv,
    cctvs,
    blockCctvs,
    page,
    pages,
    limit,
    pageRange,
    setCctv,
    isCctvsLoaded,
    isCreate,
    isUpdate,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    setCctvs,
    setBlockCctvs,
    isCctvValid,
    addCCTV,
    addCCTVBlock,
    updateCCTV,
    captureCctvFeed,
    deleteCCTV,
    updateCCTVIpName,
    getCctvById,
    getCctvsByBlockId,
    updateCctvBlock,
    getTotalCCTVs,
    getBlockInfo,
    filterOrganization,
    filterSite,
    filterBlocks,
    filterLevels,

    getBlocks,
    getCctvOfBlock,

    selectedItem,
    filterPageNumber,

    cctvCameraInput,
    cctvCameras,

    getCctvBlockById,
    deleteCctvBlock,
    upload,

    recordCctvFeed,
  };
}
