import type { UseFetchOptions } from "nuxt/app";
import { defu } from "defu";

export function useLocalFetch<T>(
  url: string,
  options: UseFetchOptions<T> = {}
) {
  const config = useRuntimeConfig();
  const cookieOptions = {
    domain: config.public.DOMAIN,
    secure: true,
    maxAge: 30 * 24 * 60 * 60,
  };
  const accessToken = useCookie("accessToken", cookieOptions).value;
  const retry = 0;

  const defaults: UseFetchOptions<T> = {
    baseURL: "/api",
    key: url,
    headers: { Authorization: `Bearer ${accessToken}` },
    async onResponseError({ response }) {
      if (response.status === 401 && !retry) {
        const refreshToken = useCookie("refreshToken", cookieOptions).value;
        const { data } = await useFetch("/api/auth/tokens", {
          method: "POST",
          body: { token: refreshToken },
        });
        const res = data.value as any;
        useCookie("accessToken", cookieOptions).value = res.accessToken;
        const params = defu(
          {
            ...options,
            headers: { Authorization: `Bearer ${res.accessToken}` },
          },
          defaults
        );
        return useFetch(url, params);
      }
    },
  };

  const params = defu(options, defaults);

  return useFetch(url, params);
}
