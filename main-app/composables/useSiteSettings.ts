const { useLocalFetchUtil } = useUtils();

export default function useSiteSettings() {
  class MSiteSettings implements TSiteSettings {
    _id?: string;
    anpr?: {
      showUnregisteredTransactions: boolean;
      cameras: TANPR[];
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
    siteInformation?: TSiteInformation;
    visitorContractorNotificationInterval?: {
      isEnabled: boolean;
      value: number;
    };
    virtualPatrolGracePeriod?: number | null;
    openBarrierForPickupDropoff: boolean;
    entryPass?: {
      isEnabled: boolean;
      api: string | null;
      port: number | null;
      serviceId: string | null;
    };
    autoCheckoutTimings?: TAutoCheckoutTimings;
    configForms?: TConfigForms[] | undefined;
    constructor(
      {
        _id = "",
        anpr = {
          showUnregisteredTransactions: false,
          cameras: [
            {
              isEnabled: false,
              api: null,
              username: null,
              password: null,
              channel: null,
              type: "CHECK-IN",
            },
          ],
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
        siteInformation,
        virtualPatrolGracePeriod,
        openBarrierForPickupDropoff,
        entryPass = {
          isEnabled: false,
          api: null,
          port: null,
          serviceId: null,
        },
        autoCheckoutTimings,
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
      this.openBarrierForPickupDropoff = openBarrierForPickupDropoff;
      this.entryPass = entryPass;
      this.autoCheckoutTimings = autoCheckoutTimings;
      this.configForms = configForms;
    }
  }

  const siteSettingsApiUrl = "/api/sites/v1/site-settings";
  const siteSetting = useState("siteSetting", () => new MSiteSettings());
  const isSiteSettingsLoading = useState("isSiteSettingsLoading", () => false);
  const configForm = useState<TConfigForms>("configForm");
  const configForms = useState("configForms", (): TConfigForms[] => []);

  // Config Forms
  async function createSelectedForms(id: string, payload: TConfigForms[]) {
    const { useLocalFetchUtil } = useUtils();
    const response = await useLocalFetchUtil<TCreateResponse>(
      `${siteSettingsApiUrl}/forms`,
      "POST",
      { payload, id },
    );

    return response;
  }

  async function updateSelectedForms(payload: TConfigForms) {
    const { useLocalFetchUtil } = useUtils();
    const { mySite } = useFilter();
    const response = await useLocalFetchUtil<TCreateResponse>(
      `${siteSettingsApiUrl}/forms/${mySite.value}`,
      "PUT",
      payload,
    );

    return response;
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

  async function getSelectedFormByType(
    type:
      | "Pet Record Form"
      | "Renovation Form"
      | "Letter of Undertaking & Indemnity"
      | "Renovation Refund Form"
      | "Application for Moving"
      | "Application for Electronic Access Card"
      | "Application for Bicycle Parking"
      | "Vehicle Registration Form",
  ) {
    const { useLocalFetchUtil } = useUtils();
    const { mySite } = useFilter();
    console.log("🚀 ~ useSiteSettings ~ mySite:", mySite);
    console.log("🚀 ~ useSiteSettings ~ type:", type);
    const response = await useLocalFetchUtil<TConfigForms>(
      `${siteSettingsApiUrl}/${mySite.value}/forms/${type}/type`,
      "GET",
    );
    console.log("🚀 ~ useSiteSettings ~ response:", response);
    configForm.value = response;
    return response;
  }

  async function getSelectedFormById(id: string) {
    const { useLocalFetchUtil } = useUtils();
    const { mySite } = useFilter();
    const response = await useLocalFetchUtil<TConfigForms>(
      `${siteSettingsApiUrl}/${mySite.value}/forms/${id}`,
      "GET",
    );
    configForm.value = response;
    return response;
  }
  //

  async function updateSiteSettingsById(id: string, payload: TSiteSettings) {
    const result = await useLocalFetchUtil<TSiteSettings | undefined>(
      `${siteSettingsApiUrl}/${id}`,
      "PUT",
      payload,
    );
    setSiteSettings(result);
    return result;
  }

  async function getSiteSettingsById(id: string) {
    isSiteSettingsLoading.value = true;
    const result = await useLocalFetchUtil<TSiteSettings | undefined>(
      `${siteSettingsApiUrl}/${id}`,
      "GET",
    );
    console.log(result);
    setSiteSettings(result);
    isSiteSettingsLoading.value = false;
    return result;
  }

  function setSiteSettings(data?: TSiteSettings) {
    siteSetting.value = new MSiteSettings(data);
  }

  return {
    siteSetting,
    configForms,
    configForm,
    updateSiteSettingsById,
    getSiteSettingsById,
    createSelectedForms,
    updateSelectedForms,
    getAllSelectedForms,
    getSelectedFormById,
    getSelectedFormByType,
    isSiteSettingsLoading,
  };
}
