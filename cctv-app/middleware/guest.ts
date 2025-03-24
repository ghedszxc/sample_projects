export default defineNuxtRouteMiddleware(() => {
  const { loggedIn } = useLocalAuth();

  if (loggedIn.value) {
    return navigateTo({ name: "index" });
  }
});
