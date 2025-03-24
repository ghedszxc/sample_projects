export default defineNuxtRouteMiddleware(async (route) => {
  if (process.server) return;
  const siteId = route.params.site as string;
  const { user,setUser, getUserByIdLocal } = useUser();
  const { currentUser } = useLocalAuth();
  const { setSnackbar } = useLocal();

  try {
    const _user = await getUserByIdLocal(currentUser.value._id);
    setUser(_user);
  } catch (error) {
    setSnackbar({ text: "Failed to fetch user", modal: true, type: "error" });
  }
});
