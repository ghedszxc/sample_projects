export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const siteId = route.params.site as string;
  const { getSiteById, setSite } = useSite();
  const { setSnackbar } = useLocal();
  const { currentUser } = useLocalAuth();
  const { spGroup, getSPGroupById, setSPGroup } = useSPGroup();
  const _groupSite = ref("") 
  const { mySite,fetchOrg } = useFilter();
  try {

    if (/^(service-provider-member)$/i.test(currentUser.value.type)) {
      const _group = await getSPGroupById(String(currentUser.value.serviceProviderGroup || ""));
      await setSPGroup(_group);
      _groupSite.value = String(_group?.site._id);
    }
    
    const _site = await getSiteById(mySite.value || siteId || _groupSite.value);
    fetchOrg.value = String(_site?.organization)
    setSite(_site);
  } catch (error) {
    // setSnackbar({ text: "Failed to fetch site", modal: true, type: "error" });
  }
});
