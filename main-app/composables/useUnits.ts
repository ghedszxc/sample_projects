export default function useUnit() {
  class MUnit implements TUnit {
    _id: string;
    name: string;
    resident: string;
    category: string;
    email: string;
    contactNumber: string;

    constructor(
      {
        _id = "",
        name = "",
        resident = "",
        category = "",
        email = "",
        contactNumber = "",
      } = {} as TUnit
    ) {
      this._id = _id || "";
      this.name = name || "";
      this.resident = resident || "";
      this.category = category || "";
      this.email = email || "";
      this.contactNumber = contactNumber || "";
    }
  }

  const unit = useState("unit", () => new MUnit());
  const units = useState("units", (): TUnit[] => []);
  const page = useState("unitPage", () => 1);
  const pages = useState("unitPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("unitSearch", () => "");
  const pageRange = useState("unitPageRange", () => "-- - -- of --");
  const isUnitValid = useState("isUnitValid", () => false);
  const isUnitsLoaded = useState("isUnitsLoaded", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");

  function setUnit(data?: TUnit) {
    unit.value = data || new MUnit();
  }

  async function getUnitsByPageSearch(
    { page = 1, search = "", organization, block, level, site } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
      block?: string;
      level?: string;
    }
  ) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1",
      {
        method: "GET",
        query: { page, search, organization, site, block, level },
      }
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
      }
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setUnits(
    { organization, site, block, level } = {} as { organization?: string; site?: string; block?: string; level?: string; }
  ) {
    try {
      isUnitsLoaded.value = true;
      const _units = (await getUnitsByPageSearch({
        page: page.value,
        search: search.value,
        organization,
        site,
        block,
        level
      })) as TUnitResponse;
      units.value = _units.items as TUnit[];
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

  async function addUnit(_unit: TUnit) {
    const { error, data } = await useLocalFetch(
      "/api/building-management/units/v1",
      {
        method: "POST",
        body: JSON.stringify(_unit),
      }
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function deleteUnit(id: string) {
    const { error, data } = await useLocalFetch(
      `/api/building-management/units/v1/${id}`,
      {
        method: "DELETE",
        body: "",
      }
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateUnit(form: any) {
    console.log(form);
    let _id = form._id;
    delete form._id;
    const { data, error } = await useLocalFetch(
      `/api/building-management/units/v1/${_id}`,
      {
        method: "PUT",
        body: JSON.stringify(form),
      }
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site } = {} as { organization?: string; site?: string }
  ) {
    page.value++;
    getUnitsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      site,
    });
  }

  function prevPage(
    { organization, site } = {} as { organization?: string; site?: string }
  ) {
    page.value--;
    getUnitsByPageSearch({
      page: page.value,
      search: search.value,
      organization,
      site,
    });
  }

  return {
    unit,
    units,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setUnit,
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
    updateUnit,
    deleteUnit,
    getUnitById,
    filterOrganization,
    filterSite,
  };
}
