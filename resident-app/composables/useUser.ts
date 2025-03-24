const { useLocalFetchUtil } = useUtils();

export default function useUser() {
  class MUser {
    _id: string;
    givenName: string;
    middleName: string;
    surname: string;
    address: TAddress;
    email: string;
    password: string;
    type: string;
    role: string[];
    createdAt: string;
    updatedAt: string;
    organization: string;
    sites: string[];
    notificationSettings: TUserNotificationSettings;

    constructor(user: Partial<TUser> = {}) {
      this._id = user._id || "";
      this.givenName = user.givenName || "";
      this.middleName = user.middleName || "";
      this.surname = user.surname || "";
      this.address =
        user.address || ({ country: "", city: "", postalCode: "" } as TAddress);
      this.email = user.email || "";
      this.password = user.password || "";
      this.type = user.type || "";
      this.role = user.role || [];
      this.createdAt = user.createdAt || "";
      this.updatedAt = user.updatedAt || "";
      this.organization = user.organization || "";
      this.sites = user.sites || [];
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
    }
  }

  const userApiUrl = "/api/users";
  const user = useState("user", () => new MUser());
  const users = useState("users", (): TUser[] => []);
  const page = useState("userPage", () => 1);
  const pages = useState("userPages", () => 1);
  const search = useState("userSearch", () => "");
  const pageRange = useState("userPageRange", () => "-- - -- of --");
  const isUsersLoaded = useState("isUsersLoaded", () => false);

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

  function setUser(data?: TUser) {
    user.value = new MUser(data);
  }

  const isInviteValid = useState("isInviteValid", () => false);

  async function getUsersByPageSearch(
    { page = 1, search = "" } = {} as { page?: number; search?: string },
  ) {
    const { error, data } = await useLocalFetch("/api/auth/users/", {
      method: "GET",
      query: { page, search },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setUsers() {
    try {
      isUsersLoaded.value = false;
      const _users = (await getUsersByPageSearch({
        page: page.value,
        search: search.value,
      })) as TGetUsersByPageSearchResponse;
      users.value = _users.items as TUser[];
      pageRange.value = _users.pageRange;
      pages.value = _users.pages;
      isUsersLoaded.value = true;
    } catch (error) {
      isUsersLoaded.value = true;
    }
  }

  async function updateProfile(dataArg: any) {
    const { error, data } = await useLocalFetch("/api/auth/users/profile", {
      method: "PUT",
      body: JSON.stringify(dataArg),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    console.log("result", result);

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }

    if (result && result?.value?.message) {
      return Promise.resolve(result.value.message as string);
    }
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

  async function verifyPassword(payload: { id: string; password: string }) {
    const response = await useLocalFetchUtil<{
      message: string;
      value: TUser | boolean;
    }>("/api/users/verify-password", "POST", payload);
    return response;
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

  return {
    user,
    users,
    page,
    pageRange,
    setUser,
    isUsersLoaded,
    isInviteValid,
    setUsers,
    getUserById,
    updateProfile,
    uploadProfilePicture,
    verifyPassword,
    updateNotificationSettings,
  };
}
