export default defineNuxtRouteMiddleware(async () => {
  if (process.server) return;
  const { getOccurrencesOpen, setOccurrence } = useOccurrence();
  const { setSnackbar } = useLocal();
  const { formatDateToDB } = useUtils();
  console.log(useRouter().options);

  try {

    const _dateToday = ref(
      new Intl.DateTimeFormat("en-SG", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      }).format(new Date())
    );
    // remove the org and site query params here
    const _occurrence = await getOccurrencesOpen({
      date: formatDateToDB(_dateToday.value),
    });

    setOccurrence(_occurrence && _occurrence.items[0]);
  } catch (error) {
    setSnackbar({ text: "Failed to fetch occurrence", modal: true, type: "error" });
  }
});
