const { useLocalFetchUtil } = useUtils();

export default function useLogSubject() {
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
    virtualPatrolSettings?: TVirtualPatrolSettings | undefined;
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
        virtualPatrolGracePeriod = 15,
        virtualPatrolSettings,
      } = {} as TSiteSettings,
    ) {
      this._id = _id;
      this.anpr = anpr;
      this.cctv = cctv;
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
      this.virtualPatrolSettings = virtualPatrolSettings;
    }
  }

  const siteSettingsApiUrl = "/api/sites/v1/site-settings";
  const siteSetting = useState("siteSetting", () => new MSiteSettings());
  const isSiteSettingsLoading = useState("isSiteSettingsLoading", () => false);

  async function updateSiteSettingsById(id: string, payload: TSiteSettings) {
    const result = await useLocalFetchUtil<TSiteSettings | undefined>(
      `${siteSettingsApiUrl}/${id}`,
      "PUT",
      payload,
    );
    setLogSubject(result);
    return result;
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

  function setLogSubject(data?: TSiteSettings) {
    siteSetting.value = new MSiteSettings(data);
  }

  return {
    siteSetting,
    updateSiteSettingsById,
    getSiteSettingsById,
    isSiteSettingsLoading,
  };
}
