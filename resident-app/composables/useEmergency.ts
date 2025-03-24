export default function useAnnouncement() {
  class MEmergency implements TEmergency {
    [x: string]: any;
    _id: string;
    title: string;
    phoneNumber: string;
    createdAt: string;
    updatedAt: string;
    site: string;
    organization: string;
    constructor(
      {
        _id = "",
        title = "",
        phoneNumber = "",
        createdAt = "",
        updatedAt = "",
        site = "",
        organization = "",
      } = {} as TEmergency,
    ) {
      this._id = _id;
      this.title = title;
      this.phoneNumber = phoneNumber;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.site = site;
      this.organization = organization;
    }
  }

  const announcementApiUrl = "/api/emergency-contacts";
  const emergency = useState("emergency", () => new MEmergency());

  async function getAllResidentEmergencyNumber(site: string) {
    const { data, error } = await useLocalFetch(
      `${announcementApiUrl}/v1/site/${site}`,
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

  async function getEmergencyCategory(site: string) {
    const { data, error } = await useLocalFetch(
      `${announcementApiUrl}/v1/category/all`,
      {
        method: "GET",
        params: {
          site: site,
        },
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }
  async function getEmergencyAll(site: string) {
    const { data, error } = await useLocalFetch(
      `${announcementApiUrl}/v1/all`,
      {
        method: "GET",
        params: {
          site: site,
        },
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function getByIdAnnouncement(
    id: string,
    site: string,
    organization: string,
  ) {
    const { data, error } = await useLocalFetch(
      `/api/announcements/v1/${id}?site=${site}&organization=${organization}`,
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

  return {
    getAllResidentEmergencyNumber,
    getByIdAnnouncement,
    getEmergencyCategory,
    getEmergencyAll,
    emergency,
  };
}
