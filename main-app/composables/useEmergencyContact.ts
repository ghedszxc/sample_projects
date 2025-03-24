export default function useVehicle() {
  class MEmergencyContact implements TEmergencyContact {
    _id?: string;
    title: string;
    phoneNumber?: string;
    category?: string;
    categoryName: string | null;
    isDefault?: boolean | undefined;
    isShown?: boolean | undefined;
    createdAt?: Date;
    updatedAt?: Date;
    site?: string;
    organization?: string;
    icon?: string | null;

    constructor({
      _id = "",
      title = "",
      phoneNumber = "",
      category = "",
      categoryName = null,
      isDefault,
      isShown,
      createdAt,
      updatedAt,
      site,
      organization,
      icon = null,
    }: TEmergencyContact = {}) {
      this._id = _id;
      this.title = title;
      this.category = category;
      this.categoryName = categoryName;
      this.isDefault = isDefault;
      this.isShown = isShown;
      this.phoneNumber = phoneNumber;
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt;
      this.site = site;
      this.organization = organization;
      this.icon = icon;
    }
  }

  class MEmergencyContactCategory implements TEmergencyContactCategory {
    _id?: string;
    categoryName?: string;
    site?: string;
    createdAt?: Date;
    updatedAt?: Date;

    constructor({
      _id = "",
      categoryName,
      createdAt = new Date(),
      updatedAt = new Date(),
      site,
    }: Partial<TEmergencyContactCategory> = {}) {
      this._id = _id;
      this.categoryName = categoryName;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.site = site;
    }
  }

  const emergencyContactCategories = useState(
    "emergencyContactsCategory",
    (): TEmergencyContactCategory[] => [],
  );
  const emergencyContacts = useState(
    "emergencyContacts",
    (): TEmergencyContact[] => [],
  );
  const page = useState("emergencyContactPage", () => 1);
  const pages = useState("emergencyContactPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const pageRange = useState(
    "emergencyContactPageRange",
    () => "-- - -- of --",
  );
  const search = useState("emergencyContactSearch", () => "");
  const isVehicleValid = useState("isVehicleValid", () => false);
  const isEmergencyContactLoaded = useState(
    "isEmergencyContactLoaded",
    () => false,
  );
  const emergencyContact = useState(
    "emergencyContact",
    (): TEmergencyContact => new MEmergencyContact(),
  );
  const emergencyContactCategory = useState(
    "emergencyContactCategory",
    (): TEmergencyContactCategory => new MEmergencyContactCategory(),
  );
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const selectedEmergencyContact = useState(
    "selectedEmergencyContact",
    () => "",
  );
  const addEmergencyContactSteps = useState(
    "addEmergencyContactSteps",
    () => 1,
  );
  const editEmergencyContactSteps = useState(
    "editEmergencyContactSteps",
    () => 1,
  );

  const filterByType = useState("filterByType", () => "all");
  const filterByStatus = useState("filterByStatus", () => "all");
  const emergencyContactInfoDialog = useState(
    "emergencyContactInfoDialog",
    () => false,
  );
  const updateVehicleStatusDialog = useState(
    "updateVehicleStatusDialog",
    () => false,
  );
  const addEmergencyContactDialog = useState(
    "addEmergencyContactDialog",
    () => false,
  );
  const manageEmergencyContactCategories = useState(
    "manageEmergencyContactCategories",
    () => false,
  );
  const editEmergencyContactDialog = useState(
    "editEmergencyContactDialog",
    () => false,
  );
  const deleteEmergencyContactDialog = useState(
    "deleteEmergencyContactDialog",
    () => false,
  );

  function setEmergencyContact(data?: TEmergencyContact) {
    console.log("Data", data);

    emergencyContact.value = data || new MEmergencyContact();
  }

  async function getEmergencyContactsByPageSearch({
    page = 1,
    search = "",
    limit = 10,
    site,
  }: {
    page?: number;
    search?: string;
    site?: string;
    limit?: number;
  }) {
    const { error, data } = await useLocalFetch(
      "/api/emergency-contacts/v1/all",
      {
        method: "GET",
        query: {
          page,
          search,
          site,
          limit,
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

  async function searchEmergencyContacts({
    search,
    site,
  }: {
    search: string;
    site: string;
  }) {
    const getEmergencyContacts = (await getEmergencyContactsByPageSearch({
      page: page.value,
      limit: itemsPerPage.value,
      search,
      site,
    })) as TGetEmergencyContactsByPageSearchResponse;
    emergencyContacts.value = getEmergencyContacts.items as TEmergencyContact[];
    pageRange.value = getEmergencyContacts.pageRange;
    pages.value = getEmergencyContacts.pages;
  }

  async function getEmergencyContactById(_id: string) {
    const { error, data } = await useLocalFetch(
      `/api/emergency-contacts/v1/${_id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TVehicle);
    }
  }

  async function setEmergencyContacts(site: string) {
    try {
      isEmergencyContactLoaded.value = true;

      const _emergencyContacts = (await getEmergencyContactsByPageSearch({
        page: page.value,
        site,
      })) as TDataRequestResponse;
      emergencyContacts.value = _emergencyContacts.items as TEmergencyContact[];
      pageRange.value = _emergencyContacts.pageRange;
      pages.value = _emergencyContacts.pages;
      isEmergencyContactLoaded.value = false;
    } catch (error) {
      emergencyContacts.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isEmergencyContactLoaded.value = false;
    }
  }

  async function addEmergencyContact(_emergencyContact: TEmergencyContact) {
    delete _emergencyContact._id;

    const { error, data } = await useLocalFetch(`/api/emergency-contacts/v1`, {
      method: "POST",
      body: JSON.stringify(_emergencyContact),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function editEmergencyContactById(
    id: string,
    payload: TEmergencyContact,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/emergency-contacts/v1/${id}`,
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

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  async function nextPage({ site }: { site: string }) {
    page.value++;
    await setEmergencyContacts(site);
  }

  async function prevPage({ site }: { site: string }) {
    page.value--;
    await setEmergencyContacts(site);
  }

  async function deleteEmergencyContactById(id: string, site: string) {
    const { error, data } = await useLocalFetch(
      `/api/emergency-contacts/v1/${id}`,
      {
        method: "DELETE",
        query: {
          site,
        },
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

  async function addEmergencyContactCategory(
    categoryName: string,
    site: string,
  ) {
    const { error, data } = await useLocalFetch(
      "/api/emergency-contacts/v1/category/create",
      {
        method: "POST",
        body: JSON.stringify({
          categoryName,
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

  async function deleteEmergencyContactCategoryById(id: string, site: string) {
    const { error, data } = await useLocalFetch(
      `/api/emergency-contacts/v1/category/${id}`,
      {
        method: "DELETE",
        query: {
          site,
        },
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

  async function getAllEmergencyCategories(site: string) {
    const { error, data } = await useLocalFetch(
      "/api/emergency-contacts/v1/category/all",
      {
        method: "GET",
        query: {
          site,
        },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }
    emergencyContactCategories.value =
      data.value as TEmergencyContactCategory[];
  }

  return {
    emergencyContact,
    emergencyContacts,
    setEmergencyContact,
    setEmergencyContacts,
    isVehicleValid,
    isEmergencyContactLoaded,
    addEmergencyContact,
    editEmergencyContactById,
    getEmergencyContactById,
    page,
    pages,
    itemsPerPage,
    pageRange,
    search,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    filterOrganization,
    filterSite,
    filterByType,
    filterByStatus,
    emergencyContactInfoDialog,
    updateVehicleStatusDialog,
    selectedEmergencyContact,
    addEmergencyContactSteps,
    editEmergencyContactSteps,
    addEmergencyContactDialog,
    editEmergencyContactDialog,
    deleteEmergencyContactDialog,
    deleteEmergencyContactById,
    searchEmergencyContacts,
    emergencyContactCategories,
    emergencyContactCategory,
    manageEmergencyContactCategories,
    addEmergencyContactCategory,
    deleteEmergencyContactCategoryById,
    getAllEmergencyCategories,
  };
}
