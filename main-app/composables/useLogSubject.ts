const { useLocalFetchUtil } = useUtils();

export default function useLogSubject() {
  class MLogSubject implements TLogSubject {
    _id?: string;
    subject: string;
    addedBy: string;
    site: string;
    constructor(
      {
        _id = "",
        organization = "",
        subject = "",
        addedBy,
        site,
        createdAt,
      } = {} as TLogSubject,
    ) {
      this._id = _id;
      this.subject = subject;
      this.addedBy = addedBy;
      this.site = site;
    }
  }

  const logSubjectApiUrl = "/api/subjects/v1";
  const logSubject = useState("logSubject", () => new MLogSubject());
  const logSubjects = useState("logSubjects", (): TLogSubject[] => []);
  const search = useState("search", () => "");
  const isSubjectValid = useState("isSubjectValid", () => false);
  const dateSelected = useState("dateSelected", () =>
    new Intl.DateTimeFormat("en-US", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }).format(new Date()),
  );
  const isTableLoading = useState("isTableLoading", () => false);

  async function geTLogSubjectsByPageSearch(
    { search = "", organization, site, serviceProvider } = {} as {
      search?: string;
      organization?: string;
      site?: string;
      serviceProvider?: string;
    },
  ) {
    const data = await useLocalFetchUtil<TLogSubjectResponse>(
      logSubjectApiUrl,
      "GET",
      {
        search,
        organization,
        site,
        serviceProvider,
      },
    );
    return data;
  }

  async function addSubject(_subject: TLogSubject) {
    await useLocalFetchUtil(logSubjectApiUrl, "POST", _subject);
  }

  async function deleteSubject(id: string) {
    await useLocalFetchUtil(
      `${logSubjectApiUrl}/${logSubject.value._id}`,
      "DELETE",
    );
  }

  async function setLogSubjects(
    { organization, site, serviceProvider } = {} as {
      organization?: string;
      site?: string;
      serviceProvider?: string;
    },
  ) {
    try {
      isTableLoading.value = true;
      const _logSubject = await geTLogSubjectsByPageSearch({
        organization: organization,
        site: site,
        serviceProvider: serviceProvider,
        search: search.value,
      });
      logSubjects.value = _logSubject.items;
      isTableLoading.value = false;
    } catch (error) {
      logSubjects.value = [];
      isTableLoading.value = false;
    }
  }

  function setLogSubject(data?: TLogSubject) {
    logSubject.value = data || new MLogSubject();
  }

  return {
    logSubject,
    logSubjects,
    search,
    isSubjectValid,
    isTableLoading,
    dateSelected,
    addSubject,
    deleteSubject,
    setLogSubject,
    setLogSubjects,
  };
}
