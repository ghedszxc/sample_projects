export default function useNotification() {
  class MNotification implements TNotification {
    _id?: string;
    namespace?:
      | "/organization-events"
      | "/visitor-events"
      | "/feedback-events"
      | undefined;
    module?:
      | "service-provider"
      | "facility"
      | "resident"
      | "form"
      | "role"
      | "feedback"
      | "work-order"
      | "calendar"
      | "key"
      | "visitor"
      | "building"
      | "cctv"
      | "announcement"
      | "emergency-contact"
      | "daily-occurrence-book"
      | "incident"
      | undefined;
    room?: string | undefined;
    event?: string | undefined;
    users?:
      | { _id?: string | string; hasRead?: boolean; isArchived?: boolean }[]
      | undefined;
    data?: Record<string, any> | Record<string, any>[] | undefined;
    message?: { title?: string; content?: string };
    createdAt?: Date | undefined;
    updatedAt?: Date | undefined;

    constructor({
      _id,
      namespace,
      module,
      room,
      event,
      users,
      data,
      message,
      createdAt,
      updatedAt,
    }: TNotification = {}) {
      this._id = _id;
      this.namespace = namespace || undefined;
      this.module = module || undefined;
      this.room = room || undefined;
      this.event = event || undefined;
      this.users = users || [];
      this.data = data || {};
      this.message = message || {};
      this.createdAt = createdAt || new Date();
      this.updatedAt = updatedAt;
    }
  }

  const notifications = useState("notifications", (): TNotification[] => []);
  const unreadNotifications = useState(
    "unreadNotifications",
    (): Record<string, any> | undefined => undefined,
  );
  const page = useState("notificationPage", () => 1);
  const pages = useState("notificationPages", () => 0);
  const itemsPerPage = useState("itemsPerPage", () => 10);
  const searchNotification = useState("searchNotification", () => "");
  const pageRange = useState("notificationPageRange", () => "-- - -- of --");
  const isNotificationLoaded = useState("isNotificationLoaded", () => false);
  const notification = useState(
    "notification",
    (): TNotification => new MNotification(),
  );

  function setNotification(data?: TNotification) {
    notification.value = data || new MNotification();
  }
  const { currentUser } = useLocalAuth();

  async function getNotificationsByPageSearch({
    page = 1,
    search = "",
    limit = 10,
    hasRead,
    isArchived,
    module,
    event,
    startDate,
    endDate,
  }: {
    page?: number;
    search?: string;
    limit?: number;
    hasRead?: boolean;
    isArchived?: boolean;
    module?: TNotification["module"] | TNotification["module"][];
    event?: TNotification["event"];
    startDate?: Date | string;
    endDate?: Date | string;
  }) {
    const { error, data } = await useLocalFetch(
      `/api/notification/v1/${currentUser.value._id}/search`,
      {
        method: "GET",
        query: {
          page,
          search,
          limit,
          hasRead,
          isArchived,
          module: Array.isArray(module)
            ? [...module]
            : module
              ? module
              : [
                  "service-provider",
                  "resident",
                  "facility",
                  "form",
                  "role",
                  "feedback",
                  "work-order",
                  "calendar",
                  "key",
                  "visitor",
                  "building",
                  "cctv",
                  "announcement",
                  "emergency-contact",
                  "daily-occurrence-book",
                  "incident",
                ],
          event,
          startDate,
          endDate,
        },
      },
    );

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value);
    }
  }

  async function searchNotifications({
    search,
    hasRead,
    isArchived,
    module,
    event,
    startDate,
    endDate,
  }: {
    search: string;
    hasRead?: boolean;
    isArchived?: boolean;
    module?: TNotification["module"] | TNotification["module"][];
    event?: TNotification["event"];
    startDate?: Date | string;
    endDate?: Date | string;
  }) {
    const getNotifications = (await getNotificationsByPageSearch({
      page: page.value,
      limit: itemsPerPage.value,
      search,
      hasRead,
      isArchived,
      module: Array.isArray(module)
        ? [...module]
        : module
          ? module
          : [
              "service-provider",
              "resident",
              "facility",
              "form",
              "role",
              "feedback",
              "work-order",
              "calendar",
              "key",
              "visitor",
              "building",
              "cctv",
              "announcement",
              "emergency-contact",
              "daily-occurrence-book",
              "incident",
            ],
      event,
      startDate,
      endDate,
    })) as TGetNotificationsByPageSearchResponse;
    notifications.value = getNotifications.items as TNotification[];
    pageRange.value = getNotifications.pageRange;
    pages.value = getNotifications.pages;
  }

  async function getNotificationById(_id: string) {
    const { error, data } = await useLocalFetch(`/api/notification/v1/${_id}`);

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message);
    }

    if (data && data.value) {
      return Promise.resolve(data.value as TNotification);
    }
  }

  async function getAllNotificationsCount({
    hasRead,
    isArchived,
    module,
    event,
    startDate,
    endDate,
  }: {
    hasRead?: boolean;
    isArchived?: boolean;
    module?: TNotification["module"] | TNotification["module"][];
    event?: TNotification["event"];
    startDate?: Date | string;
    endDate?: Date | string;
  } = {}) {
    const { error, data } = await useLocalFetch(
      `/api/notification/v1/${currentUser.value._id}/all`,
      {
        query: {
          hasRead,
          isArchived,
          module: Array.isArray(module)
            ? [...module]
            : module
              ? module
              : [
                  "service-provider",
                  "resident",
                  "facility",
                  "form",
                  "role",
                  "feedback",
                  "work-order",
                  "calendar",
                  "key",
                  "visitor",
                  "building",
                  "cctv",
                  "announcement",
                  "emergency-contact",
                  "daily-occurrence-book",
                  "incident",
                ],
          event,
          startDate,
          endDate,
        },
      },
    );
    if (error && error.value) {
      return Promise.reject(error.value);
    }
    if (data && data.value) {
      unreadNotifications.value = data.value as {
        all: number;
        [key: string]: number;
      };
      return Promise.resolve(
        data.value as {
          all: number;
          [key: string]: number;
        },
      );
    }
  }

  async function setNotifications({
    hasRead,
    isArchived,
    module,
    event,
    startDate,
    endDate,
  }: {
    hasRead?: boolean;
    isArchived?: boolean;
    module?: TNotification["module"] | TNotification["module"][];
    event?: TNotification["event"];
    startDate?: Date | string;
    endDate?: Date | string;
  } = {}) {
    try {
      isNotificationLoaded.value = true;

      const _notifications = (await getNotificationsByPageSearch({
        search: searchNotification.value,
        page: page.value,
        hasRead,
        isArchived,
        module: Array.isArray(module)
          ? [...module]
          : module
            ? module
            : [
                "service-provider",
                "resident",
                "facility",
                "form",
                "role",
                "feedback",
                "work-order",
                "calendar",
                "key",
                "visitor",
                "building",
                "cctv",
                "announcement",
                "emergency-contact",
                "daily-occurrence-book",
                "incident",
              ],
        event,
        startDate,
        endDate,
      })) as TDataRequestResponse;
      notifications.value = _notifications.items as TNotification[];
      pageRange.value = _notifications.pageRange;
      pages.value = _notifications.pages;
      isNotificationLoaded.value = false;
    } catch (error) {
      notifications.value = [];
      pageRange.value = "-- - -- of --";
      pages.value = 0;
      isNotificationLoaded.value = false;
    }
  }

  async function updateNotificationById({
    _id,
    hasRead,
    isArchived,
  }: {
    _id: string;
    hasRead: boolean;
    isArchived?: boolean;
  }) {
    const { error, data } = await useLocalFetch(`/api/notification/v1/${_id}`, {
      method: "PUT",
      body: JSON.stringify({
        hasRead,
        isArchived,
      }),
      query: {
        userId: currentUser.value._id,
      },
    });

    if (error && error.value && error.value.data) {
      return Promise.reject(error.value.data.message as string);
    }

    const result = data as any;

    if (result && result.value) {
      return Promise.resolve(result.value.message as string);
    }
  }

  async function updateAllNotifications({
    hasRead,
    isArchived,
    module,
    event,
  }: {
    hasRead: boolean;
    isArchived?: boolean;
    module?: TNotification["module"];
    event?: TNotification["event"];
  }) {
    const { error, data } = await useLocalFetch(
      `/api/notification/v1/${currentUser.value._id}/all`,
      {
        method: "PUT",
        body: JSON.stringify({
          hasRead,
          isArchived,
          module,
          event,
        }),
        query: {
          userId: currentUser.value._id,
        },
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

  function nextPage({
    hasRead,
    isArchived,
    module,
    event,
    startDate,
    endDate,
  }: {
    hasRead?: boolean;
    isArchived?: boolean;
    module?: TNotification["module"];
    event?: TNotification["event"];
    startDate?: Date | string;
    endDate?: Date | string;
  } = {}) {
    page.value++;
    setNotifications({
      hasRead,
      isArchived,
      module,
      event,
      startDate,
      endDate,
    });
  }

  function prevPage({
    hasRead,
    isArchived,
    module,
    event,
    startDate,
    endDate,
  }: {
    hasRead?: boolean;
    isArchived?: boolean;
    module?: TNotification["module"];
    event?: TNotification["event"];
    startDate?: Date | string;
    endDate?: Date | string;
  } = {}) {
    page.value--;
    setNotifications({
      hasRead,
      isArchived,
      module,
      event,
      startDate,
      endDate,
    });
  }

  return {
    notification,
    notifications,
    unreadNotifications,
    page,
    pages,
    prevPage,
    nextPage,
    itemsPerPage,
    pageRange,
    isNotificationLoaded,
    searchNotification,
    setNotification,
    setNotifications,
    getNotificationById,
    getAllNotificationsCount,
    searchNotifications,
    updateNotificationById,
    updateAllNotifications,
  };
}
