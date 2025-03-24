export default function useAnnouncement() {
  class MSite implements TAnnouncement {
    _id: string;
    title: string;
    content: string;
    file: string;
    createdAt: string;
    updatedAt: string;
    site: string;
    organization: string;
    constructor(
      {
        _id = "",
        title = "",
        content = "",
        file = "",
        createdAt = "",
        updatedAt = "",
        site = "",
        organization = "",
      } = {} as TAnnouncement,
    ) {
      this._id = _id;
      this.title = title;
      this.content = content;
      this.file = file;
      this.createdAt = createdAt;
      this.updatedAt = updatedAt;
      this.site = site;
      this.updatedAt = updatedAt;
      this.organization = organization;
    }
  }

  const tabsAnnouncements = useState("tabsAnnouncements", () => 1);
  const fileIndex = useState("fileIndex", () => "false");

  async function getAllResidentAnnouncement(
    site: string,
    page?: number,
    tab: string = "",
  ) {
    const { data, error } = await useLocalFetch(`/api/announcements/v1/all`, {
      method: "POST",
      body: JSON.stringify({ site, tab, page }),
    });
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      return Promise.resolve(data.value);
    }
  }
  // async function getAllResidentAnnouncement(id: string) {
  //   const { data, error } = await useLocalFetch(
  //     `/api/announcements/v1/site/${id}`,
  //     {
  //       method: "GET",
  //     },
  //   );
  //   if (error.value && error.value.data) {
  //     return Promise.reject(error.value.data.message);
  //   }

  //   if (data.value) {
  //     return Promise.resolve(data.value);
  //   }
  // }

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

  async function getByIdAnnouncementLatest(id: string) {
    const { data, error } = await useLocalFetch(
      `/api/announcements/v1/site/${id}`,
      {
        method: "GET",
      },
    );
    if (error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data.value) {
      const sortedData = data.value.data
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 5);
      return Promise.resolve(sortedData);
    }
  }

  return {
    getAllResidentAnnouncement,
    getByIdAnnouncement,
    getByIdAnnouncementLatest,
    tabsAnnouncements,
    fileIndex,
  };
}
