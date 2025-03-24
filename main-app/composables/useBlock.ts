const { useLocalFetchUtil } = useUtils();

export default function useBlock() {
  class MBlock implements TBlock {
    _id?: string;
    name: string;
    organization?: string;
    site?: string;

    constructor(
      { _id = "", name = "", organization = "", site = "" } = {} as TBlock,
    ) {
      this._id = _id || "";
      this.name = name || "";
      this.organization = organization || "";
      this.site = site || "";
    }
  }

  const buildingApiUrl = "/api/building-management/v1";
  const block = useState("block", () => new MBlock());
  const blocks = useState("blocks", (): TBlock[] => []);
  const allBlocks = useState("allBlocks", (): TBlock[] => []);
  // const blockLists = useState("blockLists", (): TBlock[] => []);
  const page = useState("blockPage", () => 1);
  const pages = useState("blockPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("blockSearch", () => "");
  const pageRange = useState("blockPageRange", () => "-- - -- of --");
  const isBlockValid = useState("isBlockValid", () => false);
  const isBlocksLoaded = useState("isBlocksLoaded", () => false);
  const filterBySite = useState("filterBySite", () => "");

  function setBlock(data?: TBlock) {
    block.value = data || new MBlock();
  }

  async function getBlocksByPageSearch(
    {
      page = 1,
      limit = 10,
      search = "",
      organization = "",
      site = "",
    } = {} as {
      page?: number;
      limit?: number;
      search?: string;
      organization?: string;
      site?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/building-management/v1", {
      method: "GET",
      query: { page, search, site, limit },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getBlockById(id: string) {
    const { data, error } = await useLocalFetch(
      `/api/building-management/v1/${id}`,
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

  async function setBlocks(
    { organization, site, limit } = {} as {
      organization?: string;
      site?: string;
      limit?: number;
    },
  ) {
    try {
      isBlocksLoaded.value = true;
      const _blocks = (await getBlocksByPageSearch({
        page: page.value,
        search: search.value,
        site,
        limit,
      })) as TBlockResponse;

      blocks.value = _blocks.items as TBlock[];
      pageRange.value = _blocks.pageRange;
      pages.value = _blocks.pages;
      isBlocksLoaded.value = false;
    } catch (error) {
      blocks.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isBlocksLoaded.value = false;
    }
  }

  async function getAllBuildingBlocks(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    //
    const data = await useLocalFetchUtil<{ items: TBlock[] }>(
      `${buildingApiUrl}/all`,
      "GET",
      {
        site,
      },
    );
    blocks.value = data.items;
    return data;
  }

  async function upload(file: any) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/upload/v1",
      {
        method: "POST",
        body: file,
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

  async function addBlock(_block: TBlock) {
    const { error, data } = await useLocalFetch("/api/building-management/v1", {
      method: "POST",
      body: JSON.stringify(_block),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function deleteBlockbyId(id: string) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/v1/${id}`,
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

  async function updateBlockNameById(_block: TUpdateBlockNameOptions) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/v1/name/${_block._id}`,
      {
        method: "PUT",
        body: JSON.stringify({
          name: _block.name,
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

  async function getBlocksLists(organization: string, site: string) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/v1/all",
      {
        method: "GET",
        query: { organization, site },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  // Get All Blocks Without Pagination
  async function getAllBlocks(site: string) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/v1/allBlocks",
      {
        method: "GET",
        query: { site },
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
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value++;
    getBlocksByPageSearch({
      page: page.value,
      search: search.value,
      site,
    });
    setBlocks({ organization, site });
  }

  function prevPage(
    { organization, site } = {} as { organization?: string; site?: string },
  ) {
    page.value--;
    getBlocksByPageSearch({
      page: page.value,
      search: search.value,
      site,
    });
    setBlocks({ organization, site });
  }

  async function loadMore(
    { site } = {} as {
      site?: string;
    },
  ) {
    page.value++;
    const _blocks = (await getBlocksByPageSearch({
      page: page.value,
      search: search.value,
      site,
    })) as TBlockResponse;

    blocks.value = [...blocks.value, ..._blocks.items];
  }

  return {
    block,
    blocks,
    allBlocks,
    // blockLists,
    getBlocksLists,
    getAllBlocks,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setBlock,
    search,
    isBlocksLoaded,
    setBlocks,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    isBlockValid,
    addBlock,
    updateBlockNameById,
    deleteBlockbyId,
    getBlockById,
    filterBySite,
    upload,
    getAllBuildingBlocks,
    loadMore,
  };
}
