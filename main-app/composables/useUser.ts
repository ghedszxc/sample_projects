const { useLocalFetchUtil } = useUtils();

export default function useUser() {
  class MUser implements TUser {
    _id: string;
    givenName: string;
    middleName: string;
    surname: string;
    address: TAddress;
    email: string;
    primaryPhone?: string;
    mobilePhone?: string;
    password: string;
    type: string;
    role: string;
    createdAt: string;
    updatedAt: string;
    organization: string;
    site: string | TSite;
    serviceProvider: string | TServiceProvider;
    sites: string[];
    status: string;
    tenantDocument?: Array<Record<string, { _id: string; name: string }>>;
    carRegistration?: Array<Record<string, { _id: string; name: string }>>;
    profilePicture?: string;
    residentType?: string;
    dateOfBirth?: Date | string;
    nric?: string;
    vehicleModel?: string;
    vehicleNo?: string;
    vehicleColor?: string;
    block?: string;
    level?: string;
    unitNumber?: string;
    notificationSettings: TUserNotificationSettings;
    remarks?: string;
    deletionRequested?: boolean;
    stripeAccount?: TStripeAccount;

    constructor(user: Partial<TUser> = {}) {
      this._id = user._id || "";
      this.givenName = user.givenName || "";
      this.middleName = user.middleName || "";
      this.surname = user.surname || "";
      this.address =
        user.address || ({ country: "", city: "", postalCode: "" } as TAddress);
      this.email = user.email || "";
      this.primaryPhone = user.primaryPhone || "";
      this.mobilePhone = user.mobilePhone || "";
      this.password = user.password || "";
      this.type = user.type || "";
      this.role = user.role || "";
      this.createdAt = user.createdAt || "";
      this.updatedAt = user.updatedAt || "";
      this.organization = user.organization || "";
      this.site = user.site || "";
      this.serviceProvider = user.serviceProvider || "";
      this.sites = user.sites || [];
      this.status = user.status || "";
      this.tenantDocument = user.tenantDocument || [];
      this.carRegistration = user.carRegistration || [];
      this.profilePicture = user.profilePicture || "";
      this.residentType = user.residentType || "";
      this.dateOfBirth = user.dateOfBirth || "";
      this.nric = user.nric || "";
      this.vehicleModel = user.vehicleModel || "";
      this.vehicleNo = user.vehicleNo || "";
      this.vehicleColor = user.vehicleColor || "";
      this.block = user.block || "";
      this.level = user.level || "";
      this.unitNumber = user.unitNumber || "";
      this.notificationSettings = user.notificationSettings || {
        "service-provider": false,
        resident: false,
        form: false,
        role: false,
        feedback: false,
        "work-order": false,
        calendar: false,
        key: false,
        visitor: false,
        building: false,
        cctv: false,
        announcement: false,
        "emergency-contact": false,
        "daily-occurrence-book": false,
        incident: false,
      };
      this.remarks = user.remarks || "";
      this.deletionRequested = user.deletionRequested || false;
      this.stripeAccount = user.stripeAccount;
    }
  }

  const userApiUrl = "/api/users";
  const user = useState("user", () => new MUser());
  const users = useState("users", (): TUser[] => []);
  const page = useState("userPageUser", () => 1);
  const pages = useState("userPagesUser", () => 1);
  const itemsPerPage = useState("itemsPerPageUser", () => 10);
  const search = useState("userSearchUser", () => "");
  const pageRange = useState("userPageRangeUser", () => "-- - -- of --");
  const isUsersLoaded = useState("isUsersLoadedUser", () => false);
  const isSendInvite = useState("isSendInviteUser", () => false);

  const residentsTab = useState("residentsTab", () => "residents");

  async function confirmPassword(
    { user, password } = {} as { user: string; password: string },
  ): Promise<{ message: string } | undefined> {
    const { error, data } = await useLocalFetch(
      `${userApiUrl}/verify-password`,
      {
        method: "POST",
        body: JSON.stringify({
          id: user,
          password: password,
        }),
      },
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    if (data.value) {
      return Promise.resolve(data.value as { message: string });
    }
  }

  async function getUserById(id: string) {
    const { data, error } = await useLocalFetch(`/api/auth/users/id/${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getUserByIdLocal(id: string) {
    const { data, error } = await useLocalFetch(`/api/users/id/${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  function setUser(data?: TUser) {
    user.value = new MUser(data);
  }

  const isInviteValid = useState("isInviteValid", () => false);

  async function getUsersByPageSearch({
    page = 1,
    limit = 10,
    search = "",
    organization = "",
    site = "",
    type = "",
    serviceProvider = "",
    options = false,
  } = {}) {
    const { error, data } = await useLocalFetch("/api/auth/users/", {
      method: "GET",
      query: {
        page,
        limit,
        search,
        organization,
        site,
        serviceProvider,
        type,
        options,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function searchResidents({
    search,
    site,
    organization,
  }: {
    search: string;
    site: string;
    organization: string;
  }) {
    const residents = (await getUsersByPageSearch({
      page: page.value,
      limit: itemsPerPage.value,
      search,
      site,
      organization,
      type: "resident",
    })) as TGetUsersByPageSearchResponse;
    users.value = residents.items as TUser[];
    pageRange.value = residents.pageRange;
    pages.value = residents.pages;
  }

  async function setUsers({
    search = "",
    organization = "",
    site = "",
    serviceProvider = "",
    type = "",
    options = false,
  } = {}) {
    try {
      isUsersLoaded.value = true;
      const _users = (await getUsersByPageSearch({
        page: page.value,
        limit: itemsPerPage.value,
        search,
        organization,
        site,
        serviceProvider,
        type,
        options,
      })) as TGetUsersByPageSearchResponse;
      users.value = _users.items as TUser[];
      pageRange.value = _users.pageRange;
      pages.value = _users.pages;
      isUsersLoaded.value = false;
    } catch (error) {
      isUsersLoaded.value = false;
    }
  }

  async function getUserList(
    { organization, site } = {} as { organization?: string; site: string },
  ) {
    const { data, error } = await useLocalFetch(`${userApiUrl}/list`, {
      method: "GET",
      query: { organization, site },
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getAllResidentsByOrgAndSite(
    { organization, site, unit } = {} as {
      organization?: string;
      site?: string;
      unit?: string;
    },
  ) {
    isUsersLoaded.value = true;

    const data = await useLocalFetchUtil<{ items: TUser[] }>(
      `${userApiUrl}/resident`,
      "GET",
      {
        organization,
        site,
        unit,
      },
    );
    users.value = data.items;
    return data;
  }

  async function updateResidentStatus({
    id,
    status,
    remarks,
  }: {
    id: string;
    status: string;
    remarks?: string;
  }) {
    const response = await useLocalFetch(`${userApiUrl}/rbac/${id}`, {
      method: "PATCH",
      body: JSON.stringify({
        status,
        remarks,
      }),
    });
    if (response.status.value === "success") return true;
    return response.error.value;
  }

  async function updateUserRole({ id, role }: { id: string; role: string }) {
    const response = await useLocalFetch(`${userApiUrl}/${id}/role`, {
      method: "PUT",
      body: {
        role: role,
      },
    });
    if (response.status.value === "success") return true;
    return response.error.value;
  }

  async function updateUserProfile({
    id,
    data,
  }: {
    id: string;
    data?: Partial<TUser> | TUser;
  }) {
    const response = await useLocalFetchUtil<{
      message: string;
      value: TUser | null;
    }>(`${userApiUrl}/${id}/profile`, "PUT", data ?? user.value);
    return response;
  }

  async function updateUserDetails({
    id,
    data,
  }: {
    id: string;
    data?: Partial<TUser> | TUser;
  }) {
    console.log("Data", data);
    const response = await useLocalFetchUtil<{
      message: string;
      value: TUser | null;
    }>(`${userApiUrl}/rbac/${id}`, "PUT", data);
    return response;
  }

  async function uploadProfilePicture(img: File) {
    const formData = new FormData();
    formData.append("file", img);
    const response = await useLocalFetch("/api/files/upload?status=draft", {
      method: "POST",
      body: formData,
    });
    if (response.status.value === "success") return response.data.value;
    return response.error.value;
  }

  async function getAllGroupMemberSP({
    serviceProvider = "",
    serviceProviderGroup = "",
  } = {}) {
    try {
      isUsersLoaded.value = true;
      const data = (await useLocalFetchUtil(
        `${userApiUrl}/group-member`,
        "GET",
        {
          page: page.value,
          limit: itemsPerPage.value,
          search: search.value,
          serviceProvider,
          serviceProviderGroup,
        },
      )) as TGetUsersByPageSearchResponse;
      users.value = data.items as TUser[];
      pageRange.value = data.pageRange;
      pages.value = data.pages;
      isUsersLoaded.value = false;
    } catch (error) {
      isUsersLoaded.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage({
    search,
    organization,
    site,
    type,
    serviceProvider,
  }: {
    search?: string;
    organization?: string;
    site?: string;
    type?: string;
    serviceProvider?: string;
  } = {}) {
    page.value++;
    setUsers({ search, organization, site, type, serviceProvider });
  }

  function prevPage({
    search,
    organization,
    site,
    type,
    serviceProvider,
  }: {
    search?: string;
    organization?: string;
    site?: string;
    type?: string;
    serviceProvider?: string;
  } = {}) {
    page.value--;
    setUsers({ search, organization, site, type, serviceProvider });
  }

  async function verifyPassword(payload: { id: string; password: string }) {
    const response = await useLocalFetchUtil<{
      message: string;
      value: TUser | boolean;
    }>("/api/users/verify-password", "POST", payload);
    return response;
  }

  async function updateUserStatusById({
    id,
    status,
  }: {
    id: string;
    status: string;
  }) {
    const { error, data } = await useLocalFetch(`${userApiUrl}/id/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        status,
      }),
    });

    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function deleteUserById({ id }: { id: string }) {
    const { error, data } = await useLocalFetch(`${userApiUrl}/${id}`, {
      method: "DELETE",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }
    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function updateNotificationSettings(
    id: string,
    notificationSettings: TUserNotificationSettings,
  ) {
    const { error, data } = await useLocalFetch(
      `${userApiUrl}/${id}/notification/settings`,
      {
        method: "PUT",
        body: JSON.stringify({
          notificationSettings,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve((data.value as { message: string }).message);
    }
  }

  async function requestAccountDeletion(id: string, type: string) {
    const { error, data } = await useLocalFetch(
      `${userApiUrl}/request-account-deletion`,
      {
        method: "DELETE",
        body: JSON.stringify({
          id,
          type,
        }),
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }
    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  return {
    user,
    users,
    page,
    itemsPerPage,
    pageRange,
    setUser,
    search,
    isUsersLoaded,
    isInviteValid,
    setUsers,
    getUserById,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    pages,
    getUserList,
    getAllResidentsByOrgAndSite,
    verifyPassword,
    getUserByIdLocal,
    getAllGroupMemberSP,
    updateResidentStatus,
    updateUserProfile,
    updateUserRole,
    uploadProfilePicture,
    isSendInvite,
    searchResidents,
    updateUserStatusById,
    deleteUserById,
    updateUserDetails,
    updateNotificationSettings,
    residentsTab,
    requestAccountDeletion,
    confirmPassword,
  };
}
