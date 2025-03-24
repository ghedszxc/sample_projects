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
  const defaultSnackbarHighlight = useState(
    "defaultSnackbarHighlight",
    () => "",
  );
  const defaultSnackbarCallback = useState(
    "defaultSnackbarCallback",
    () => function () {},
  );

  const cctvLink = useState(
    "cctvLink",
    () => useRuntimeConfig().public.CCTV_LINK,
  );

  function setSnackbar({
    text = "",
    type = "success",
    modal = false,
    highlight = "",
    callback = function () {},
  } = {}) {
    defaultSnackbar.value = modal;
    defaultSnackbarText.value = text;
    defaultSnackbarType.value = type;
    defaultSnackbarHighlight.value = highlight;
    defaultSnackbarCallback.value = callback;
  }

  return {
    theme,
    defaultSnackbar,
    defaultSnackbarText,
    defaultSnackbarType,
    defaultSnackbarHighlight,
    defaultSnackbarCallback,
    cctvLink,
    setSnackbar,
  };
}
