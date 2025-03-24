export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const { setRoles } = useRole();
  const { setSnackbar } = useLocal();
  const {
    getSitesOptionsForFiltering,
    siteOptions,
    filterSite,
    mySite,
    myOrg,
    myProvider,
  } = useFilter();
  const { currentUser } = useLocalAuth();
  const _route = useRoute();
  try {
    const _site = mySite.value || _route.params.site;
    await setRoles({
      organization: _site || myProvider.value ? "" : myOrg.value,
      site: myProvider.value ? "" : _site,
      userId: currentUser.value.type == "admin" ? currentUser.value._id : "",
      serviceProvider: myProvider.value || "",
    });
  } catch (error) {
    setSnackbar({ text: "Failed to fetch roles", modal: true, type: "error" });
  }
});
