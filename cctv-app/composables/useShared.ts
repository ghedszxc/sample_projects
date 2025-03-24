export default function useShared() {
  const config = useRuntimeConfig().public;
  const cookieOptions = {
    domain: config.DOMAIN,
    secure: true,
    maxAge: 30 * 24 * 60 * 60,
  };

  const routes = computed(() => {
    return [
      {
        text: "Dashboard",
        name: "dashboard",
        icon: "mdi-view-dashboard",
        gate: true,
        params: undefined,
      },
      // add more routes here
    ];
  });

  const services = computed(() => {
    return [
      {
        text: "Cleaners",
        show: true,
        name: "cleaning",
        icon: "mdi-hand-wash",
        gate: true, // change this if role and permission is implemented
        sublist: [
          {
            text: "Audit",
            name: "audit",
            // icon: 'mdi-camera-metering-partial'
          },
          {
            text: "Tickets",
            name: "tickets",
            // icon: 'mdi-camera-metering-partial'
          },
          {
            text: "Schedule Task",
            name: "schedule-task",
            // icon: 'mdi-camera-metering-partial'
          },
          {
            text: "Toilet Card",
            name: "toilet-card",
            // icon: 'mdi-camera-metering-partial'
          },
          {
            text: "Restroom Scheduler",
            name: "restroom-scheduler",
            // icon: 'mdi-camera-metering-partial'
          },
          {
            text: "Area Settings",
            name: "settings",
            // icon: 'mdi-camera-metering-partial'
          },
        ],
      },
      {
        text: "Calendar",
        show: true,
        name: "calendar",
        icon: "mdi-calendar-month-outline",
        gate: true,
      },
    ];
  });

  const drawer = useState("drawer", () => true);
  const theme = useCookie("localTheme", cookieOptions);

  return {
    drawer,
    theme,
    routes,
    services,
  };
}
