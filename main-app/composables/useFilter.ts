export default function useFilter() {
  const { currentUser } = useLocalAuth();
  const { sites, setSites, setProviderFilterSites } = useSite();
  const { setSitesCollab, sitesCollab } = useSiteCollab();
  const { spGroup, getSPGroupById } = useSPGroup();
  const route = useRoute();

  const globalSite = useState<string>("globalSite", () => "");

  const siteQuery = computed(
    () => route.query.site && String(route.query.site),
  );

  const siteParam = computed(
    () => route.params.site && String(route.params.site),
  );

  const orgQuery = computed(
    () => route.query.organization && String(route.query.organization),
  );

  const orgParam = computed(
    () => route.params.organization && String(route.params.organization),
  );

  const providerQuery = computed(
    () => route.query.serviceProvider && String(route.query.serviceProvider),
  );

  const providerParam = computed(
    () => route.params.serviceProvider && String(route.params.serviceProvider),
  );

  const { type, organization, serviceProvider } = computed(
    () => currentUser.value,
  ).value;

  const currentProvider = computed(() =>
    currentUser.value.serviceProvider &&
    Boolean(currentUser.value.serviceProvider) &&
    typeof currentUser.value.serviceProvider === "object"
      ? currentUser.value.serviceProvider._id || ""
      : typeof currentUser.value.serviceProvider === "string"
        ? currentUser.value.serviceProvider
        : undefined,
  );

  const currentOrg = computed(() =>
    currentUser.value.organization &&
    Boolean(currentUser.value.organization) &&
    typeof currentUser.value.organization === "object"
      ? currentUser.value.organization._id || ""
      : typeof currentUser.value.organization === "string"
        ? currentUser.value.organization
        : undefined,
  );

  const currentSite = computed(() =>
    currentUser.value.site &&
    Boolean(currentUser.value.site) &&
    typeof currentUser.value.site === "object"
      ? currentUser.value.site._id || ""
      : typeof currentUser.value.site === "string"
        ? currentUser.value.site
        : undefined,
  );
  const currentServiceProvider = computed(() =>
    typeof serviceProvider === "object"
      ? serviceProvider._id || ""
      : serviceProvider,
  );
  const currentSpg = computed(() =>
    currentUser.value.serviceProviderGroup &&
    Boolean(currentUser.value.serviceProviderGroup) &&
    typeof currentUser.value.serviceProviderGroup === "object"
      ? currentUser.value.serviceProviderGroup._id || ""
      : typeof currentUser.value.serviceProviderGroup === "string"
        ? currentUser.value.serviceProviderGroup
        : undefined,
  );

  const collaboratedSite = computed(() =>
    spGroup.value.site &&
    Boolean(spGroup.value.site) &&
    typeof spGroup.value.site === "object"
      ? spGroup.value.site._id || ""
      : typeof spGroup.value.site === "string"
        ? spGroup.value.site
        : undefined,
  );
  const collaboratedSiteOrganization = computed(() =>
    spGroup.value.site &&
    Boolean(spGroup.value.site) &&
    typeof spGroup.value.site === "object"
      ? spGroup.value.site.organization || ""
      : typeof spGroup.value.site === "string"
        ? spGroup.value.site
        : undefined,
  );
  const collaboratedProvider = computed(() =>
    spGroup.value.serviceProvider &&
    Boolean(spGroup.value.serviceProvider) &&
    typeof spGroup.value.serviceProvider === "object"
      ? spGroup.value.serviceProvider._id || ""
      : typeof spGroup.value.serviceProvider === "string"
        ? spGroup.value.serviceProvider
        : undefined,
  );

  watchEffect(() => {
    if (
      siteQuery.value ||
      currentSite.value ||
      collaboratedSite.value ||
      siteParam.value
    )
      globalSite.value =
        siteQuery.value ||
        currentSite.value ||
        collaboratedSite.value ||
        siteParam.value;
  });

  const mySite = computed(
    () =>
      siteQuery.value || // site thru routes = UI Filtering in MA & Service Provider Management
      currentSite.value || // site using currentUser.site = Site Personnel
      collaboratedSite.value || // site using site in ServiceProviderGroup = Service provider group member/Service provider Team
      siteParam.value ||
      globalSite.value ||
      "",
  );

  const myOrg = computed(
    () =>
      currentOrg.value ||
      orgQuery.value ||
      currentProvider.value ||
      orgParam.value ||
      fetchOrg.value ||
      collaboratedSiteOrganization.value,
  );

  const myProvider = computed(
    () =>
      providerQuery.value ||
      currentProvider.value ||
      collaboratedProvider.value ||
      providerParam.value ||
      "",
  );

  const siteOptions = useState<TSite[]>("siteOptions", () => []);
  const filterOrganization = useState<string>("filterOrganization", () => "");
  const filterSite = useState<string>("filterSite", () => "");
  const fetchOrg = useState<string>("fetchOrg", () => "");

  async function getSitesOptionsForFiltering() {
    // get collaborated site in the service-provider-group collections
    if (currentSpg.value && /^(service-provider-member)$/i.test(type)) {
      await getSPGroupById(currentSpg.value || "");
    }
    // for filtering UI auto fill for the Selections
    if (/^(admin)$/i.test(type)) {
      await setSites(filterOrganization.value);
      siteOptions.value = [...sites.value];
    } else if (/^(organization)$/i.test(type)) {
      if (typeof organization === "string") {
        await setSites(organization || "");
      } else {
        await setSites(organization?._id || "");
      }
      siteOptions.value = [...sites.value];
    } else if (/^(service-provider)$/i.test(type)) {
      const _serviceProviderSites = await setProviderFilterSites({
        serviceProvider: currentServiceProvider.value,
        status: "active",
        limit: 1000000000,
      });
      // await setSitesCollab({
      //   serviceProvider: currentServiceProvider.value,
      //   status: "approved",
      //   limit: 1000000000, // set to no limit
      // });

      siteOptions.value = [..._serviceProviderSites].map((item: any) => {
        item.name =
          item.category === "owned" ? `${item.name} (Owned)` : item.name;

        return item;
      });
    }
    return siteOptions.value;
  }

  return {
    getSitesOptionsForFiltering,
    siteOptions,
    filterOrganization,
    filterSite,
    fetchOrg,
    globalSite,
    mySite,
    myOrg,
    myProvider,
  };
}
