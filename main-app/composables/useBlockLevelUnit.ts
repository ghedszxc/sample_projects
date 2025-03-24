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
    uploadedDocuments?: TUploadedDocument[];

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
        uploadedDocuments = [],
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
      this.uploadedDocuments = uploadedDocuments || [];
    }
  }

  const blockLevelUnitApiUrl = "/api/building-management/units/v1";
  const unit = useState("unit", () => new MBlockLevelUnit());
  const units = useState("units", (): TBlockLevelUnit[] => []);
  const allUnits = useState("allUnits", (): TBlockLevelUnit[] => []);
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
  const filterBySite = useState("filterBySite", () => "");
  const isUploadDocValid = useState("isUploadDocValid", () => false);
  const isLocationValid = useState("isLocationValid", () => false);
  const filterBlocks = useState("filterBlocks", () => "");
  const filterLevels = useState("filterLevels", () => "");
  const assignDialog = useState("assignDialog", () => false);
  const selectedCardItem = useState("selectedCardItem", () => null);

  const deleteDialog = useState("deleteDialog", () => false);

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

  async function getBlockLevelUnitsByPageSearch(
    { page = 1, search = "", organization = "", category = "", site } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      category?: string;
      site: string;
    },
  ) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1/allBlockLevelUnits/",
      {
        method: "GET",
        query: { page, search, category, site },
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

  async function setBlockLevelUnits(
    { organization, category, site } = {} as {
      organization?: string;
      category?: string;
      site: string;
    },
  ) {
    try {
      isUnitsLoaded.value = true;
      const _units = (await getBlockLevelUnitsByPageSearch({
        page: page.value,
        search: search.value,
        organization,
        category,
        site,
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
    const data = await useLocalFetchUtil<{ items: TBlockLevelUnit[] }>(
      `${blockLevelUnitApiUrl}/all-units`,
      "GET",
      {
        organization,
        site,
        block,
        level,
      },
    );
    units.value = data.items;
    return data;
  }

  async function getAllUnitsUsingLevel(
    { organization, site, block, level } = {} as {
      organization?: string;
      site?: string;
      block?: string;
      level?: string;
    },
  ) {
    //
    const data = await useLocalFetchUtil<{ items: TItemUnits[] }>(
      `${blockLevelUnitApiUrl}/allUnitsUsingLevel`,
      "GET",
      {
        site,
        block,
        level,
        organization,
      },
    );
    // units.value = data.items;
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
      return Promise.resolve(result.value);
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

  async function uploadDocumentById(_id: string, document: TUploadedDocument) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/units/v1/upload/${_id}`,
      {
        method: "PUT",
        body: JSON.stringify(document),
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

  async function deleteDocumentById(_id: string, name: string, file: string) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/units/v1/delete-doc/${_id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: name, file: file }),
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

  async function addLocation({
    category,
    unit,
    level,
    block,
    organization,
    site,
  }: {
    category: string;
    unit: string | undefined;
    level: string;
    block: string;
    organization: string;
    site: string;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1/location",
      {
        method: "POST",
        body: JSON.stringify({
          category,
          unit,
          level,
          block,
          organization,
          site,
        }),
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

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, category, site } = {} as {
      organization?: string;
      category?: string;
      site: string;
    },
  ) {
    page.value++;
    setBlockLevelUnits({ organization, category, site });
  }

  function prevPage(
    { organization, category, site } = {} as {
      organization?: string;
      category?: string;
      site: string;
    },
  ) {
    page.value--;
    setBlockLevelUnits({ organization, category, site });
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

  async function createUnitSetup(_id: string, payload: any) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/units/v1/owner/${_id}`,
      {
        method: "PUT",
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

  const unitSetupDetails = useState("unitSetupDetails", () => null);

  async function viewUnitSetup(_id: string, page: number, search: string) {
    try {
      isUnitsLoaded.value = true;
      const result = await useLocalFetch(
        `/api/building-management/units/v1/view/${_id}`,
        {
          method: "GET",
          query: { page, search },
        },
      );
      unitSetupDetails.value = result.data.value as any;
      pageRange.value = unitSetupDetails.value
        ? unitSetupDetails.value.residents.pageRange
        : "-- - -- of --";
      pages.value = unitSetupDetails.value
        ? unitSetupDetails.value.residents.pages
        : 0;
      isUnitsLoaded.value = false;
    } catch (error) {
      unitSetupDetails.value = null;
      isUnitsLoaded.value = false;
    }
  }

  async function onDeleteResidentTenant(_id: string) {
    try {
      isUnitsLoaded.value = true;
      await useLocalFetch(
        `/api/building-management/units/v1/remove-resident/${_id}`,
        {
          method: "PUT",
        },
      );
      isUnitsLoaded.value = false;
    } catch (error) {
      isUnitsLoaded.value = false;
    }
  }

  const transferAccessCardDialog = useState(
    "transferAccessCardDialog",
    () => false,
  );
  const reactiveDeactiveAccessCardDialog = useState(
    "reactiveDeactiveAccessCardDialog",
    () => false,
  );

  return {
    unit,
    units,
    allUnits,
    getAllUnitsByBlockAndLevel,
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
    filterBySite,
    getAllUnits,
    getAllUnitsUsingLevel,
    loadMore,
    setBlockLevelUnits,
    isUploadDocValid,
    uploadDocumentById,
    isLocationValid,
    filterBlocks,
    filterLevels,
    addLocation,
    deleteDocumentById,
    viewUnitSetup,
    onDeleteResidentTenant,
    transferAccessCardDialog,
    reactiveDeactiveAccessCardDialog,
    unitSetupDetails,
    deleteDialog,

    createUnitSetup,
  };
}
