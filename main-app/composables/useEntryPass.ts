export default function useEntryPass() {
  class MAccessCard implements TAccessCard {
    _id?: string;
    userId?: string;
    staffNo: string;
    fullName: string;
    dateOrBirth: Date | string | null;
    dateOfJoin: Date | string | null;
    accessLevel: string | null;
    accessType: string | null;
    cardNo: string;
    pin: string;
    startDate: Date | string | null;
    endDate: Date | string | null;
    isActivated: boolean;
    isAntiPassBack: boolean;
    isLiftCard: boolean;
    liftAccessLevel?: string | null;
    liftAccessStartDate?: Date | string | null;
    liftAccessEndDate?: Date | string | null;

    constructor(
      {
        _id = "",
        userId = "",
        staffNo = "",
        fullName = "",
        dateOrBirth = "",
        dateOfJoin = "",
        accessLevel = null,
        accessType = "Normal",
        cardNo = "",
        pin = "",
        startDate = "",
        endDate = "",
        isActivated = false,
        isAntiPassBack = false,
        isLiftCard = false,
        liftAccessLevel = null,
        liftAccessStartDate = "",
        liftAccessEndDate = "",
      } = {} as TAccessCard,
    ) {
      this._id = _id;
      this.userId = userId;
      this.staffNo = staffNo;
      this.fullName = fullName;
      this.dateOrBirth = dateOrBirth;
      this.dateOfJoin = dateOfJoin;
      this.accessLevel = accessLevel;
      this.accessType = accessType;
      this.cardNo = cardNo;
      this.pin = pin;
      this.startDate = startDate;
      this.endDate = endDate;
      this.isActivated = isActivated;
      this.isAntiPassBack = isAntiPassBack;
      this.isLiftCard = isLiftCard;
      this.liftAccessLevel = liftAccessLevel;
      this.liftAccessStartDate = liftAccessStartDate;
      this.liftAccessEndDate = liftAccessEndDate;
    }
  }

  const entryPassApiUrl = "/api/entrypass";
  const accessCard = useState("accessCard", () => new MAccessCard());
  const isAssigningNFC = useState("isAssigningNFC", () => false);
  const accessCards = useState(
    "accessCards",
    (): TAccessCardByTypeItem[] => [],
  );
  const qrCodeAccessCards = useState("qrCodeAccessCards", (): {}[] => []);
  const page = useState("accessCardPage", () => 1);
  const pages = useState("accessCardPages", () => 1);
  const itemsPerPage = useState("accessCardItemsPerPage", () => 10);
  const search = useState("accessCardSearch", () => "");
  const pageRange = useState("accessCardPageRange", () => "-- - -- of --");
  const isAccessCardLoading = useState("isAccessCardLoading", () => false);
  const openDialog = useState("openDialog", () => "");

  const isAccessCardDialog = useState("isAccessCardDialog", () => false);
  const assignMultipleDialog = useState("assignMultipleDialog", () => false);

  function setAccessCard(data?: TAccessCard) {
    accessCard.value = data || new MAccessCard();
  }

  async function addAssignNFC({
    site,
    accessCard,
    userId,
  }: {
    site: string;
    accessCard: TAccessCard;
    userId: string;
  }) {
    delete accessCard._id;
    accessCard.userId = userId;
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/assign-nfc`,
      {
        method: "POST",
        body: JSON.stringify({
          site,
          ...accessCard,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  const pageNfc = useState("pageNfc", () => 1);
  const pageQrCode = useState("pageQrCode", () => 1);

  const pageRangeNfc = useState("pageRangeNfc", () => "-- - -- of --");
  const pageRangeQrCode = useState("pageRangeQrCode", () => "-- - -- of --");

  const qrCodeList = useState("qrCodeList", () => []);

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  async function getNfcQrCodeList(payload: any) {
    try {
      isAccessCardLoading.value = true;
      const { data } = await useLocalFetch(`${entryPassApiUrl}/access-card`, {
        method: "GET",
        query: payload,
      });

      if (payload.type == "NFC") {
        nfcList.value = data.value?.items;
        pageRangeNfc.value = data.value?.pageRange;
        pageNfc.value = data.value?.pages;
      } else {
        qrCodeList.value = data.value?.items;
        pageRangeQrCode.value = data.value?.pageRange;
        pageQrCode.value = data.value?.pages;
      }

      isAccessCardLoading.value = false;
    } catch (err) {
      if (payload.type == "NFC") {
        nfcList.value = [];
        pageRangeNfc.value = "-- - -- of --";
        pageNfc.value = 1;
      } else {
        qrCodeList.value = [];
        pageRangeQrCode.value = "-- - -- of --";
        pageQrCode.value = 1;
      }

      isAccessCardLoading.value = false;
    }
  }

  const availableAccessCardDialog = useState(
    "availableAccessCardDialog",
    () => false,
  );
  const assignedAccessCardDialog = useState(
    "assignedAccessCardDialog",
    () => false,
  );

  async function getAccessCards({
    page = 1,
    limit = itemsPerPage.value,
    site,
    organization,
    search = "",
    type,
  }: {
    page: number;
    limit?: number;
    site: string;
    organization?: string;
    search?: string;
    type: string;
  }) {
    try {
      isAccessCardLoading.value = true;
      const result = (await getAccessCardsByType({
        page,
        site,
        limit,
        organization,
        search,
        type,
      })) as TAccessCardByTypeResult;

      accessCards.value = result.items;
      pages.value = result.pages;
      pageRange.value = result.pageRange;

      isAccessCardLoading.value = false;
    } catch (error) {
      isAccessCardLoading.value = false;
    }
  }

  async function getAccessCardsByType({
    page,
    limit,
    site,
    organization,
    search,
    type,
  }: {
    page: number;
    limit?: number;
    site: string;
    organization?: string;
    search?: string;
    type: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/access-card/${type}`,
      {
        method: "GET",
        query: { page, limit, site, organization, search },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function assignAccessCards({
    assignees,
    type,
    unit,
  }: {
    assignees: string[];
    type: string;
    unit: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/assign-multiple`,
      {
        method: "POST",
        body: JSON.stringify({
          assignees,
          type,
          unit,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function getDoorAccessLevels() {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/door-levels`,
      {
        method: "GET",
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function getLiftAccessLevels() {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/lift-levels`,
      {
        method: "GET",
      },
    );
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function transferAccessCards({
    from,
    type,
    to,
  }: {
    from: string;
    type: string;
    to: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/transfer-card`,
      {
        method: "POST",
        query: { from, type, to },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function updateAccessCardStatus({
    userId,
    type,
    status,
  }: {
    userId: string;
    type: string;
    status: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/update-status`,
      {
        method: "PUT",
        query: { userId, type, status },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  async function addNonPhysicalAccessCard({
    site,
    quantity,
    accessLevels,
    userType,
  }: {
    site: string;
    quantity: number;
    accessLevels: string[];
    userType: EAccessCardUserTypes;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/add-non-physical-card`,
      {
        method: "POST",
        body: JSON.stringify({
          site,
          quantity,
          accessLevels,
          userType,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  return {
    accessCard,
    addAssignNFC,
    isAssigningNFC,
    accessCards,
    page,
    pages,
    pageRange,
    itemsPerPage,
    search,
    isAccessCardLoading,
    setAccessCard,
    openDialog,
    qrCodeAccessCards,
    getNfcQrCodeList,

    pageNfc,
    pageQrCode,

    pageRangeNfc,
    pageRangeQrCode,

    qrCodeList,

    isAccessCardDialog,

    availableAccessCardDialog,
    assignedAccessCardDialog,
    assignMultipleDialog,
    getAccessCards,
    canNextPage,
    canPrevPage,
    assignAccessCards,
    getLiftAccessLevels,
    getDoorAccessLevels,
    transferAccessCards,
    updateAccessCardStatus,
    addNonPhysicalAccessCard,
  };
}
