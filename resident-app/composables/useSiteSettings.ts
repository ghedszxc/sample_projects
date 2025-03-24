const { useLocalFetchUtil } = useUtils();

export default function useSiteSettings() {
  class MSiteSettings implements TSiteSettings {
    _id?: string;
    anpr?: {
      isEnabled: boolean;
      api: string | null;
      username: string | null;
      password: string | null;
      channel: number | null;
    };
    cctv?: {
      url: string | null;
      username: string | null;
      password: string | null;
    };
    virtualPatrolSettings: {
      isScreenshotOrRecordingEnabled: boolean;
    };
    autoCheckOut: boolean;
    qrCode?: boolean;
    manualCheckIn?: boolean;
    pickUpdropOffCompanyList?: string[];
    deliveryCompanyList?: string[];
    seasonPassType?: string[];
    taxiHireCompanies?: string[];
    privateHireCompanies?: string[];
    visitorAllotedTime?: TVisitorAllotedTime;
    contractorAllotedTime?: TContractorAllotedTime;
    siteInformation?: {
      bgImage: string | null;
      description: string | null;
      docs: [];
    };
    visitorContractorNotificationInterval?: {
      isEnabled: boolean;
      value: number;
    };
    virtualPatrolGracePeriod?: number | null;
    configForms?: TConfigForms[] | undefined;
    constructor(
      {
        _id = "",
        anpr = {
          isEnabled: false,
          api: null,
          username: null,
          password: null,
          channel: null,
        },
        cctv = {
          url: null,
          username: null,
          password: null,
        },
        virtualPatrolSettings = {
          isScreenshotOrRecordingEnabled: false,
        },
        autoCheckOut,
        qrCode,
        manualCheckIn,
        pickUpdropOffCompanyList,
        deliveryCompanyList,
        seasonPassType,
        taxiHireCompanies,
        privateHireCompanies,
        visitorAllotedTime,
        contractorAllotedTime,
        visitorContractorNotificationInterval,
        siteInformation = {
          bgImage: null,
          description: null,
          docs: [],
        },
        virtualPatrolGracePeriod,
        configForms,
      } = {} as TSiteSettings,
    ) {
      this._id = _id;
      this.anpr = anpr;
      this.cctv = cctv;
      this.virtualPatrolSettings = virtualPatrolSettings;
      this.autoCheckOut = autoCheckOut;
      this.qrCode = qrCode;
      this.manualCheckIn = manualCheckIn;
      this.pickUpdropOffCompanyList = pickUpdropOffCompanyList;
      this.deliveryCompanyList = deliveryCompanyList;
      this.seasonPassType = seasonPassType;
      this.taxiHireCompanies = taxiHireCompanies;
      this.privateHireCompanies = privateHireCompanies;
      this.visitorAllotedTime = visitorAllotedTime;
      this.contractorAllotedTime = contractorAllotedTime;
      this.visitorContractorNotificationInterval =
        visitorContractorNotificationInterval;
      this.siteInformation = siteInformation;
      this.virtualPatrolGracePeriod = virtualPatrolGracePeriod;
      this.configForms = configForms;
    }
  }

  const siteSettingsApiUrl = "/api/sites/v1/site-settings";
  const siteSetting = useState("siteSetting", () => new MSiteSettings());
  const isSiteSettingsLoading = useState("isSiteSettingsLoading", () => false);
  const configForm = useState<TConfigForms>("configForm");
  const configForms = useState("configForms", (): TConfigForms[] => []);

  async function updateSiteSettingsById(id: string, payload: TSiteSettings) {
    const result = await useLocalFetchUtil<TSiteSettings | undefined>(
      `${siteSettingsApiUrl}/${id}`,
      "PUT",
      payload,
    );
    setLogSubject(result);

    return result;
  }

  async function getAllSelectedForms(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const response = await useLocalFetchUtil<{
      configForms: TConfigForms[];
      id: string;
    }>(`${siteSettingsApiUrl}/${id}/forms`, "GET");
    if (response && response.configForms) {
      configForms.value = response.configForms;
    }
    return response;
  }

  async function getSiteSettingsById(id: string) {
    isSiteSettingsLoading.value = true;
    const result = await useLocalFetchUtil<TSiteSettings | undefined>(
      `${siteSettingsApiUrl}/${id}`,
      "GET",
    );

    setLogSubject(result);
    isSiteSettingsLoading.value = false;
    return result;
  }

  async function getSelectedFormById(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const { currentUser } = useLocalAuth();
    const response = await useLocalFetchUtil<TConfigForms>(
      `${siteSettingsApiUrl}/${currentUser.value.site}/forms/${id}`,
      "GET",
    );
    configForm.value = response;
    return response;
  }

  function setLogSubject(data?: TSiteSettings) {
    siteSetting.value = new MSiteSettings(data);
  }

  return {
    siteSetting,
    configForm,
    configForms,
    updateSiteSettingsById,
    getAllSelectedForms,
    getSiteSettingsById,
    getSelectedFormById,
    isSiteSettingsLoading,
  };
}
