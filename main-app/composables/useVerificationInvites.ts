const { useLocalFetchUtil } = useUtils();

export default function useVerificationInvites() {
  class MVerification implements TVerification {
    _id?: string;
    email?: string;
    type?: string;
    expiresAt?: string;
    givenName?: string;
    middleName?: string;
    surname?: string;
    userType?: string;
    site?: string | TSite;
    organization?: string | TOrganization;
    serviceProvider?: string | TServiceProvider;
    serviceProviderGroup?: string | TSPGroup;
    createdAt?: string | Date;
    updatedAt?: string | Date;
    constructor(
      {
        _id,
        type,
        email = "",
        givenName = "",
        middleName = "",
        surname = "",
        userType,
        site,
        organization,
        serviceProvider,
        serviceProviderGroup,
        expiresAt,
        createdAt,
        updatedAt,
      } = {} as TVerification,
    ) {
      this._id = _id;
      this.type = type;
      this.email = email;
      this.givenName = givenName;
      this.middleName = middleName;
      this.surname = surname;
      this.userType = userType;
      this.site = site;
      this.organization = organization;
      this.serviceProvider = serviceProvider;
      this.serviceProviderGroup = serviceProviderGroup;
      this.expiresAt = expiresAt;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
    }
  }

  const verificationUrl = "/api/verification/v1";
  const verification = useState("verification", () => new MVerification());
  const verifications = useState<TVerification[]>(
    "verifications",
    (): TVerification[] => [],
  );
  const searchVerification = useState("searchVerification", () => "");
  const page = useState("pageVerification", () => 1);
  const pages = useState("pagesVerification", () => 1);
  const itemsPerPage = useState("itemsPerPageVerification", () => 10);
  const pageRange = useState("pageRangeVerification", () => "-- - -- of --");
  const isVerificationValid = useState("isVerificationValid", () => false);
  const isLoading = useState("isLoadingVerification", () => false);

  async function resendVerificationEmail(email: string) {
    const data = await useLocalFetchUtil<TVerification | null>(
      `${verificationUrl}/resend/${email}`,
      "PUT",
    );
    return data;
  }

  async function getSpGroupByPageSearch(
    {
      page = 0,
      limit = 10,
      search = "",
      date = "",
      userType,
      organization,
      site,
      serviceProvider,
      serviceProviderGroup,
      createdBy,
    } = {} as IVerificationSearch,
  ) {
    const data = await useLocalFetchUtil<TVerificationResponse>(
      `${verificationUrl}/invites`,
      "GET",
      {
        page,
        limit,
        search,
        date,
        userType,
        organization,
        site,
        serviceProvider,
        serviceProviderGroup,
        createdBy,
      },
    );
    return data;
  }

  async function setVerifications(
    {
      search = "",
      date = "",
      userType,
      organization,
      site,
      serviceProvider,
      serviceProviderGroup,
      createdBy,
    } = {} as IVerificationSearch,
  ) {
    try {
      isLoading.value = true;
      const response = await getSpGroupByPageSearch({
        page: page.value,
        limit: itemsPerPage.value,
        search: search || searchVerification.value,
        date,
        userType,
        organization,
        site,
        serviceProvider,
        serviceProviderGroup,
        createdBy,
      });
      verifications.value = response.items;
      pageRange.value = response.pageRange;
      pages.value = response.pages;
      isLoading.value = false;
    } catch (error) {
      verifications.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isLoading.value = false;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);

  function nextPage(
    {
      userType,
      serviceProvider,
      serviceProviderGroup,
      organization,
    } = {} as IVerificationSearch,
  ) {
    page.value++;
    setVerifications({
      serviceProvider,
      serviceProviderGroup,
      organization,
      userType,
    });
  }

  const canPrevPage = computed(() => page.value <= 1);

  function prevPage(
    {
      userType,
      serviceProvider,
      serviceProviderGroup,
      organization,
    } = {} as IVerificationSearch,
  ) {
    page.value--;
    setVerifications({
      serviceProvider,
      serviceProviderGroup,
      organization,
      userType,
    });
  }

  return {
    page,
    pages,
    pageRange,
    itemsPerPage,
    isLoading,
    isVerificationValid,
    verification,
    verifications,
    searchVerification,
    resendVerificationEmail,
    nextPage,
    prevPage,
    setVerifications,

    canNextPage,
    canPrevPage,
  };
}
