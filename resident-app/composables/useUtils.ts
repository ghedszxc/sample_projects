export default function () {
  type TMethods =
    | "head"
    | "options"
    | "GET"
    | "HEAD"
    | "PATCH"
    | "POST"
    | "PUT"
    | "DELETE"
    | "CONNECT"
    | "OPTIONS"
    | "TRACE"
    | "get"
    | "patch"
    | "post"
    | "put"
    | "delete"
    | "connect"
    | "trace"
    | undefined;
  async function useLocalFetchUtil<T>(
    url: string,
    method: TMethods,
    queryOrBody?: {} | string,
    bodyOpt?: {} | string,
  ) {
    let options: any = {};
    if (method && /^(GET|DELETE)$/i.test(method)) {
      if (!queryOrBody) {
        options = {
          method: method,
        };
      } else {
        options = {
          method: method,
          query: queryOrBody,
        };
      }
    } else if (method && /^(PATCH)$/i.test(method)) {
      if (queryOrBody && bodyOpt) {
        options = {
          method: method,
          query: queryOrBody,
          body: bodyOpt,
        };
      } else {
        options = {
          method: method,
          body: queryOrBody || bodyOpt,
        };
      }
    } else {
      options = {
        method: method,
        body:
          (queryOrBody &&
          typeof queryOrBody === "object" &&
          Object.keys(queryOrBody).length
            ? JSON.stringify(queryOrBody)
            : "") ||
          (bodyOpt && typeof bodyOpt === "object" && Object.keys(bodyOpt).length
            ? JSON.stringify(bodyOpt)
            : ""),
      };
    }
    return new Promise(async (resolve, reject) => {
      const { error, data } = await useLocalFetch(url, options);
      if (error && error.value && error.value.data) {
        reject(error.value.data.message);
      }

      if (data && data.value) {
        resolve(data.value);
      }
    }) as T;
  }

  function validEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email) || "Invalid email address";
  }

  function minPasswordLength(password: string) {
    return (
      (password && password.length >= 8) ||
      "Password must be at least 8 characters"
    );
  }

  function requiredInput(input: string) {
    return !!input || "This field is required.";
  }

  function formatNumberIntoString(value: number, withDecimal = true) {
    return value.toLocaleString("en-US", {
      minimumFractionDigits: withDecimal ? 2 : 0,
    });
  }

  function calculateDateRange(
    startDate: string | number | Date,
    months: number,
  ) {
    startDate = new Date(startDate);
    const endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1 + months,
      startDate.getDate(),
    );

    // Format the dates for output
    const startMonth = startDate.toLocaleString("default", { month: "short" });
    const endMonth = endDate.toLocaleString("default", { month: "short" });

    const startDateString =
      startMonth + " " + startDate.getDate() + ", " + startDate.getFullYear();
    const endDateString =
      endMonth + " " + endDate.getDate() + ", " + endDate.getFullYear();

    return {
      formatted: "Start " + startDateString + " - Ends " + endDateString,
      raw: {
        start: startDate,
        end: endDate,
      },
    };
  }

  function formatDateAndTime(value: string) {
    if (!value) return "";
    const datetime = new Date(value);
    datetime.setHours(datetime.getHours() - 8);

    return `${datetime.toLocaleDateString("en-US", {
      timeZone: "Asia/Singapore",
    })} ${datetime.toLocaleTimeString("en-US", {
      timeZone: "Asia/Singapore",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  // function formatDate(value: string) {
  //   if (!value) return "";
  //   return new Date(value).toLocaleDateString();
  // }

  function formatDate(value: string) {
    if (!value) return "";
    return new Date(value).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }

  function formatDateNotification(value: string) {
    if (!value) return "";

    const date = new Date(value);
    const day = date.getDate();
    const month = date.toLocaleString("en-GB", { month: "long" });
    const year = date.getFullYear();

    let suffix = "th";
    if (day === 1 || day === 21 || day === 31) {
      suffix = "st";
    } else if (day === 2 || day === 22) {
      suffix = "nd";
    } else if (day === 3 || day === 23) {
      suffix = "rd";
    }

    return `${day}${suffix} of ${month}, ${year}`;
  }

  function prettifyString(text: string) {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function formatTime(value: string) {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      timeZone: "Asia/Singapore",
    });
  }

  function formatTime24hrs(value: string) {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Singapore",
    });
  }

  function standardFormatDate(date: string | Date) {
    const today = new Date(date);
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;

    return `${day}/${month}/${year}`;
  }

  function standardFormatTime(date: string | Date) {
    const today = new Date(date);
    let hour = today.getHours();
    let minute = today.getMinutes().toString().padStart(2, "0");

    return `${hour}:${minute}`;
  }

  function standardFormatDateTime(date: string | Date) {
    const today = new Date(date);
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    let hour = today.getHours();
    let minute =
      today.getMinutes() <= 9 ? `0${today.getMinutes()}` : today.getMinutes();

    if (day < 10) day = `0${day}`;
    if (month < 10) month = `0${month}`;

    return `${day}/${month}/${year} ${hour}:${minute}`;
  }

  function formatDateAndTimeORIG(
    value: string | Date,
    isNotAdjusted?: boolean,
  ) {
    if (!value) return "";
    const datetime = new Date(value);
    if (!isNotAdjusted) {
      datetime.setHours(datetime.getHours() - 8);
    }

    return `${datetime.toLocaleDateString("en-US", {
      timeZone: "Asia/Singapore",
    })} ${datetime.toLocaleTimeString("en-US", {
      timeZone: "Asia/Singapore",
      hour: "2-digit",
      minute: "2-digit",
    })}`;
  }

  function getInitial(name: string): string {
    const rgx: RegExp = /\b\w/g;

    const initials: string[] = name.match(rgx) || [];

    return initials.join("").toUpperCase();
  }

  function generateRandomColors() {
    return (
      "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  const materialColors = [
    "red",
    "deep-purple",
    "light-blue",
    "green",
    "yellow",
    "deep-orange",
    "pink",
    "indigo",
    "cyan",
    "light-green",
    "amber",
    "brown",
    "purple",
    "blue",
    "teal",
    "lime",
    "orange",
    "blue-grey",
  ];

  function getUserType(value: string) {
    const type = value;
    if (type === "organization") {
      return "Management Agency";
    }

    if (type === "site") {
      return "Site Personnel";
    }

    if (type === "service-provider") {
      return "Service Provider";
    }

    return type;
  }

  function isImage(filename: string) {
    if (!filename) return false;
    // Extract the file extension
    const extension = filename.split(".").pop()?.toLowerCase();

    // Define a list of image file extensions
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

    // Check if the extension is in the list of image extensions
    return imageExtensions.includes(extension!);
  }

  function maskString(
    text: string,
    options?: {
      startingLength: number;
      lastLength: number;
      staticMaskLength?: number;
      isNricMask?: boolean;
    },
  ) {
    const startingLength = options?.startingLength ?? 2;
    const lastLength = options?.lastLength ?? 2;
    const staticMaskLength = options?.staticMaskLength;
    const isNricMask = options?.isNricMask;
    const mask = "*".repeat(text.length - (startingLength + lastLength));
    let output = text.substring(text.length - lastLength);
    if (isNricMask) output = text.substring(text.length - 4);
    if (staticMaskLength)
      return (
        "*".repeat(staticMaskLength) +
        text.substring(0, startingLength) +
        output
      );
    return text.substring(0, startingLength) + mask + output;
  }

  function formatDateAndTimeSG(value: string | Date, isNotAdjusted?: boolean) {
    if (!value) return "";
    const datetime = new Date(value);
    if (!isNotAdjusted) {
      datetime.setHours(datetime.getHours() - 8);
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    const hours = datetime.getHours().toString().padStart(2, "0");
    const minutes = datetime.getMinutes().toString().padStart(2, "0");

    return `${datetime.toLocaleDateString(
      "en-SG",
      options,
    )} ${hours}${minutes}h`;
  }
  function getCapitalized(word = "") {
    return word[0].toUpperCase() + word.substring(1);
  }
  function removeEmptyPropertiesUtil<T extends Record<string, unknown>>(
    obj: T,
  ): Partial<T> {
    const rawObj = toRaw(obj); // Convert to raw object for reliable processing

    const newObj: Partial<T> = {};

    for (const key in rawObj) {
      if (Object.prototype.hasOwnProperty.call(rawObj, key)) {
        const value = rawObj[key];
        if (value) {
          if (Array.isArray(value)) {
            // Filter out empty, null, or undefined values from the array
            const newArray = value.filter((item: unknown) => item);
            if (newArray.length > 0) {
              newObj[key] = newArray as T[Extract<keyof T, string>]; // Type assertion to match the expected type
            }
          } else {
            newObj[key] = value;
          }
        }
      }
    }

    return newObj;
  }

  return {
    removeEmptyPropertiesUtil,
    validEmail,
    minPasswordLength,
    requiredInput,
    formatNumberIntoString,
    calculateDateRange,
    formatDate,
    getInitial,
    generateRandomColors,
    materialColors,
    formatTime,
    useLocalFetchUtil,
    getUserType,
    isImage,
    formatDateAndTime,
    maskString,
    prettifyString,
    standardFormatDate,
    standardFormatDateTime,
    standardFormatTime,
    formatDateAndTimeORIG,
    formatDateAndTimeSG,
    formatTime24hrs,
    formatDateNotification,
    getCapitalized,
  };
}
