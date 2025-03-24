export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const { currentUser } = useLocalAuth();
  const { setSnackbar } = useLocal();
  const { setLogSubjects } = useLogSubject();

  try {
    await setLogSubjects({
      organization: currentUser.value.organization,
      site: currentUser.value.site,
      serviceProvider: currentUser.value.serviceProvider
    });
  } catch (error) {
    setSnackbar({ text: "Failed to fetch subject", modal: true, type: "error" });
  }
});
