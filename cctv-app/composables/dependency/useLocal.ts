export default function useLocal() {
  const config = useRuntimeConfig().public;
  const cookieOptions = {
    domain: config.DOMAIN,
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
