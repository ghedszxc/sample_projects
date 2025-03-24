export default function useLocalRoute() {
  const { currentUser } = useLocalAuth();
  const { $ability } = useNuxtApp();

  const routes = computed(() => {
    if (currentUser.value && currentUser.value.type === "admin") {
      return [
        {
          text: "Dashboard",
          name: "dashboard",
          icon: "mdi-view-dashboard",
          gate: $ability.can("read", "view-dashboard"),
        },
      ];
    }

    if (currentUser.value && currentUser.value.type === "organization") {
      return [
        {
          text: "Dashboard",
          name: "dashboard",
          icon: "mdi-view-dashboard",
          gate: $ability.can("read", "view-dashboard"),
        },
      ];
    }

    if (currentUser.value && currentUser.value.type === "site") {
      return [
        {
          text: "Dashboard",
          name: "dashboard",
          icon: "mdi-view-dashboard",
          gate: $ability.can("read", "view-dashboard"),
        },
      ];
    }

    if (currentUser.value && currentUser.value.type === "service-provider") {
      return [
        {
          text: "Dashboard",
          name: "dashboard",
          icon: "mdi-view-dashboard",
          gate: $ability.can("read", "view-dashboard"),
        },
      ];
    }

    if (
      currentUser.value &&
      currentUser.value.type === "service-provider-member"
    ) {
      return [
        {
          text: "Dashboard",
          name: "dashboard",
          icon: "mdi-view-dashboard",
          gate: $ability.can("read", "view-dashboard"),
        },
      ];
    }
  });

  const services = computed(() => {
    // const dob_config = ["admin", "service-provider", "service-provider-member", "leader"].includes(
    //   currentUser.value.type
    // )
    //   ? true
    //   : false;
    const dob_config = true;

    return [
      {
        text: "Sky-I",
        show: true,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "cctv-filter"
          : "cctv",
        icon: "mdi-cctv",
        gate: $ability.can("read", "view-cctv"),
      },
      {
        text: "Virtual Patrol Management",
        show: true,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "routes-filter"
          : "routes",
        icon: "mdi-camera-metering-partial",
        gate: $ability.can("read", "view-virtual-patrol"),
        sublist: [
          {
            text: "Start Virtual Patrol",
            name: ["admin", "organization", "service-provider"].includes(
              currentUser.value.type,
            )
              ? "routes-start-virtual-patrol-filter"
              : "routes-start-virtual-patrol",
          },
          {
            text: "Virtual Patrol Schedules",
            name: ["admin", "organization", "service-provider"].includes(
              currentUser.value.type,
            )
              ? "routes-filter"
              : "routes",
            // icon: 'mdi-camera-metering-partial'
          },
          {
            text: "Patrol Log Reports",
            name: ["admin", "organization", "service-provider"].includes(
              currentUser.value.type,
            )
              ? "routes-patrol-filter"
              : "routes-patrol-logs",
            // icon: 'mdi-note-text-outline'
          },
        ],
      },
    ];
  });

  const spTypes = computed(() => {
    return ["service-provider", "service-provider-member"];
  });

  const userTypes = computed(() => {
    return [
      "admin",
      "organization",
      "service-provider",
      "service-provider-member",
    ];
  });

  return {
    routes,
    services,
    spTypes,
    userTypes,
  };
}
