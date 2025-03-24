export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const groupId = route.params.group as string;
  const { getSPGroupById, spGroup, setSPGroup } = useSPGroup();
  const { setSnackbar } = useLocal();
  try {
    const _serviceProviderGroup = await getSPGroupById(groupId);
    setSPGroup(_serviceProviderGroup);
  } catch (error) {
    setSnackbar({ text: "Failed to fetch service provider groups", modal: true, type: "error" });
  }
});
