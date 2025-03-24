const { useLocalFetchUtil } = useUtils();

export default function useOrganization() {
  class MOrganization implements TOrganization {
    _id: string;
    name: string;
    email?: string;
    contactNumber?: string;
    description: string;
    sites?: string[];
    members?: number;
    status: string;
    logo?: {
      id?: string;
      name?: string;
    };
    createdBySpId?: string;
    createdAt: string;
    updatedAt: string;
    constructor(
      {
        _id = "",
        name = "",
        email = "",
        contactNumber = "",
        description = "",
        sites = [],
        members,
        status = "inactive",
        logo = {
          id: "",
          name: "",
        },
        createdBySpId,
        createdAt = "",
        updatedAt = "",
      } = {} as TOrganization,
    ) {
      this._id = _id;
      this.name = name;
      this.email = email;
      this.contactNumber = contactNumber;
      this.description = description;
      this.sites = sites;
      this.members = members;
      this.status = status;
      this.logo = { id: logo.id, name: logo.name };
      this.createdBySpId = createdBySpId;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  const organizations = useState("organizations", (): TOrganization[] => []);
  const page = useState("organizationPage", () => 1);
  const pages = useState("organizationPages", () => 1);
  const pageLimit = useState("organizationLimit", () => 10);
  const pageRange = useState("organizationPageRange", () => "-- - -- of --");
  const search = useState("organizationSearch", () => "");
  const isOrganizationValid = useState("isOrganizationValid", () => false);
  const isOrganizationLoading = useState("isOrganizationLoading", () => false);
  const organization = useState(
    "organization",
    (): TOrganization => new MOrganization(),
  );

  function setOrganization(data?: TOrganization) {
    organization.value = data || new MOrganization();
  }

  async function getOrganizationsByPageSearch(
    { page = 1, search = "", limit = 10, createdBy = "" } = {} as {
      page?: number;
      search?: string;
      limit?: number;
      createdBy?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/organizations/v1", {
      method: "GET",
      query: { page, search, limit, createdBy },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getOrganizationById(_id: string) {
    const { error, data } = await useLocalFetch(`/api/organizations/v1/${_id}`);

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TOrganization);
    }
  }

  async function setOrganizations(
    { searchKeyword = "", createdBy = "" } = {} as {
      searchKeyword: string;
      createdBy?: string;
    },
  ) {
    try {
      isOrganizationLoading.value = true;
      const _organizations = (await getOrganizationsByPageSearch({
        page: page.value,
        search: searchKeyword || search.value,
        limit: pageLimit.value,
        createdBy: createdBy,
      })) as TOrganizationResponse;
      organizations.value = _organizations.items as TOrganization[];
      pageRange.value = _organizations.pageRange;
      pages.value = _organizations.pages;
      isOrganizationLoading.value = false;
    } catch (error) {
      organizations.value = [];
      pageRange.value = "-- - -- of --";
      isOrganizationLoading.value = false;
    }
  }

  async function addOrganization(payload: TOrganization) {
    delete payload._id;
    const response = await useLocalFetchUtil<{
      data: {
        acknowledged: boolean;
        insertedId: string;
      };
      message: string;
    }>("/api/organizations/v1", "POST", payload);
    return response;
  }

  async function addOrganizationWithSendInvite(
    organization: TOrganization,
    user: TSignUpForm,
  ) {
    delete organization._id;
    const response = await useLocalFetchUtil<{
      message: string | undefined;
    }>("/api/organizations/v1/create/invite", "POST", { organization, user });
    return response;
  }

  async function updateOrgNameById(_organization: TUpdateOrgNameOptions) {
    const { error, data } = await useLocalFetch(
      `/api/organizations/v1/name/${_organization._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ name: _organization.name }),
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

  async function updateOrgEmailById(_organization: TUpdateOrgEmailOptions) {
    const { error, data } = await useLocalFetch(
      `/api/organizations/v1/email/${_organization._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ email: _organization.email }),
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

  async function updateOrgContactById(_organization: TUpdateOrgContactOptions) {
    const { error, data } = await useLocalFetch(
      `/api/organizations/v1/contact/${_organization._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ contactNumber: _organization.contactNumber }),
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

  async function updateOrgStatusById(_organization: TUpdateOrgStatusOptions) {
    const { error, data } = await useLocalFetch(
      `/api/organizations/v1/status/${_organization._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status: _organization.status }),
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

  async function deleteOrgById(_id: string) {
    const { error, data } = await useLocalFetch(
      `/api/organizations/v1/${_id}`,
      {
        method: "DELETE",
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

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage() {
    page.value++;
    getOrganizationsByPageSearch({
      page: page.value,
      search: search.value,
    });
    setOrganizations();
  }

  function prevPage() {
    page.value--;
    getOrganizationsByPageSearch({
      page: page.value,
      search: search.value,
    });
    setOrganizations();
  }

  return {
    organization,
    organizations,
    page,
    pages,
    setOrganization,
    setOrganizations,
    isOrganizationValid,
    isOrganizationLoading,
    addOrganization,
    getOrganizationById,
    updateOrgNameById,
    updateOrgEmailById,
    updateOrgContactById,
    pageRange,
    pageLimit,
    canNextPage,
    canPrevPage,
    search,
    nextPage,
    prevPage,
    deleteOrgById,
    updateOrgStatusById,
    addOrganizationWithSendInvite,
  };
}
