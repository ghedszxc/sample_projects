export default defineNuxtRouteMiddleware(async (to) => {
  if (process.server) return;
  const { loggedIn, getCurrentUser, currentUser } = useLocalAuth();
  if (loggedIn.value) {
    const account: any = await getCurrentUser();
    currentUser.value = account;
    if (to.path === "/" || to.path === "/login") {
      return navigateTo("/resident");
    }
  }
});
