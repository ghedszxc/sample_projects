export default function useLocalRoute() {
  const { currentUser } = useLocalAuth();
  const { $ability } = useNuxtApp();

  const routes = computed(() => {
    const dashboard = {
      text: "Dashboard",
      name: "dashboard",
      icon: "mdi-view-dashboard",
      gate: $ability.can("read", "view-dashboard"),
    };

    const profile = {
      text: "Profile",
      name: "profile",
      icon: "mdi-account",
      gate: $ability.can("read", "view-profile"),
    };

    const organization = {
      text: "Organizations",
      name: "organizations",
      icon: "mdi-home-city",
      gate: $ability.can("read", "view-organizations"),
    };

    const serviceProviders = {
      text: "Service Providers",
      name: "service-providers",
      icon: "mdi-toolbox-outline",
      gate: $ability.can("read", "view-service-providers"),
    };

    const seven365Team = {
      text: "Seven365 Team",
      name: "team",
      icon: "mdi-account-group",
      gate: $ability.can("read", "view-teams"),
    };

    const calendar = {
      text: "Calendar",
      name: ["admin", "organization", "service-provider"].includes(
        currentUser.value.type,
      )
        ? "events-filter"
        : "events",
      icon: "mdi-calendar-multiple",
      gate: $ability.can("read", "view-calendar"),
    };

    const rolesAndPermissions = {
      text: "Roles & Permissions",
      name: "roles",
      icon: "mdi-shield-account",
      gate: $ability.can("read", "view-roles"),
    };

    const sites = {
      text: "Sites",
      name: "organizations-organization-sites",
      params: {
        organization:
          currentUser.value.organization || currentUser.value.serviceProvider,
      },
      icon: "mdi-home-city",
      gate: $ability.can("read", "view-sites"),
    };

    const agencyMembers = {
      text: "Agency Members",
      name: "team",
      icon: "mdi-account-group",
      gate: $ability.can("read", "view-teams"),
    };

    const feedbacks = {
      text: "Feedbacks",
      name: ["admin", "organization", "service-provider"].includes(
        currentUser.value.type,
      )
        ? "feedbacks-filter"
        : "feedbacks",
      icon: "mdi-comment-quote-outline",
      gate: $ability.can("read", "view-feedbacks"),
    };

    const workOrders = {
      text: "Work Orders",
      name: ["admin", "organization", "service-provider"].includes(
        currentUser.value.type,
      )
        ? "work-orders-filter"
        : "work-orders",
      icon: "mdi-file-word",
      gate: $ability.can("read", "view-work-orders"),
    };

    const serviceProviders2 = {
      text: "Service Providers",
      name: "organizations-organization-sites-site-service-providers",
      params: {
        organization: currentUser.value.organization,
        site: currentUser.value.site,
      },
      icon: "mdi-toolbox-outline",
      gate: $ability.can("read", "view-service-providers"),
    };

    const residents = {
      text: "Residents",
      name: "organizations-organization-sites-site-residents",
      params: {
        organization: currentUser.value.organization,
        site: currentUser.value.site,
      },
      icon: "mdi-home-city",
      gate: $ability.can("read", "view-residents"),
    };

    const forms = {
      text: "Forms Management",
      show: true,
      name: "forms-management",
      icon: "mdi-newspaper",
      gate:
        $ability.can("read", "view-all-forms") ||
        $ability.can("read", "view-all-forms-config"),
      sublist: [
        {
          text: "Forms",
          name: "forms",
          gate: $ability.can("read", "view-all-forms"),
          params: {
            organization: currentUser.value.organization,
            site: currentUser.value.site,
          },
        },
        {
          text: "Configure Forms",
          name: "forms-config",
          gate: $ability.can("read", "view-all-forms-config"),
          params: {
            organization: currentUser.value.organization,
            site: currentUser.value.site,
          },
        },
      ],
    };

    const siteMembers = {
      text: "Site Members",
      name: "team",
      icon: "mdi-account-group",
      gate: $ability.can("read", "view-teams"),
    };

    const facilityMgt = {
      text: "Facility Management",
      show: true,
      name: "facilities",
      icon: "mdi-comment-account-outline",
      gate: $ability.can("read", "view-facility"),
      sublist: [
        {
          text: "Facilities",
          name: "facilities",
          gate: true,
          // icon: 'mdi-camera-metering-partial'
        },
        {
          text: "Bookings",
          name: "facilities-bookings",
          gate: true,
          // icon: 'mdi-note-text-outline'
        },
        {
          text: "Settings",
          name: "facilities-settings",
          gate: true,
          // icon: 'mdi-note-text-outline'
        },
      ],
    };

    const serviceProviderMgtTeam = {
      text: "Service Provider Management Team",
      name: "team",
      icon: "mdi-account-group",
      gate: $ability.can("read", "view-teams"),
    };

    const siteGroups = {
      text: "Service Provider Teams",
      name: "site-group",
      icon: "mdi-account-group-outline",
      gate: $ability.can("read", "view-site-groups"),
    };

    const siteCollaboration = {
      text: "Site Invitations",
      name: "collaboration",
      icon: "mdi-source-merge",
      gate: $ability.can("read", "view-site-collab"),
    };

    const groupMembers = {
      text: "Group Members",
      name: "site-group-group-member",
      params: {
        group: currentUser.value.serviceProviderGroup,
      },
      icon: "mdi-account-group-outline",
      gate: $ability.can("read", "view-teams"),
    };

    if (currentUser.value && currentUser.value.type === "admin") {
      return [
        dashboard,
        profile,
        organization,
        serviceProviders,
        seven365Team,
        rolesAndPermissions,
        calendar,
      ];
    }

    if (currentUser.value && currentUser.value.type === "organization") {
      return [
        dashboard,
        profile,
        sites,
        agencyMembers,
        rolesAndPermissions,
        feedbacks,
        workOrders,
        calendar,
      ];
    }

    if (currentUser.value && currentUser.value.type === "site") {
      return [
        dashboard,
        profile,
        organization,
        serviceProviders2,
        residents,
        forms,
        siteMembers,
        rolesAndPermissions,
        facilityMgt,
        feedbacks,
        workOrders,
        calendar,
      ];
    }

    if (currentUser.value && currentUser.value.type === "service-provider") {
      return [
        dashboard,
        profile,
        sites,
        serviceProviderMgtTeam,
        rolesAndPermissions,
        feedbacks,
        workOrders,
        calendar,
        siteGroups,
        siteCollaboration,
      ];
    }

    if (
      currentUser.value &&
      currentUser.value.type === "service-provider-member"
    ) {
      return [
        dashboard,
        profile,
        organization,
        rolesAndPermissions,
        feedbacks,
        workOrders,
        calendar,
        groupMembers,
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
        text: "Pass & Key Management",
        show: true,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "keys-filter"
          : "keys",
        icon: "mdi-security",
        gate: $ability.can("read", "view-keys"),
        sublist: [
          {
            gate: true,
            text: "Manage Template",
            name: ["admin", "organization", "service-provider"].includes(
              currentUser.value.type,
            )
              ? "keys-manage-pass-template-filter"
              : "keys-manage-pass-template",
            // name: "keys-manage-pass-template",
          },
          {
            gate: true,
            text: "Manage Pass & Key",
            name: ["admin", "organization", "service-provider"].includes(
              currentUser.value.type,
            )
              ? "keys-visitor-filter"
              : "keys-visitor",
            // name: "keys-visitor",
            // query: {
            //   site: currentUser.value.site,
            // },
          },
        ],
      },
      {
        text: "Visitor Management",
        show: true,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "visitors-filter"
          : "visitors",
        icon: "mdi-badge-account",
        gate: $ability.can("read", "view-visitors"),
      },
      {
        text: "Building Management",
        show: true,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "building-blocks-filter"
          : "building-blocks",
        icon: "mdi-domain",
        gate: $ability.can("read", "view-buildings"),
      },
      {
        text: "Configuration",
        show: true,
        name: ["admin", "organization"].includes(currentUser.value.type)
          ? "announcements-filter"
          : "announcements",

        icon: "mdi-camera-metering-partial",
        gate: $ability.can("read", "view-announcements"),
        sublist: [
          {
            gate: true,
            text: "Bulletin Board",
            name: ["admin", "organization"].includes(currentUser.value.type)
              ? "announcements-filter"
              : "announcements",

            // icon: 'mdi-camera-metering-partial'
          },
          {
            gate: true,
            text: "Emergency Contact Configuration",
            name: ["admin", "organization"].includes(currentUser.value.type)
              ? "emergency-contacts-filter"
              : "emergency-contacts",

            // icon: 'mdi-camera-metering-partial'
          },
        ],
      },
      {
        text: `Vehicle Management`,
        show: true,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "vehicles-filter"
          : "vehicles",
        icon: "mdi-car",
        gate: $ability.can("read", "view-vehicles"),
      },
      {
        text: `Daily Occurrence Book`,
        show: true,
        name: [
          "admin",
          "organization",
          "site",
          "site-personnel",
          "service-provider",
        ].includes(currentUser.value.type)
          ? currentUser.value.type == "site"
            ? "occurrences"
            : "occurrences-filter"
          : "occurrences-today",
        icon: "mdi-book-open-page-variant",
        gate: $ability.can("read", "view-dob"),
      },
      {
        text: "DOB Subject Configuration",
        show: dob_config,
        name: ["admin", "organization", "service-provider"].includes(
          currentUser.value.type,
        )
          ? "log-subject-filter"
          : "log-subject",
        icon: "mdi-cog-outline",
        gate: $ability.can("read", "view-dob-service-config"),
      },
      {
        text: "Incident Management",
        show: true,
        name: [
          "admin",
          "organization",
          "site-personnel",
          "service-provider",
        ].includes(currentUser.value.type)
          ? "incidents-filter"
          : "incidents",
        icon: "mdi-alert-octagon-outline",
        gate: $ability.can("read", "view-incidents"),
      },
      {
        text: "Sky-I",
        show: true,
        isLink: true,
        icon: "mdi-cctv",
        gate: $ability.can("read", "view-cctv"),
      },
      {
        text: "Entry Pass",
        show: true,
        icon: "mdi-credit-card-wireless",
        gate: $ability.can("read", "view-buildings"),
        name: "entry-pass",
        // ["admin", "organization", "service-provider"].includes(currentUser.value.type) ? "visitors-filter" : "visitors"

        sublist: [
          {
            text: "Contractor/Visitor",
            name: "entry-pass-contractor-visitor",
            gate: true,
            //   name: ["admin", "organization", "service-provider"].includes(
            //     currentUser.value.type,
            //   )
            //     ? "keys-manage-pass-template-filter"
            //     : "keys-manage-pass-template",
          },
          {
            text: "Resident/Tenant",
            name: "entry-pass-resident-tenant",
            gate: true,
            //   name: ["admin", "organization", "service-provider"].includes(
            //     currentUser.value.type,
            //   )
            //     ? "keys-visitor-filter"
            //     : "keys-visitor",
          },
          {
            text: "Settings",
            name: "entry-pass-settings",
            gate: true,
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
