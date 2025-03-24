export default function useLocalAuth() {
  const config = useRuntimeConfig().public;
  let domain = config.DOMAIN; // fallback domain
  if (typeof window !== "undefined") {
    domain = window.location.hostname;
  }
  const cookieOptions = {
    // domain: config.DOMAIN,
    domain,
    secure: true,
    maxAge: 30 * 24 * 60 * 60,
  };

  async function login(email: string, password: string) {
    const { data, error } = await useLocalFetch("/api/auth/users/login", {
      method: "POST",
      body: JSON.stringify({ email, password, postType: "login-resident" }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      const res = data.value as TAuthUser;
      if (res?.user && res?.user?.status === "resubmit") {
        return res.user;
      }

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
  }

  async function logout() {
    await useLocalFetch("/api/auth/users/logout", {
      method: "POST",
      body: JSON.stringify({ token: useCookie("refreshToken").value }),
    });

    clearCookies();
  }

  async function getCurrentUser() {
    const user = useCookie("user", cookieOptions).value;

    const { data, error }: any = await useLocalFetch(
      `/api/auth/users/current-user`,
      {},
    );

    if (error.value) {
      clearCookies();
      return;
    }
    if (data.value?.type == "resident") {
      return data.value;
    } else {
      clearCookies();
      return;
    }
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

  const currentUser = useState("currentUser", () =>
    JSON.parse(JSON.stringify(user)),
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
      await setSnackbar({ text: res.message, modal: true });
      return;
    }

    if (error.value) {
      setSnackbar({ text: error.value as any, modal: true });
      return;
    }
  }

  async function signupResident(form: TResident) {
    let method: "POST" | "PUT" = "POST";
    if (form.status === "resubmit") {
      method = "PUT";
    }

    const { error, data } = await useLocalFetch(
      "/api/auth/users/sign-up-resident",
      {
        method,
        body: JSON.stringify(form),
      },
    );

    const res = data.value as TResponse;

    if (!error.value) {
      setSnackbar({ text: res.message, modal: true });
      return true;
    }
    if (error.value) {
      if (error?.value?.data?.message) {
        setSnackbar({
          text: error.value.data.message as any,
          modal: true,
          type: "error",
        });
      } else {
        setSnackbar({
          text: error.value.data as any,
          modal: true,
          type: "error",
        });
      }

      return false;
    }
  }

  async function inviteUser(form: TSignUpForm) {
    const { error, data } = await useLocalFetch("/api/auth/users/sign-up", {
      method: "POST",
      body: JSON.stringify(form),
    });
    const res = data.value as TResponse;
    if (!error.value) {
      return Promise.resolve(res.message);
    }

    if (error.value) {
      return Promise.reject(error.value as any);
    }
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

  async function deleteUser(password: string) {
    const { data, error } = await useLocalFetch("/api/users/delete-user", {
      method: "DELETE",
      body: JSON.stringify({
        id: currentUser.value._id,
        password: password,
      }),
    });

    if (!error.value) {
      // setSnackbar({
      //   text: `${(data.value as { message: string }).message}`,
      //   modal: true,
      // });
      return true;
    }
    if (error.value) {
      setSnackbar({ text: error.value.data.message, modal: true });
      return false;
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
    signupResident,
    deleteUser,
  };
}
