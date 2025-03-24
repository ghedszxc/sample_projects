export default function useLocal() {
  // const theme = useState("localTheme", () => "light");
  const config = useRuntimeConfig().public;
  let domain = config.DOMAIN; // fallback domain
  if (typeof window !== "undefined") {
    domain = window.location.hostname;
  }

  const cookieOptions = {
    domain,
    // domain: config.DOMAIN,
    secure: true,
    maxAge: 30 * 24 * 60 * 60,
  };
  const theme = useCookie("localTheme", cookieOptions);
  const defaultSnackbar = useState("defaultSnackbar", () => false);
  const defaultSnackbarText = useState("defaultSnackbarText", () => "");
  const defaultSnackbarType = useState("defaultSnackbarType", () => "");

  function setSnackbar({ text = "", type = "success", modal = false } = {}) {
    defaultSnackbar.value = modal;
    defaultSnackbarText.value = text;
    defaultSnackbarType.value = type;
  }

  return {
    theme,
    defaultSnackbar,
    defaultSnackbarText,
    defaultSnackbarType,
    setSnackbar,
  };
}
