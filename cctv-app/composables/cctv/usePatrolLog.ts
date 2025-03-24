import moment from "moment";

export default function usePatrolLog() {
  class MPatrolLog implements TPatrolLog {
    _id?: string;
    site: string;
    organization?: string;
    cctvId: string;
    routeId: string;
    assignee: string;
    logQuestions: TPatrolLogQuestion[] | [];
    duration: number;
    startDateTimeDuration: string | Date;
    endDateTimeDuration: string | Date;
    reportStatus: string | TReportStatus;
    reportLabel: string;
    isActiveReportStatus: boolean;
    isLatePatrolling: boolean;
    editHistory?: TEditHistory[] | [];
    isLocked: boolean;

    constructor(
      {
        _id = "",
        site = "",
        organization = "",
        cctvId = "",
        routeId = "",
        assignee = "",
        logQuestions = [],
        duration = 0,
        startDateTimeDuration = "",
        endDateTimeDuration = "",
        reportStatus = "",
        reportLabel = "",
        isActiveReportStatus = false,
        isLatePatrolling = false,
        editHistory = [],
        isLocked = false,
      } = {} as TPatrolLog,
    ) {
      this._id = _id;
      this.site = site;
      this.organization = organization;
      this.cctvId = cctvId;
      this.routeId = routeId;
      this.assignee = assignee;
      this.logQuestions = logQuestions;
      this.duration = duration;
      this.startDateTimeDuration = startDateTimeDuration;
      this.endDateTimeDuration = endDateTimeDuration;
      this.reportStatus = reportStatus;
      this.reportLabel = reportLabel;
      this.isActiveReportStatus = isActiveReportStatus;
      this.isLatePatrolling = isLatePatrolling;
      this.editHistory = editHistory;
      this.isLocked = isLocked;
    }
  }

  const patrolLog = useState("patrolLog", (): TPatrolLog => new MPatrolLog());
  const questionnaires = useState(
    "questionnaires",
    (): TPatrolLogQuestion[] => [],
  );
  const patrolLogKey = useState("patrolLogKey", () => "");
  const patrolLogError = useState("patrolLogError", () => "");
  const onGoingPatrolLog = useState("onGoingPatrolLog", () => "");

  const { getPatrolQuestionnaires, validateRouteIfAlreadyPatrolledToday } =
    useVirtualPatrol();

  function setPatrolLog(data?: TPatrolLog) {
    patrolLog.value = data || new MPatrolLog();
  }

  async function setQuestionnaires(site: string, route: string) {
    const questions = (await getPatrolQuestionnaires(site, route)) as any;

    if (questions) {
      questionnaires.value = questions.map((item: TPatrolLogQuestion) => {
        return {
          _id: item._id,
          question: item.question,
          innerQuestions: item.innerQuestions,
          options: false,
          screenshotAttachment: "",
          recordingAttachment: "",
          remarks: "",
        };
      });
    }
  }

  async function setOnGoingPatrol({ site }: { site: string }) {
    const today = moment
      .tz(moment(new Date()), "Asia/Singapore")
      .format("YYYY-MM-DD");

    const regex = /^[a-f0-9]{24}-\d{4}-\d{2}-\d{2}$/;
    const regexDate = /\d{4}-\d{2}-\d{2}/;
    const stored = Object.keys(localStorage).filter((key) => regex.test(key));
    const storedLogs = [] as any;

    stored.forEach((item) => {
      const match = item.match(regexDate);
      const valid = match && match[0] === today.toString();

      if (!valid) localStorage.removeItem(item);

      let data = JSON.parse(localStorage.getItem(item) ?? "{}");
      const keys = Object.keys(data);

      if (!data && keys.length < 1) return localStorage.removeItem(item);
      if (data[keys[0]].site !== site) return localStorage.removeItem(item);

      // const routeId = data[keys[0]].routeId;

      // const isValidPatrol = (await validateRouteIfAlreadyPatrolledToday({
      //   site: site,
      //   routeId: routeId,
      // })) as any;

      // if (isValidPatrol && isValidPatrol?.isExist === true)
      //   return localStorage.removeItem(item);

      storedLogs.push(data);
    });

    return storedLogs;
  }

  return {
    MPatrolLog,
    patrolLogKey,
    patrolLog,
    setPatrolLog,
    questionnaires,
    setQuestionnaires,
    patrolLogError,
    onGoingPatrolLog,
    setOnGoingPatrol,
  };
}
