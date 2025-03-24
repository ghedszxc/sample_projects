export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const { currentUser } = useLocalAuth();
  const { setSnackbar } = useLocal();
  const { setIncidents, incidents, selectFilter } = useIncident();

  try {
    await setIncidents({
      organization: currentUser.value.organization,
      site: currentUser.value.site,
      status: 'approved&&pending'
    });
  } catch (error) {
    setSnackbar({ text: "Failed to fetch incidents", modal: true, type: "error" });
  }
});
