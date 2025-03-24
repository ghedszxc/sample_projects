import { over } from "lodash";

const { useLocalFetchUtil } = useUtils();
const { setSnackbar } = useLocal();

export default function useVisitor() {
  class MVisitor implements TVisitor {
    // common
    _id: string;
    name: string;
    firstName: string;
    lastName: string;
    type: string;
    contractorType?: string;
    nric: string;
    phoneNumber: string;
    email: string;
    checkIn?: string;
    actualCheckIn?: string;
    checkOut?: string;
    actualCheckOut?: string;
    remarks: string;
    updatedAt?: Date;
    organization?: string;
    site?: string;
    // visitors
    companyName?: string;
    visitorPass?: TKeyLog | any;
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

    pickupDropoffType?: string;
    members?: any[];
    deliveryType?: string;

    emailSending: any;

    optionAccessCard?: string;

    constructor(
      {
        // common
        _id = "",
        name = "",
        firstName = "",
        lastName = "",
        type = "",
        contractorType = "",
        nric = "",
        phoneNumber = "",
        email = "",
        checkIn = "",
        actualCheckIn = "",
        checkOut = "",
        actualCheckOut = "",
        remarks = "",
        organization = "",
        site = "",
        //
        plateNumber = "",
        block = "",
        blockLevel = "",
        unit = "",
        visitorPass = [],
        passKeys = [],

        companyName = "",
        passKeyNumber = "",
        passNumber = "",
        passReturnDate = "",
        keyReturnDate = "",
        isPassReturned = false,
        isKeyReturned = false,

        pickupDropoffType = "",
        members = [],
        deliveryType = "Food",
        emailSending = [
          { status: "", lastSent: "", firstName: "", lastName: "" },
        ],

        optionAccessCard = "",
      } = {} as TVisitor,
    ) {
      // common
      this._id = _id || "";
      this.name = name;
      this.firstName = firstName;
      this.lastName = lastName;
      this.type = type;
      this.contractorType = contractorType || "";
      this.nric = nric;
      this.phoneNumber = phoneNumber;
      this.email = email;
      this.checkIn = checkIn;
      this.actualCheckIn = actualCheckIn;
      this.checkOut = checkOut;
      this.actualCheckOut = actualCheckOut;
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

      this.pickupDropoffType = pickupDropoffType;

      this.members = members;
      this.deliveryType = deliveryType;

      this.emailSending = emailSending;
      this.optionAccessCard = optionAccessCard;
    }
  }
  const isFileUploading = useState("isFileUploading", () => false);
  const filesUrlUploaded = useState("filesUrlUploaded", (): string[] => []);
  const visitorApiUrl = "/api/visitors/";
  const visitor = useState("visitor", () => new MVisitor());
  const visitors = useState("visitors", (): TVisitor[] => []);
  const page = useState("visitorPage", () => 1);
  const pages = useState("visitorPages", () => 0);
  const rpages = useState("residentPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const search = useState("visitorSearch", () => "");
  const selectedFilter = useState("visitorSelectedFilter", () => "all");
  const pageRange = useState("visitorPageRange", () => "-- - -- of --");
  const rpageRange = useState("residentPageRange", () => "-- - -- of --");
  const isVisitorValid = useState("isVisitorValid", () => false);
  const isVisitorsLoaded = useState("isVisitorsLoaded", () => false);
  const isCreate = useState("isCreate", () => false);
  const isUpdate = useState("isUpdate", () => false);
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const filterVisitor = useState("filterVisitor", () => []);
  const isVisitorsCheckOut = useState("isVisitorsCheckOut", () => false);
  const isDownloadingPdf = useState("isDownloadingPdf", () => false);
  const visitorTypes = useState("visitorTypes", () => [
    { title: "Drive In", value: "guest" },
    { title: "Contractor", value: "contractor" },
    { title: "Delivery (Food & Parcel)", value: "delivery" },
    { title: "Walk-In", value: "walk-in" },
    { title: "Pick-Up", value: "pick-up" },
    { title: "Drop-Off", value: "drop-off" },
    { title: "Guest (Drive-In)", value: "Guest (Drive-In)" },
    { title: "Guest (Walk-In)", value: "Guest (Walk-In)" },
  ]);
  const visitorTypesGuest = useState("visitorTypesGuest", () => [
    { title: "Guest (Drive-In)", value: "Guest (Drive-In)" },
    { title: "Guest (Walk-In)", value: "Guest (Walk-In)" },
  ]);
  const contractorTypes = useState("contractorTypes", () => [
    { title: "Estate Contractor", value: "estate-contractor" },
    { title: "Home Contractor", value: "home-contractor" },
    { title: "Property Agent", value: "property-agent" },
    { title: "House Mover", value: "house-mover" },
  ]);
  const pickupDropoffTypes = useState("pickupDropoffTypes", () => [
    "Private Hire",
    "Taxi",
  ]);

  const addVisitorDialog = useState("addVisitorDialog", () => false);
  const editVisitorDialog = useState("editVisitorDialog", () => false);
  const addVisitorSteps = useState("addVisitorSteps", () => 1);

  const editPasskeysDialog = useState("editPasskeysDialog", () => false);
  const contractorInfo = useState("contractorInfo", () => new MVisitor());

  const addVisitorRealtime = useState("addVisitorRealtime", () => false);
  const addVisitorRealtimeDialog = useState(
    "addVisitorRealtimeDialog",
    () => false,
  );
  const isCheckInImageLoading = useState("isCheckInImageLoading", () => false);

  const tab = useState("visitorsTab", () => "visitor");
  function setVisitor(data?: TVisitor) {
    visitor.value = data || new MVisitor();
  }

  async function getVisitorsByPageSearch(
    {
      page = 1,
      limit = 10,
      search = "",
      organizations = [],
      types = [],
      sites,
      date,
      arrivalDate,
      //isVisitorCleared,
      overnightParking,
      tab = "",
    } = {} as {
      page?: number;
      limit?: number;
      search?: string;
      organizations?: string[];
      sites?: string[];
      types?: string[] | null;
      date?: object;
      arrivalDate?: object;
      //isVisitorCleared?: string;
      overnightParking?: string;
      tab?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/visitors/search", {
      method: "POST",
      body: JSON.stringify({
        page,
        limit,
        search,
        organizations,
        sites,
        types,
        date,
        //isVisitorCleared,
        overnightParking,
        tab,
        arrivalDate,
      }),
    });

    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getResidentsTransactionsByPageSearch(
    {
      page = 1,
      limit = 10,
      search = "",
      organization = "",
      site,
      isResident = true,
    } = {} as {
      page?: number;
      limit?: number;
      search?: string;
      organization?: string;
      site?: string;
      isResident: boolean;
    },
  ) {
    const data = await useLocalFetchUtil<TVisitorResponse>(
      `${visitorApiUrl}residents/transactions`,
      "GET",
      {
        page,
        limit,
        search,
        organization,
        site,
        isResident,
      },
    );
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

  async function validateVisitorQrCode(
    id: string,
    qrCodeId: string,
    site: string,
    organization: string,
  ) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}${id}/validateVisitorQrCode`,
      {
        method: "GET",
        query: { qrCodeId, site, organization },
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function validateVisitorCode(id: string) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}${id}/verify-visitor`,
      {
        method: "GET",
        // query: { nric },
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
    {
      search,
      organizations,
      sites,
      types,
      date,
      overnightParking,
      tab,
    } = {} as {
      search?: string;
      organizations?: string[];
      sites?: string[];
      types?: string[] | null;
      date?: object;
      overnightParking?: string;
      tab?: string;
    },
  ) {
    try {
      isVisitorsLoaded.value = true;
      const _visitors = await getVisitorsByPageSearch({
        page: page.value,
        search: search,
        organizations,
        sites,
        types,
        date,
        //  isVisitorCleared: selectedFilter.value || "all",
        overnightParking,
        tab,
      });
      visitors.value = _visitors.items;
      pageRange.value = _visitors.pageRange;
      pages.value = _visitors.pages;
      isVisitorsLoaded.value = false;
    } catch (error) {
      visitors.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isVisitorsLoaded.value = false;
    }
  }

  async function setResidents(
    { search, organization, site, isResident } = {} as {
      search?: string;
      organization?: string;
      site?: string;
      isResident: boolean;
    },
  ) {
    try {
      isVisitorsLoaded.value = true;
      const _residents = await getResidentsTransactionsByPageSearch({
        page: page.value,
        search: search,
        organization,
        site,
        isResident,
      });
      visitors.value = _residents.items;
      rpageRange.value = _residents.pageRange;
      rpages.value = _residents.pages;
      isVisitorsLoaded.value = false;
    } catch (error) {
      visitors.value = [];
      rpageRange.value = "-- - -- of --";
      rpages.value = 0;
      isVisitorsLoaded.value = false;
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
    if (result && result.value.code === 900) {
      return Promise.resolve(result.value.code as number);
    }
    if (result && result.value.code === 901) {
      return Promise.resolve(result.value.code as number);
    }

    if (result && result.value) {
      return Promise.resolve(result.value.visitorId as string);
    }
  }

  async function addVisitorTemp(_visitor: TVisitor) {
    const { error, data } = await useLocalFetch("/api/visitors/temporary", {
      method: "POST",
      body: JSON.stringify(_visitor),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value.code === 900) {
      return Promise.resolve(result.value.code as number);
    }
    if (result && result.value.code === 901) {
      return Promise.resolve(result.value.code as number);
    }

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

  async function updateVisitorOvernightParkingStatus({
    _id = "",
    remarks = "",
    status = "",
  }: {
    _id?: string;
    remarks?: string;
    status?: string;
  }) {
    const { error, data } = await useLocalFetch(
      `${visitorApiUrl}resident-overnight-parking-approval`,
      {
        method: "POST",
        body: JSON.stringify({ _id, remarks, status }),
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

  async function updateOvernightParkingApprovalHoursSettings({
    site = "",
    monday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
    tuesday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
    wednesday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
    thursday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
    friday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
    saturday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
    sunday = {
      isEnabled: false,
      startTime: "",
      endTime: "",
    },
  }: {
    site?: string;
    monday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
    tuesday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
    wednesday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
    thursday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
    friday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
    saturday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
    sunday?: {
      isEnabled: boolean;
      startTime: string;
      endTime: string;
    };
  }) {
    const { error, data } = await useLocalFetch(
      "/api/overnight-parking-approval-settings/v1",
      {
        method: "POST",
        body: JSON.stringify({
          site,
          monday,
          tuesday,
          wednesday,
          thursday,
          friday,
          saturday,
          sunday,
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

  async function updateFeedbackInterval({ site = "" }) {
    const { error, data } = await useLocalFetch(
      "/api/overnight-parking-approval-settings/v1",
      {
        method: "POST",
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
      return Promise.resolve(result.value);
    }
  }

  async function getOvernightParkingApprovalHoursSettings(site?: string) {
    const { error, data } = await useLocalFetch(
      "/api/overnight-parking-approval-settings/v1",
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
      return Promise.resolve(result.value);
    }
  }

  async function updateVisitorCheckInAndOut(
    id: string,
    action: string,
    clientUserType?: string,
    site?: string,
    plateNumber?: string,
    nric?: string,
    visitorPass?: [],
    name?: string,
    phoneNumber?: string,
    residentGuestType?: string,
    remarks?: string,
  ) {
    const dataArgument = {
      clientUserType,
      visitorPass,
      name,
      phoneNumber,
      residentGuestType,
      remarks,
      site,
    };

    const { data, error } = await useLocalFetch(`${visitorApiUrl}scan/check`, {
      method: "PUT",
      query: { id, action, plateNumber, nric },
      body: JSON.stringify(dataArgument),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject({
        status: "error",
        message: error.value.data.message,
      });
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function updateVisitorPassStatusById(
    id: string,
    passStatus: boolean,
    visitorPass: string,
    memberPass?: string[],
  ) {
    const data = await useLocalFetchUtil<{ message: TVisitor }>(
      `${visitorApiUrl}/${id}/passStatus`,
      "PATCH",
      {
        passStatus,
        visitorPass,
        memberPass,
      },
    );
    setVisitor(data.message);
    return data;
  }

  async function updateVisitorKeyStatusById(id: string, keyStatus: boolean) {
    const data = await useLocalFetchUtil<{ message: TVisitor }>(
      `${visitorApiUrl}/${id}/keyStatus`,
      "PATCH",
      {
        keyStatus,
      },
    );
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

  async function updatePassKeysById(id: string, payload: any) {
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
  async function getScannedNricInfo(payload: Blob | File) {
    const formData = new FormData();
    formData.append("file", payload);
    const { error, data } = await useLocalFetch(
      `${visitorApiUrl}detect/image`,
      {
        method: "POST",
        body: formData,
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(
        result.value as {
          result: {
            name: string;
            nric: string;
            passport: string;
            license: string;
          };
          text: string;
          confidence: number;
          totalAngle: number;
        },
      );
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

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  const vcanNextPage = computed(() => rpages.value > page.value);
  const vcanPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { search, organizations, sites, types, date, tab } = {} as {
      search?: string;
      organizations?: string[];
      sites?: string[];
      types?: string[] | null;
      date?: object;
      tab?: string;
    },
  ) {
    page.value++;
    setVisitors({
      search,
      organizations,
      sites,
      types,
      date,
      tab,
    });
  }

  function prevPage(
    { search, organizations, sites, types, date, tab } = {} as {
      search?: string;
      organizations?: string[];
      sites?: string[];
      types?: string[] | null;
      date?: object;
      tab?: string;
    },
  ) {
    page.value--;
    setVisitors({
      search,
      organizations,
      sites,
      types,
      date,
      tab,
    });
  }

  function vnextPage(
    { site, isResident } = {} as {
      site?: string;
      isResident: boolean;
    },
  ) {
    page.value++;
    setResidents({
      site,
      isResident,
    });
  }

  function vprevPage(
    { site, isResident } = {} as {
      site?: string;
      isResident: boolean;
    },
  ) {
    page.value--;
    setResidents({
      site,
      isResident,
    });
  }

  async function searchVehicleNumber(payload: any) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}list/checkplatenumber`,
      {
        method: "GET",
        query: payload,
      },
    );

    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function searchNRIC(payload: any) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}list/checknric`,
      {
        method: "GET",
        query: payload,
      },
    );

    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function searchPhoneNumber(payload: any) {
    const { data, error } = await useLocalFetch(
      `${visitorApiUrl}list/checkphonenumber`,
      {
        method: "GET",
        query: payload,
      },
    );

    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  function uploadFile(file: File): Promise<string> {
    isFileUploading.value = true;
    return new Promise((resolve, reject) => {
      const formData = new FormData();
      formData.append("file", file);

      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/files/upload?status=draft");

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          // Handle progress (optional)
          if (progress === 100) {
            isFileUploading.value = false;
          }
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve(response.id); // Resolve with the id from the response
          } catch (error) {
            reject(new Error("Failed to parse server response"));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => reject(new Error("Network error"));
      xhr.send(formData);
    });
  }
  // Use async/await to handle the file uploads
  async function uploadFileUtil(
    fileString: Array<{ data: File }>,
  ): Promise<string[]> {
    const results: string[] = [];
    // Iterate over file objects asynchronously
    for (const fileObj of fileString) {
      try {
        if (typeof fileObj === "string") {
          results.push(fileObj);
          continue;
        }
        const fileId = await uploadFile(fileObj.data); // Await the file upload
        results.push(fileId); // Collect the file ID
      } catch (e) {
        console.log("Error occurred while attaching images.", e);
      }
    }

    return results; // Return array of file IDs
  }
  // Show uploaded files
  function showUploadedFiles(fileString: any) {
    const fileStr = toRaw(fileString);
    filesUrlUploaded.value = fileStr.map((i: { url: string }) => i.url);
  }

  async function getVisitorVmsLogsByPageSearch({
    page = 1,
    limit = 10,
    sites = [],
    passOrKey = { keyId: "", type: "" },
    isActualCheckOut = "",
  }: {
    page?: number;
    limit?: number;
    sites?: string[];
    passOrKey?: { keyId: string; type: string };
    isActualCheckOut?: string;
  }) {
    const { error, data } = await useLocalFetch(`${visitorApiUrl}search`, {
      method: "POST",
      body: JSON.stringify({
        page,
        limit,
        sites,
        passOrKey,
        isActualCheckOut,
      }),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function updateVisitorTemp(_visitor: TVisitor) {
    const { error, data } = await useLocalFetch(
      `${visitorApiUrl}${_visitor._id}/temp`,
      {
        method: "PATCH",
        body: JSON.stringify(_visitor),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;
    if (result && result.value.code === 900) {
      return Promise.resolve(result.value.code as number);
    }
    if (result && result.value.code === 901) {
      return Promise.resolve(result.value.code as number);
    }

    if (result && result.value) {
      return Promise.resolve(result.value.visitorId as string);
    }
  }

  async function downloadVisitorReportPdf(
    {
      search,
      organizations,
      sites,
      types,
      date,
      overnightParking,
      tab,
    } = {} as {
      search?: string;
      organizations?: string[];
      sites?: string[];
      types?: string[] | null;
      date?: object;
      overnightParking?: string;
      tab?: string;
    },
  ) {
    try {
      isDownloadingPdf.value = true;
      const _visitorsData = await getVisitorsByPageSearch({
        page: page.value,
        limit: 200000,
        search: search,
        organizations,
        sites,
        types,
        date,
        //  isVisitorCleared: selectedFilter.value || "all",
        overnightParking,
        tab,
      });

      isDownloadingPdf.value = false;

      return _visitorsData;
    } catch (error) {
      setSnackbar({
        text: "Failed to download visitor management report",
        modal: true,
        type: "error",
      });
      isDownloadingPdf.value = false;
    }
  }

  async function getVisitorCheckInImage(_id: string) {
    const { data, error } = await useLocalFetch(
      `/api/routes/screenshot/${_id}`,
      {
        method: "GET",
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  return {
    tab,
    search,
    selectedFilter,
    visitor,
    visitors,
    contractorTypes,
    pickupDropoffTypes,
    page,
    pages,
    itemsPerPage,
    pageRange,
    rpages,
    rpageRange,
    setVisitor,
    isVisitorsLoaded,
    isCreate,
    isUpdate,
    setVisitors,
    getVisitorsByPageSearch,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    isVisitorValid,
    addVisitor,
    addVisitorTemp,
    updateVisitor,
    deleteVisitor,
    getVisitorById,
    validateVisitorQrCode,
    updateVisitorPassStatusById,
    updateVisitorKeyStatusById,
    filterOrganization,
    filterSite,
    filterVisitor,
    visitorTypes,
    visitorTypesGuest,
    addVisitorDialog,
    editVisitorDialog,
    addVisitorSteps,
    editPasskeysDialog,
    contractorInfo,
    updateVisitorCheckInAndOut,
    validateVisitorCode,
    addMultipleContractor,
    updatePassKeysById,

    addVisitorRealtime,
    addVisitorRealtimeDialog,

    getScannedNricInfo,

    searchVehicleNumber,
    searchNRIC,
    searchPhoneNumber,

    updateVisitorOvernightParkingStatus,
    updateOvernightParkingApprovalHoursSettings,
    getOvernightParkingApprovalHoursSettings,

    resendEmailToVisitor,
    updateVisitorEmail,
    updateFeedbackInterval,
    setResidents,
    vnextPage,
    vprevPage,
    isFileUploading,
    filesUrlUploaded,
    uploadFile,
    uploadFileUtil,
    showUploadedFiles,
    getVisitorVmsLogsByPageSearch,
    isVisitorsCheckOut,
    updateVisitorTemp,
    downloadVisitorReportPdf,
    isDownloadingPdf,
    getVisitorCheckInImage,
    isCheckInImageLoading,
    vcanNextPage,
    vcanPrevPage,
  };
}
