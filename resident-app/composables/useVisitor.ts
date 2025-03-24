/* eslint-disable @typescript-eslint/no-explicit-any */
const { useLocalFetchUtil } = useUtils();

export default function useVisitor() {
  class MVisitor implements TVisitor {
    // common
    _id: string;
    name: string;
    type: string;
    nric: string;
    phoneNumber: string;
    email: string;
    checkIn?: string;
    checkOut?: string;
    remarks: string;
    updatedAt?: Date;
    organization?: string;
    site?: string;
    // visitors
    companyName?: string;
    visitorPass?: TKeyLog;
    plateNumber?: string;
    passNumber?: string;
    passKeyNumber?: string;

    passReceivedDate?: string;
    keyReceivedDate?: string;
    passReturnDate?: string;
    keyReturnDate?: string;
    isPassReturned: boolean; // visitor pass should returned to the guard
    isKeyReturned: boolean; // pass key should returned to the guard
    passKeys?: string[]; // [key.code]
    // passKeys?: IPass[] | IKeys[]; // in preparation only
    isStatusCleared?: boolean; // if contractor returned all keys and passes he/she should be cleared
    block?: string;
    unit?: string;
    blockLevel?: string;
    registeredAt?: string;
    isOvernightParking?: boolean;
    numberOfPassenger?: string;
    status?: string;
    arrivalTime: string;
    rejectionSerialNumber: string;
    constructor(
      {
        // common
        _id = "",
        name = "",
        type = "",
        nric = "",
        phoneNumber = "",
        email = "",
        checkIn = "",
        checkOut = "",
        remarks = "",
        organization = "",
        site = "",
        //
        plateNumber = "",
        block = "",
        blockLevel = "",
        unit = "",
        visitorPass,
        passKeys = [],

        companyName = "",
        passKeyNumber = "",
        passNumber = "",
        passReturnDate = "",
        keyReturnDate = "",
        isPassReturned = false,
        isKeyReturned = false,
        isOvernightParking = false,
        numberOfPassenger = "",
        status = "",
        arrivalTime = "",
        rejectionSerialNumber = "",
      } = {} as TVisitor,
    ) {
      // common
      this._id = _id || "";
      this.name = name;
      this.type = type;
      this.nric = nric;
      this.phoneNumber = phoneNumber;
      this.email = email;
      this.checkIn = checkIn;
      this.checkOut = checkOut;
      this.remarks = remarks;
      this.organization = organization;
      this.site = site;
      //
      this.companyName = companyName;
      this.block = block;
      this.blockLevel = blockLevel;
      this.unit = unit;
      this.visitorPass = visitorPass;
      this.plateNumber = plateNumber;
      this.passNumber = passNumber;
      this.passKeyNumber = passKeyNumber;

      this.passReturnDate = passReturnDate;
      this.keyReturnDate = keyReturnDate;
      this.isPassReturned = isPassReturned;
      this.isKeyReturned = isKeyReturned;
      this.passKeys = passKeys || [];
      this.isOvernightParking = isOvernightParking;
      this.numberOfPassenger = numberOfPassenger;
      this.status = status;
      this.arrivalTime = arrivalTime;
      this.rejectionSerialNumber = rejectionSerialNumber;
    }
  }

  const visitorApiUrl = "/api/visitors/";
  const visitor = useState("visitor", () => new MVisitor());
  const visitors = useState("visitors", (): TVisitor[] => []);
  const page = useState("visitorPage", () => 1);
  const pages = useState("visitorPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("visitorSearch", () => "");
  const selectedFilter = useState("visitorSelectedFilter", () => "all");
  const pageRange = useState("visitorPageRange", () => "-- - -- of --");
  const isVisitorValid = useState("isVisitorValid", () => false);
  const isVisitorsLoading = useState("isVisitorsLoading", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const filterVisitor = useState("filterVisitor", () => "All");
  const visitorTypes = useState("visitorTypes", () => [
    { title: "Guest", value: "guest" },
    { title: "Contractor", value: "contractor" },
    { title: "Delivery", value: "delivery" },
    { title: "Walk-In", value: "walk-in" },
  ]);
  const addVisitorDialog = useState("addVisitorDialog", () => false);
  const addVisitorSteps = useState("addVisitorSteps", () => 1);

  const editPasskeysDialog = useState("editPasskeysDialog", () => false);
  const contractorInfo = useState("contractorInfo", () => "");

  const guest = useState("guest", () => "invitation");

  const block = useState("addVisitorBlock", (): any => null);
  const level = useState("addVisitorLevel", (): any => null);
  const unit = useState("addVisitorUnit", (): any => null);

  function setVisitor(data?: TVisitor) {
    visitor.value = data || new MVisitor();
  }

  async function getAllVisitorsByRole(
    {
      page = 1,
      limit = 10,
      search = "",
      type = "",
      startDate = "",
      endDate = "",
      guest = "",
    } = {} as {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      guest?: string;
    },
  ) {
    //isVisitorsLoading.value = true;
    let query_params = "?";
    if (page) query_params = `${query_params}&page=${page}`;
    if (limit) query_params = `${query_params}&limit=${limit}`;
    if (search) query_params = `${query_params}&search=${search}`;
    if (type) query_params = `${query_params}&type=${type}`;
    if (startDate) query_params = `${query_params}&startDate=${startDate}`;
    if (endDate) query_params = `${query_params}&endDate=${endDate}`;
    if (guest) query_params = `${query_params}&guest=${guest}`;

    const { error, data } = await useLocalFetch(
      `/api/visitors/resident-app${query_params}`,
    );

    //isVisitorsLoading.value = false;

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result) {
      return Promise.resolve(result.value as string);
    }
  }

  async function getVisitorResident(visitorID: string) {
    const { error, data } = await useLocalFetch(
      `/api/visitors/resident-app/${visitorID}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result) {
      return Promise.resolve(result.value as string);
    }
  }

  async function addVisitorResident(_visitor: any) {
    const { error, data } = await useLocalFetch("/api/visitors/resident-app", {
      method: "POST",
      body: JSON.stringify(_visitor),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result?.value?.insertedId) {
      return Promise.resolve(result.value.insertedId as string);
    }
  }

  async function updateVisitorResident(_visitor: any, visitorID: string) {
    const { error, data } = await useLocalFetch(
      `/api/visitors/resident-app/${visitorID}`,
      {
        method: "PATCH",
        body: JSON.stringify(_visitor),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result) {
      return Promise.resolve(result.value);
    } else {
      return Promise.reject(result);
    }
  }

  async function getVisitorsByPageSearch(
    {
      page = 1,
      search = "",
      organization = "",
      type = "all",
      site,
      startDate = "",
      endDate = "",
      isVisitorCleared,
    } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
      isVisitorCleared?: string;
    },
  ) {
    const data = (await useLocalFetchUtil(visitorApiUrl, "GET", {
      page,
      search,
      organization,
      site,
      type,
      startDate,
      endDate,
      isVisitorCleared,
    })) as {} | undefined;
    return data;
  }

  async function getVisitorById(id: string) {
    const { data, error } = await useLocalFetch(`${visitorApiUrl}${id}`, {
      method: "GET",
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }
  async function getResidentById(id: string) {
    const { data, error } = await useLocalFetch(
      `/api/visitors/resident-app?visitorId=${id}`,
      {
        method: "GET",
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function validateVisitorCode(id: string, nric: string) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}${id}/verify-visitor`,
      {
        method: "GET",
        query: { nric },
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function setVisitors(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate?: string;
      endDate?: string;
    },
  ) {
    try {
      isVisitorsLoading.value = true;
      const _visitors = (await getVisitorsByPageSearch({
        page: page.value,
        search: search.value,
        organization,
        site,
        type,
        startDate,
        endDate,
        isVisitorCleared: selectedFilter.value,
      })) as TVisitorResponse;

      visitors.value = _visitors.items as TVisitor[];
      pageRange.value = _visitors.pageRange;
      pages.value = _visitors.pages;
      isVisitorsLoading.value = false;
    } catch (error) {
      visitors.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isVisitorsLoading.value = false;
    }
  }

  async function addVisitor(_visitor: TVisitor) {
    const { error, data } = await useLocalFetch("/api/visitors", {
      method: "POST",
      body: JSON.stringify(_visitor),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.visitorId as string);
    }
  }

  async function deleteVisitor(id: string) {
    const { error, data } = await useLocalFetch(`${visitorApiUrl}${id}`, {
      method: "DELETE",
      body: "",
    });
    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateVisitor(form: any) {
    let _id = form._id;
    delete form._id;
    const { data, error } = await useLocalFetch(`${visitorApiUrl}${_id}`, {
      method: "PUT",
      body: JSON.stringify(form),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateVisitorEmail(_id: string, email: string) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}edit-visitor-id`,
      {
        method: "POST",
        body: JSON.stringify({ _id, email }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function resendEmailToVisitor(_visitorId: string) {
    const { error, data } = await useLocalFetch(
      `${visitorApiUrl}resident-invite-resend-email`,
      {
        method: "POST",
        body: JSON.stringify({ id: _visitorId }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value as any);
    }
  }

  async function updateVisitorCheckInAndOut(id: string, action: string) {
    const { data, error } = await useLocalFetch(`${visitorApiUrl}scan/check`, {
      method: "PUT",
      query: { id, action },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateVisitorPassStatusById(id: string, passStatus: boolean) {
    const data = (await useLocalFetchUtil(
      `${visitorApiUrl}/${id}/passStatus`,
      "PATCH",
      {
        passStatus,
      },
    )) as { message: TVisitor };
    setVisitor(data.message);
    return data;
  }

  async function updateVisitorKeyStatusById(id: string, keyStatus: boolean) {
    const data = (await useLocalFetchUtil(
      `${visitorApiUrl}/${id}/keyStatus`,
      "PATCH",
      {
        keyStatus,
      },
    )) as { message: TVisitor };
    setVisitor(data.message);
    return data;
  }

  async function addMultipleContractor(payload: any) {
    const { error, data } = await useLocalFetch(`${visitorApiUrl}csv-upload`, {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value as any);
    }
  }

  async function updateContractorPassKeys(id: string, payload: any) {
    const { error, data } = await useLocalFetch(
      `${visitorApiUrl}${id}/updatePassKeys`,
      {
        method: "PATCH",
        body: JSON.stringify(payload),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value as any);
    }
  }

  async function getOvernightSetting({ site }: { site: string }) {
    const { error, data } = await useLocalFetch(
      `/api/overnight-parking-approval-settings/v1`,
      {
        method: "PATCH",
        body: JSON.stringify({
          site,
        }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value as any);
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    page.value++;
    setVisitors({
      organization,
      site,
      type,
      startDate,
      endDate,
    });
  }

  function prevPage(
    { organization, site, type, startDate, endDate } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      startDate: string;
      endDate: string;
    },
  ) {
    page.value--;
    setVisitors({
      organization,
      site,
      type,
      startDate,
      endDate,
    });
  }

  return {
    search,
    selectedFilter,
    visitor,
    visitors,
    page,
    pages,
    itemsPerPage,
    pageRange,
    setVisitor,
    isVisitorsLoading,
    isCreate,
    isUpdate,
    setVisitors,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    isVisitorValid,
    addVisitor,
    updateVisitor,
    deleteVisitor,
    getVisitorById,
    getVisitorResident,
    updateVisitorPassStatusById,
    updateVisitorKeyStatusById,
    filterOrganization,
    filterSite,
    filterVisitor,
    visitorTypes,
    addVisitorDialog,
    addVisitorSteps,
    editPasskeysDialog,
    contractorInfo,
    updateVisitorCheckInAndOut,
    validateVisitorCode,
    addMultipleContractor,
    updateContractorPassKeys,
    addVisitorResident,
    updateVisitorResident,
    getResidentById,
    getAllVisitorsByRole,
    getVisitorsByPageSearch,
    guest,
    updateVisitorEmail,
    resendEmailToVisitor,
    getOvernightSetting,
    block,
    level,
    unit,
  };
}
