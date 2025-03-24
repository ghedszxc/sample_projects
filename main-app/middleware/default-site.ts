export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return;
  const { currentUser } = useLocalAuth();
  const { site, setSite, getSiteById } = useSite();
  const { setSnackbar } = useLocal();
  const { getServiceProviderGroupById } = useServiceProvider()
  const route = useRoute();
  const siteObject = ref<TServiceProvider>({});

  const loadSite = async (siteId: string) => {
    try {
      const siteObject = await getSiteById(String(siteId));
      setSite(siteObject);
    } catch (error) {
      setSnackbar({ text: "Failed to set site", modal: true, type: "error" });
    }
  };

  const updateSite = async () => {
    
    if (['admin','organization','service-provider','service-provider-member'].includes(currentUser.value.type) &&
      (typeof currentUser.value.site === "object" || currentUser.value.site == null || currentUser.value.site == "")) {

      if (route.params?.site || route.query?.site) {
        const _site = route.params?.site || route.query?.site;
        await loadSite(String(_site));
      } else {
        const siteFromGroup = await getServiceProviderGroupById(String(currentUser.value.serviceProviderGroup));
        await loadSite(String(siteFromGroup));
      }

    } else {
      await loadSite(String(currentUser.value.site));
    }
   
   
    console.log("from middleware", site.value);
  };

   // Initial site load
   await updateSite();

   // Watch for changes in route.query.site and route.params.site and update site accordingly
   watch([() => route.query.site, () => route.params.site], (newValue) => {
     updateSite();
   });
 
   // Handle route updates
   onBeforeRouteUpdate((to, from, next) => {
   
     updateSite();
     next();
   });

});
