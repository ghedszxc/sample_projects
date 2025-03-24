export default function useBlockLevel() {
  class MBlockLevel implements TBlockLevel {
    _id?: string;
    block?: string;
    level: string;
    organization?: string;

    constructor(
      {
        _id = "",
        block = "",
        level = "",
        organization = "",
      } = {} as TBlockLevel,
    ) {
      this._id = _id || "";
      this.block = block || "";
      this.level = level || "";
      this.organization = organization || "";
    }
  }

  const blockLevelApiUrl = "/api/building-management/levels/v1";
  const blockLevel = useState("blockLevel", () => new MBlockLevel());
  const blockLevels = useState("blockLevels", (): TBlockLevel[] => []);
  const allBlockLevels = useState("allBlockLevels", (): TBlockLevel[] => []);
  const page = useState("blockLevelPage", () => 1);
  const pages = useState("blockLevelPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("blockLevelSearch", () => "");
  const pageRange = useState("blockLevelPageRange", () => "-- - -- of --");
  const isBlockLevelValid = useState("isBlockLevelValid", () => false);
  const isBlockLevelsLoaded = useState("isBlockLevelsLoaded", () => false);

  function setBlockLevel(data?: TBlockLevel) {
    blockLevel.value = data || new MBlockLevel();
  }

  async function getBlockLevelsByPageSearch(
    { page = 1, search = "", organization = "", block = "" } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      block?: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/levels/v1",
      {
        method: "GET",
        query: { page, search, organization, block },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getBlockLevelById(id: string) {
    const { data, error } = await useLocalFetch(
      `/api/building-management/levels/v1/${id}`,
      {
        method: "GET",
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setBlockLevels(
    { organization, block } = {} as {
      organization?: string;
      block?: string;
    },
  ) {
    try {
      isBlockLevelsLoaded.value = true;
      const _blockLevels = (await getBlockLevelsByPageSearch({
        page: page.value,
        search: search.value,
        organization,
        block,
      })) as TBlockLevelResponse;
      blockLevels.value = _blockLevels.items as TBlockLevel[];
      pageRange.value = _blockLevels.pageRange;
      pages.value = _blockLevels.pages;
      isBlockLevelsLoaded.value = false;
    } catch (error) {
      blockLevels.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isBlockLevelsLoaded.value = false;
    }
  }

  async function getAllLevel(
    { organization, site, block } = {} as {
      organization?: string;
      site?: string;
      block?: string;
    },
  ) {
    //
    console.log("organizar", organization, site, block);
    const { useLocalFetchUtil } = useUtils();
    const data = (await useLocalFetchUtil(
      `${blockLevelApiUrl}/alllevels`,
      "GET",
      {
        organization,
        site,
        block,
      },
    )) as { items: TBlockLevel[] };
    blockLevels.value = data.items as TBlockLevel[];
    return data;
  }

  async function addBlockLevel(_blockLevel: TBlockLevel) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/levels/v1",
      {
        method: "POST",
        body: JSON.stringify(_blockLevel),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function deleteBlockLevelById(id: string) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/levels/v1/${id}`,
      {
        method: "DELETE",
        body: "",
      },
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateBlockLevelNameById(
    _level: TUpdateBlockLevelNameOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/levels/v1/level/${_level._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          level: _level.level,
          updatedAt: new Date().toLocaleDateString(),
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function getAllLevelsByBlock(block: string) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/levels/v1/alllevels",
      {
        method: "GET",
        query: { block },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  // Get All Levels Using Block Without Pagination
  async function getAllLevelsUsingBlock(block: string, site?: string) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/levels/v1/allLevelsUsingBlock",
      {
        method: "GET",
        query: { block, site },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, block } = {} as {
      organization?: string;
      block?: string;
    },
  ) {
    page.value++;
    getBlockLevelsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      block,
    });
    setBlockLevels({ organization, block });
  }

  function prevPage(
    { organization, block } = {} as {
      organization?: string;
      block?: string;
    },
  ) {
    page.value--;
    getBlockLevelsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      block,
    });
    setBlockLevels({ organization, block });
  }

  async function loadMore(
    { organization, block } = {} as {
      organization?: string;
      block?: string;
    },
  ) {
    page.value++;
    const _blockLevels = (await getBlockLevelsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      block,
    })) as TBlockLevelResponse;

    blockLevels.value = [...blockLevels.value, ..._blockLevels.items];
  }

  return {
    blockLevel,
    blockLevels,
    getAllLevelsByBlock,
    getBlockLevelsByPageSearch,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setBlockLevel,
    search,
    isBlockLevelsLoaded,
    setBlockLevels,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    isBlockLevelValid,
    addBlockLevel,
    updateBlockLevelNameById,
    deleteBlockLevelById,
    getBlockLevelById,
    getAllLevel,
    allBlockLevels,
    getAllLevelsUsingBlock,
    loadMore,
  };
}
