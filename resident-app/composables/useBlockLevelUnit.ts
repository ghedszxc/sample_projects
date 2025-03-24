const { useLocalFetchUtil } = useUtils();

export default function useBlockLevelUnit() {
  class MBlockLevelUnit implements TBlockLevelUnit {
    _id?: string;
    category: string;
    name: string;
    businessName: string;
    email: string;
    contact_number: string;
    resident: string;
    block: string;
    level: string;
    organization?: string;

    constructor(
      {
        _id = "",
        category = "",
        name = "",
        businessName = "",
        email = "",
        contact_number = "",
        resident = "",
        block = "",
        level = "",
        organization = "",
      } = {} as TBlockLevelUnit,
    ) {
      this._id = _id || "";
      this.category = category || "";
      this.name = name || "";
      this.businessName = businessName || "";
      this.email = email || "";
      this.contact_number = contact_number || "";
      this.resident = resident || "";
      this.block = block || "";
      this.level = level || "";
      this.organization = organization || "";
    }
  }

  const blockLevelUnitApiUrl = "/api/building-management/units/v1/";
  const unit = useState("unit", () => new MBlockLevelUnit());
  const units = useState("units", (): TBlockLevelUnit[] => []);
  const page = useState("unitPage", () => 1);
  const pages = useState("unitPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("unitSearch", () => "");
  const pageRange = useState("unitPageRange", () => "-- - -- of --");
  const isUnitValid = useState("isUnitValid", () => false);
  const isUnitsLoaded = useState("isUnitsLoaded", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterByCategory = useState("filterByCategory", () => "All");

  function setUnit(data?: TBlockLevelUnit) {
    unit.value = data || new MBlockLevelUnit();
  }

  async function getUnitsByPageSearch(
    {
      page = 1,
      search = "",
      organization = "",
      block = "",
      level = "",
      category = "",
    } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      block?: string;
      level?: string;
      category?: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1",
      {
        method: "GET",
        query: { page, search, organization, block, level, category },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getUnitById(id: string) {
    const { data, error } = await useLocalFetch(
      `/api/building-management/units/v1/${id}`,
      {
        method: "GET",
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      console.log(data.value);

      return Promise.resolve(data.value);
    }
  }

  async function getBlockLevelUnitsById(id: string) {
    const { data, error } = await useLocalFetch(
      `/api/building-management/units/v1/view/${id}?page=1`,
      {
        method: "GET",
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      console.log(data.value);

      return Promise.resolve(data.value);
    }
  }

  async function setUnits(
    { organization, block, level, category } = {} as {
      organization?: string;
      block?: string;
      level?: string;
      category?: string;
    },
  ) {
    try {
      isUnitsLoaded.value = true;
      const _units = (await getUnitsByPageSearch({
        page: page.value,
        search: search.value,
        organization,
        block,
        level,
        category,
      })) as TBlockLevelUnitResponse;
      units.value = _units.items as TBlockLevelUnit[];
      pageRange.value = _units.pageRange;
      pages.value = _units.pages;
      isUnitsLoaded.value = false;
    } catch (error) {
      units.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isUnitsLoaded.value = false;
    }
  }

  async function getAllUnits(
    { organization, site, block, level } = {} as {
      organization?: string;
      site?: string;
      block?: string;
      level?: string;
    },
  ) {
    //
    const data = (await useLocalFetchUtil(
      `${blockLevelUnitApiUrl}/all-units`,
      "GET",
      {
        organization,
        site,
        block,
        level,
      },
    )) as { items: TBlockLevelUnit[] };
    units.value = data.items as TBlockLevelUnit[];
    return data;
  }

  async function addUnit(_unit: TBlockLevelUnit) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1",
      {
        method: "POST",
        body: JSON.stringify(_unit),
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

  async function updateUnitById(_unit: TUpdateUnitOptions) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/units/v1/${_unit._id}`,
      {
        method: "PUT",
        body: JSON.stringify(_unit),
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

  async function deleteUnitById(id: string) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/units/v1/${id}`,
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

  async function getAllUnitsByBlockAndLevel(block: string, level: string) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1/allunits",
      {
        method: "GET",
        query: { block, level },
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
    { organization, block, level, category } = {} as {
      organization?: string;
      block?: string;
      level?: string;
      category?: string;
    },
  ) {
    page.value++;

    getUnitsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      block,
      level,
      category,
    });
    setUnits({ organization, block, level, category });
  }

  function prevPage(
    { organization, block, level, category } = {} as {
      organization?: string;
      block?: string;
      level?: string;
      category?: string;
    },
  ) {
    page.value--;
    getUnitsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      block,
      level,
      category,
    });
    setUnits({ organization, block, level, category });
  }

  async function getBlockLevelUnitsByPageSearch(
    {
      page = 1,
      search = "",
      organization = "",
      category = "",
      site,
      unit,
    } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      category?: string;
      unit?: string;
      site: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1/allBlockLevelUnits/",
      {
        method: "GET",
        query: { page, search, category, site, unit },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function loadMore(
    { organization, category, site } = {} as {
      organization?: string;
      category?: string;
      site: string;
    },
  ) {
    page.value++;
    const _units = (await getBlockLevelUnitsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      category,
      site,
    })) as TBlockLevelUnitResponse;

    units.value = [...units.value, ..._units.items];
  }

  return {
    unit,
    units,
    getAllUnitsByBlockAndLevel,
    getUnitsByPageSearch,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setUnit,
    search,
    isUnitsLoaded,
    isCreate,
    isUpdate,
    setUnits,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    isUnitValid,
    addUnit,
    updateUnitById,
    deleteUnitById,
    getUnitById,
    filterByCategory,
    getAllUnits,
    getBlockLevelUnitsByPageSearch,
    getBlockLevelUnitsById,
    loadMore,
  };
}
