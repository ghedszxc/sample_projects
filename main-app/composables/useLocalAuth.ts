const { useLocalFetchUtil } = useUtils();
export default function useLocalAuth() {
  const config = useRuntimeConfig().public;
  const cookieOptions = {
    domain: config.DOMAIN,
    secure: true,
    maxAge: 30 * 24 * 60 * 60,
  };

  async function getVerificationById(id: string) {
    return await useLocalFetchUtil<
      { _id: string; userType?: string } | undefined
    >(`/api/verification/v1/verify/${id}`, "GET");
  }

  async function signUpVerification(
    payload: {
      password: string;
      emailVerified?: boolean;
      plateNumber?: string;
    },
    id: string,
  ) {
    return await useLocalFetchUtil<boolean>(
      `/api/auth/users/sign-up/${id}`,
      "POST",
      payload,
    );
  }

  async function login(email: string, password: string) {
    const { data, error } = await useLocalFetch("/api/auth/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const res = data.value as TAuthUser;

      useCookie("accessToken", cookieOptions).value = res.accessToken;
      useCookie("refreshToken", cookieOptions).value = res.refreshToken;
      useCookie("user", cookieOptions).value = email;
    }
  }

  function clearCookies() {
    useCookie("accessToken", cookieOptions).value = null;
    useCookie("refreshToken", cookieOptions).value = null;
    useCookie("user", cookieOptions).value = null;
    useCookie("organization", cookieOptions).value = null;
    useCookie("userAbilities", cookieOptions).value = null;
  }

  async function logout() {
    await useLocalFetch("/api/auth/users/logout", {
      method: "POST",
      body: JSON.stringify({ token: useCookie("refreshToken").value }),
    });

    clearCookies();
    clearNuxtState();
  }
  const { $ability, $updateAbility } = useNuxtApp();
  const { permissions, setPermissions } = usePermission();
  async function getCurrentUser() {
    const user = useCookie("user", cookieOptions).value;
    const { data, error } = await useLocalFetch(`/api/auth/users/${user}`, {});

    if (data.value?.role) {
      const _permissions = formatPermissions(data.value.role);
      localStorage.setItem("userAbilities", JSON.stringify(_permissions));
      setPermissions({ permissions: _permissions });

      $updateAbility(_permissions);
    }

    if (error.value) {
      clearCookies();
      return;
    }
    return data.value as TUser;
  }

  interface Permission {
    slug: string;
    isEnabled: boolean;
  }

  interface Module {
    slug: string;
    [action: string]: any;
  }

  interface Role {
    modules: Module[];
  }

  interface Ability {
    action: string;
    subject: string;
    // conditions: { slug: string };
  }

  function formatPermissions(role: Role): Ability[] {
    const abilities: Ability[] = [];
    // try {
    if (role) {
      role.modules.forEach((module) => {
        Object.keys(module).forEach((action) => {
          if (Array.isArray(module[action])) {
            module[action].forEach((permission: Permission) => {
              if (permission.isEnabled) {
                abilities.push({
                  action: action,
                  subject: permission.slug,
                });
              }
            });
          }
        });
      });
    }
    // } catch (error) {

    // }

    return abilities;
  }

  const _address = {
    country: "",
    address1: "",
    address2: "",
    city: "",
    province: "",
    postalCode: "",
  };

  const user = {
    _id: "",
    givenName: "",
    middleName: "",
    surname: "",
    address: _address,
    email: "",
    password: "",
    type: "",
    createdAt: "",
    organization: "",
    role: "",
    primaryPhone: "",
    mobilePhone: "",
  };

  const currentUser = useState(
    "currentUser",
    (): TUser => JSON.parse(JSON.stringify(user)),
  );

  const email = useCookie("user", cookieOptions).value;
  const accessToken = useCookie("accessToken", cookieOptions).value;
  const refreshToken = useCookie("refreshToken", cookieOptions).value;
  const organization = useCookie("organization", cookieOptions).value;

  const loggedIn = computed(() => !!(email && accessToken && refreshToken));

  const { setSnackbar } = useLocal();

  async function signup(form: TSignUpForm) {
    const { error, data } = await useLocalFetch("/api/auth/users/sign-up", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const res = data.value as TResponse;
    if (!error.value) {
      await setSnackbar({ text: res.message, modal: true, type: "success" });
      return;
    }

    if (error.value) {
      setSnackbar({ text: error.value as any, modal: true, type: "error" });
      return;
    }
  }

  async function inviteUser(payload: TSignUpForm) {
    return await useLocalFetchUtil<{ message: string | undefined }>(
      "/api/auth/users/sign-up",
      "POST",
      payload,
    );
  }

  async function inviteUserToGroup(payload: TSignUpForm) {
    return await useLocalFetchUtil<{ message: string | undefined }>(
      "/api/service-provider-groups/v1/signup/link",
      "POST",
      payload,
    );
  }

  async function createMembertoGroup(payload: TSignUpForm) {
    const verificationId = payload.verification;
    delete payload.verification;
    return await useLocalFetchUtil<{ message: string | undefined }>(
      `/api/users/group-member-signup/${verificationId}`,
      "POST",
      payload,
    );
  }

  async function removeMembertoGroup(payload: TUserRemoveForm) {
    return await useLocalFetchUtil<{ message: string | undefined }>(
      `/api/users/remove-member/${payload.id}`,
      "PUT",
      payload,
    );
  }

  async function transferMembertoGroup(payload: TUserRemoveForm) {
    return await useLocalFetchUtil<{ message: string | undefined }>(
      `/api/users/transfer-member/${payload.id}`,
      "PUT",
      payload,
    );
  }

  const profile = useState("profile", () => JSON.parse(JSON.stringify(user)));

  const validProfile = useState("validProfile", () => false);

  async function updateName({
    _id = "",
    givenName = "",
    middleName = "",
    surname = "",
  } = {}) {
    const { data, error } = await useLocalFetch(`/api/auth/users/${_id}/name`, {
      method: "PUT",
      body: JSON.stringify({ givenName, middleName, surname }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updatePassword({
    _id = "",
    currentPassword = "",
    newPassword = "",
  } = {}) {
    const { data, error } = await useLocalFetch(
      `/api/auth/users/${_id}/password`,
      {
        method: "PUT",
        body: JSON.stringify({ currentPassword, newPassword }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateAddress({ _id = "", address = _address } = {}) {
    const { data, error } = await useLocalFetch(
      `/api/auth/users/${_id}/address`,
      {
        method: "PUT",
        body: JSON.stringify(address),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateEmail({ _id = "", email = "" } = {}) {
    const { data, error } = await useLocalFetch(
      `/api/auth/users/${_id}/email`,
      {
        method: "PUT",
        body: JSON.stringify({ email }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      currentUser.value.email = email;
      useCookie("user", cookieOptions).value = email;
      return data.value;
    }
  }

  async function updatePrimaryPhone({ _id = "", primaryPhone = "" } = {}) {
    const { data, error } = await useLocalFetch(
      `/api/auth/users/${_id}/primary-phone`,
      {
        method: "PUT",
        body: JSON.stringify({ primaryPhone }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateMobilePhone({ _id = "", mobilePhone = "" } = {}) {
    const { data, error } = await useLocalFetch(
      `/api/auth/users/${_id}/mobile-phone`,
      {
        method: "PUT",
        body: JSON.stringify({ mobilePhone }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function signUpServiceProvider(
    { serviceProvider, user } = {} as {
      serviceProvider: {
        name: string;
        contactNumber: string;
        service: string;
        email: string;
      };
      user: {
        _id?: string;
        givenName: string;
        surname: string;
        email?: string;
        password: string;
        type: string;
        serviceProvider: string;
      };
    },
  ) {
    const { data, error } = await useLocalFetch(
      `/api/service-providers/v1/create/invite`,
      {
        method: "POST",
        body: JSON.stringify({
          serviceProvider: serviceProvider,
          user: user,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  return {
    login,
    logout,
    getCurrentUser,
    currentUser,
    loggedIn,
    organization,
    email,
    signup,
    profile,
    validProfile,
    updateName,
    updateAddress,
    updateEmail,
    updatePrimaryPhone,
    updateMobilePhone,
    inviteUser,
    updatePassword,
    signUpVerification,
    getVerificationById,
    signUpServiceProvider,
    inviteUserToGroup,
    createMembertoGroup,
    removeMembertoGroup,
    transferMembertoGroup,
  };
}
