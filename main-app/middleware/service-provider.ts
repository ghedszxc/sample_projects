export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const providerId = route.params.provider as string;
  const { getServiceProviderById, setServiceProvider } = useServiceProvider();
  const { setSnackbar } = useLocal();
  try {
    const _serviceProvider = await getServiceProviderById(providerId);
    setServiceProvider(_serviceProvider);
  } catch (error) {
    setSnackbar({ text: "Failed to fetch service provider", modal: true, type: "error" });
  }
});
