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
    qrData: string;
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
        qrData = "",
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
      this.qrData = qrData;
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
  const isUploadingNFC = useState("isUploadingNFC", () => false);
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

  const accessCardLogs = useState(
    "accessCardLogs",
    (): TAccessCardTransactions[] => [],
  );

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
  const totalCardCount = useState(
    "totalCardCount",
    (): TTotalCardCount => ({
      assigned_non_physical: 0,
      assigned_physical: 0,
      available_non_physical: 0,
      available_physical: 0,
    }),
  );

  const qrCodeList = useState("qrCodeList", () => []);
  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);
  const availableAccessCardDialog = useState(
    "availableAccessCardDialog",
    () => "",
  );
  const assignedAccessCardDialog = useState(
    "assignedAccessCardDialog",
    () => "",
  );

  async function getAccessCard({
    user,
    type,
  }: {
    user: string;
    type?: string;
  }) {
    try {
      isAccessCardLoading.value = true;
      const result = (await getAccessCardByUser({
        user,
        type,
      })) as TAccessCard | null;

      setAccessCard(result || undefined);
      isAccessCardLoading.value = false;
    } catch (error) {
      isAccessCardLoading.value = false;
    }
  }

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
      totalCardCount.value = result.totalCardCount;

      isAccessCardLoading.value = false;
    } catch (error) {
      isAccessCardLoading.value = false;
    }
  }

  async function getAccessCardByUser({
    user,
    type,
  }: {
    user: string;
    type?: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/access-card/user/${user}`,
      {
        method: "GET",
        query: { type },
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

  async function updateEntryPassSettings(site: string, payload: any) {
    const { error, data } = await useLocalFetch(`${entryPassApiUrl}/settings`, {
      method: "POST",
      query: { site },
      body: JSON.stringify(payload),
    });

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
    accessLevel,
    userType,
  }: {
    site: string;
    quantity: number;
    accessLevel: string;
    userType: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/add-non-physical-card`,
      {
        method: "POST",
        body: JSON.stringify({
          site,
          quantity,
          accessLevel,
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

  async function addPhysicalAccessCard({ payload }: { payload: TAccessCard }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/add-physical-card`,
      {
        method: "POST",
        body: JSON.stringify({
          ...payload,
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

  async function assignAccessCardsToUnit({
    site,
    quantity,
    units,
    userType,
    type,
  }: {
    units: string[];
    quantity: number;
    type: string;
    site: string;
    userType: "Resident/Tenant" | "Contractor" | "Visitor";
  }) {
    const { error, data } = await useLocalFetch(
      `${entryPassApiUrl}/assign-unit`,
      {
        method: "POST",
        body: JSON.stringify({
          site,
          quantity,
          units,
          userType,
          type,
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

  async function upload({ file, site }: { file: any; site: string }) {
    const { error, data } = await useLocalFetch(`${entryPassApiUrl}/upload`, {
      method: "POST",
      body: file,
      query: { site },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value);
    }
  }

  const assignedNfcCardList = useState("assignedNfcCardList", () => []);
  const assignedNfcCardListPage = useState("assignedNfcCardListPage", () => 1);
  const assignedNfcCardListPageRange = useState(
    "assignedNfcCardListPageRange",
    () => "-- - -- of --",
  );

  const availableNfcCardList = useState("availableNfcCardList", () => []);
  const availableNfcCardListPage = useState(
    "availableNfcCardListPage",
    () => 1,
  );
  const availableNfcCardListPageRange = useState(
    "availableNfcCardListPageRange",
    () => "-- - -- of --",
  );

  async function getNfcCardList(
    content: string,
    site: string,
    page: number,
    userType: string,
  ) {
    try {
      isAccessCardLoading.value = true;

      const { data } = (await useLocalFetch(
        `${entryPassApiUrl}/access-card/${content}`,
        {
          method: "GET",
          query: { site, page, userType },
        },
      )) as any;

      if (content == "assigned") {
        assignedNfcCardList.value = data.value?.items;
        assignedNfcCardListPageRange.value = data.value?.pageRange;
        assignedNfcCardListPage.value = data.value?.pages;
      } else {
        availableNfcCardList.value = data.value?.items;
        availableNfcCardListPageRange.value = data.value?.pageRange;
        availableNfcCardListPage.value = data.value?.pages;
      }

      isAccessCardLoading.value = false;
    } catch (err) {
      if (content == "assigned") {
        assignedNfcCardList.value = [];
        assignedNfcCardListPageRange.value = "-- - -- of --";
        assignedNfcCardListPage.value = 1;
      } else {
        availableNfcCardList.value = [];
        availableNfcCardListPageRange.value = "-- - -- of --";
        availableNfcCardListPage.value = 1;
      }

      isAccessCardLoading.value = false;
    }
  }

  async function getAccessCardsLogs({
    page,
    limit = 10,
    site,
    cardNo,
    search,
  }: {
    page: number;
    limit?: number;
    site: string;
    cardNo: string;
    search?: string;
  }) {
    try {
      isAccessCardLoading.value = true;
      const { data } = (await useLocalFetch(`${entryPassApiUrl}/transactions`, {
        method: "GET",
        query: { page, limit, site, cardNo },
      })) as any;

      accessCardLogs.value = data.value?.items as TAccessCardTransactions[];
      pages.value = data.value?.pages;
      pageRange.value = data.value?.pageRange;

      isAccessCardLoading.value = false;
    } catch (error) {
      isAccessCardLoading.value = false;
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
    updateEntryPassSettings,
    addNonPhysicalAccessCard,
    getAccessCardsByType,
    assignAccessCardsToUnit,
    upload,
    isUploadingNFC,
    getNfcCardList,
    assignedNfcCardList,
    assignedNfcCardListPageRange,
    assignedNfcCardListPage,
    availableNfcCardList,
    availableNfcCardListPageRange,
    availableNfcCardListPage,
    totalCardCount,
    addPhysicalAccessCard,
    accessCardLogs,
    getAccessCardsLogs,
    getAccessCard,
  };
}
