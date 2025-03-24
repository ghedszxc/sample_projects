export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const orgId = route.params.organization as string;
  const { getOrganizationById, setOrganization } = useOrganization();
  const { currentUser } = useLocalAuth();
  const { setSnackbar } = useLocal();
  try {
    if (currentUser.value.type === "service-provider") return;
    const _org = await getOrganizationById(orgId);
    setOrganization(_org);
  } catch (error) {
    setSnackbar({
      text: "Failed to fetch organization",
      modal: true,
      type: "error",
    });
  }
});
