export default function useVehicle() {
  class MVehicle implements TVehicle {
    _id: string;
    name: string;
    type: string;
    subscriptionExpiry: string;
    idNumber: string;
    phoneNumber: string;
    plateNumber: string;
    checkIn: string;
    checkOut: string;
    registeredAt: string;

    constructor(
      {
        _id = "",
        name = "",
        type = "",
        subscriptionExpiry = "",
        idNumber = "",
        phoneNumber = "",
        plateNumber = "",
        checkIn = "",
        checkOut = "",
        registeredAt = "",
      } = {} as TVehicle,
    ) {
      this._id = _id || "";
      this.name = name || "";
      this.type = type || "";
      this.subscriptionExpiry = subscriptionExpiry || "";
      this.idNumber = idNumber || "";
      this.phoneNumber = phoneNumber || "";
      this.plateNumber = plateNumber || "";
      this.checkIn = checkIn || "";
      this.checkOut = checkOut || "";
      this.registeredAt = registeredAt || "";
    }
  }

  const vehicles = useState("vehicles", (): TVehicle[] => []);
  const page = useState("vehiclePage", () => 1);
  const pages = useState("vehiclePages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const pageRange = useState("vehiclePageRange", () => "-- - -- of --");
  const search = useState("vehicleSearch", () => "");
  const isVehicleValid = useState("isVehicleValid", () => false);
  const isVehicleLoaded = useState("isVehicleLoaded", () => false);
  const vehicle = useState("vehicle", (): TVehicle => new MVehicle());
  const filterOrganization = useState("filterOrganization", () => "");
  const filterSite = useState("filterSite", () => "");
  const selectedVehicle = useState("selectedVehicle", () => "");
  const addVehicleSteps = useState("addVehicleSteps", () => 1);

  const filterByType = useState("filterByType", () => "all");
  const filterByStatus = useState("filterByStatus", () => "all");
  const vehicleInfoDialog = useState("vehicleInfoDialog", () => false);
  const updateVehicleStatusDialog = useState(
    "updateVehicleStatusDialog",
    () => false,
  );
  const addVehicleDialog = useState("addVehicleDialog", () => false);

  const vehicleStatuses = useState("vehicleStatuses", () => [
    { title: "All", value: "all" },
    { title: "Whitelist", value: "whitelist" },
    { title: "Blocklist", value: "blocklist" },
  ]);

  const vehicleTypes = useState("vehicleTypes", () => [
    { title: "All", value: "all" },
    { title: "Visitor", value: "visitor" },
    { title: "Resident", value: "resident" },
  ]);

  const tab = useState("vehicleTab", () => "main");

  function setVehicle(data?: TVehicle) {
    vehicle.value = data || new MVehicle();
  }

  async function getVehiclesByPageSearch(
    {
      page = 1,
      search = "",
      organization = "",
      type = "all",
      status = "all",
      site,
    } = {} as {
      page?: number;
      search?: string;
      organization?: string;
      site?: string;
      type?: string;
      status?: string;
    },
  ) {
    const { error, data } = await useLocalFetch("/api/visitors/list/anpr/", {
      method: "GET",
      query: { page, search, organization, site, type, status },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getVehicleById(_id: string) {
    const { error, data } = await useLocalFetch(
      `/api/visitors/list/anpr/${_id}`,
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TVehicle);
    }
  }

  async function setVehicles(
    { organization, site, type, status, search } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      status?: string;
      search?: string;
    },
  ) {
    try {
      isVehicleLoaded.value = true;

      const _vehicles = (await getVehiclesByPageSearch({
        search: search,
        page: page.value,
        organization,
        site,
        type,
        status,
      })) as TDataRequestResponse;
      vehicles.value = _vehicles.items as TVehicle[];
      pageRange.value = _vehicles.pageRange;
      pages.value = _vehicles.pages;
      isVehicleLoaded.value = false;
    } catch (error) {
      vehicles.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isVehicleLoaded.value = false;
    }
  }

  async function addVehicle(_vehicle: TVehicle) {
    delete _vehicle._id;

    const { error, data } = await useLocalFetch("/api/vehicles", {
      method: "POST",
      body: JSON.stringify(_vehicle),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateVehiclePlateNumberById(
    _vehicle: TUpdateVehiclePlateNumberOptions,
  ) {
    const { error, data } = await useLocalFetch(
      `/api/visitors/list/anpr/${_vehicle._id}`,
      {
        method: "PUT",
        body: JSON.stringify({ plateNumber: _vehicle.plateNumber }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateVehicleStatus(
    id: string,
    status: string,
    reason: string,
  ) {
    const { data, error } = await useLocalFetch(
      `/api/visitors/list/anpr/${id}`,
      {
        method: "PUT",
        body: JSON.stringify({ status, reason }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  async function softDeleteVehicle(id: string, site: string) {
    const { data, error } = await useLocalFetch(
      `/api/visitors/list/anpr/${id}`,

      {
        method: "DELETE",
        body: JSON.stringify({ site }),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (!error.value) {
      return data.value;
    }
  }

  const canNextPage = computed(() => pages.value > page.value);
  const canPrevPage = computed(() => page.value <= 1);

  function nextPage(
    { organization, site, type, status } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      status?: string;
    },
  ) {
    page.value++;
    setVehicles({
      organization,
      site,
      type,
      status,
    });
  }

  function prevPage(
    { organization, site, type, status } = {} as {
      organization?: string;
      site?: string;
      type?: string;
      status?: string;
    },
  ) {
    page.value--;
    setVehicles({
      organization,
      site,
      type,
      status,
    });
  }

  async function addBanVehicle(payload: any) {
    const { error, data } = await useLocalFetch("/visitors/list/preban", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function addWhiteListVehicle(payload: any) {
    const { error, data } = await useLocalFetch("/visitors/list/whitelist", {
      method: "POST",
      body: JSON.stringify(payload),
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function addMultipleWhitelist(payload: any) {
    const { error, data } = await useLocalFetch(
      `/api/visitors/residents/csv-upload`,
      {
        method: "POST",
        body: JSON.stringify(payload),
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value as string);
    }
  }

  return {
    vehicle,
    vehicles,
    setVehicle,
    setVehicles,
    isVehicleValid,
    isVehicleLoaded,
    addVehicle,
    getVehicleById,
    updateVehiclePlateNumberById,
    updateVehicleStatus,
    page,
    pages,
    itemsPerPage,
    pageRange,
    search,
    canNextPage,
    canPrevPage,
    nextPage,
    prevPage,
    filterOrganization,
    filterSite,
    filterByType,
    filterByStatus,
    vehicleStatuses,
    vehicleInfoDialog,
    updateVehicleStatusDialog,
    selectedVehicle,
    addVehicleSteps,
    vehicleTypes,
    addVehicleDialog,
    addBanVehicle,
    addWhiteListVehicle,
    addMultipleWhitelist,
    tab,
    softDeleteVehicle,
  };
}
