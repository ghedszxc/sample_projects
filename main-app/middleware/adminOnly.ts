export default defineNuxtRouteMiddleware(async (route, from) => {
  if (process.server) return;
  const { currentUser, getCurrentUser } = useLocalAuth();

  if (!currentUser.value._id) {
    await getCurrentUser();
  }

  if (currentUser.value && currentUser.value.type !== "admin") {
    if (route.name === from.name) {
      return navigateTo({ name: "index" });
    } else {
      return navigateTo({ name: from.name as string });
    }
  }
});
