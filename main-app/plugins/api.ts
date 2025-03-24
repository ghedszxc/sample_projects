export default defineNuxtPlugin(() => {
  const { cookieConfig } = useRuntimeConfig().public;

  const api = $fetch.create({
    baseURL: "/",
    retry: 1,
    retryStatusCodes: [401],
    retryDelay: 500,
    onRequest({ options }) {
      const accessToken = useCookie("accessToken", cookieConfig).value;
      options.headers = accessToken
        ? { Authorization: `Bearer ${accessToken}` }
        : {};
    },

    async onResponseError({ response }) {
      if (response.status === 401) {
        await $fetch("/api/auth/refresh", {
          baseURL: "/",
          method: "POST",
          server: false,
          credentials: "include",
          body: JSON.stringify({
            token: useCookie("refreshToken", cookieConfig).value,
          }),

          onResponse({ response }) {
            if (response.status === 200) {
              useCookie("accessToken", cookieConfig).value =
                response._data.token;
            }
          },
        });
      }
    },
  });

  // Expose to useNuxtApp().$api
  return {
    provide: {
      api,
    },
  };
});
