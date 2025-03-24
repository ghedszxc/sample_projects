import codes from "./countryCodes.json";

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
  /**
   * @desc LOCAL FETCH UTILITY
   * @url http://localhost:4000/api/sample/v1/:{params}
   * @method TMethods
   * @queryOrBody {} | string | undefined
   * @bodyOpt {} | string | undefined
   */

  const searchCountryCode = ref("");
  const selectedCountryCode = ref("");
  const countryCodes = codes;

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
      } else {
        resolve(undefined);
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

  function requiredArrayInput(input: string[]) {
    return input.length > 0 || "This field is required.";
  }

  function alphabetAndSpaceOnly(input: string) {
    const regex = /^[a-zA-Z ]+$/;
    return regex.test(input) || "Alphabet only";
  }

  function filterNumericInput(input: string): string {
    return input.replace(/[^\d\s+]/g, "");
  }

  function validateOneHourGapTime(startTime: string, endTime: string) {
    if (startTime && endTime) {
      const startTimeDate = new Date();
      startTimeDate.setHours(startTime.split(":")[0], startTime.split(":")[1]);

      const endTimeDate = new Date();
      endTimeDate.setHours(endTime.split(":")[0], endTime.split(":")[1]);

      let difference = startTimeDate.getTime() - endTimeDate.getTime();

      let hoursMil = 1000 * 60 * 60; // milliseconds * seconds * minutes

      return (
        Math.abs(difference) >= hoursMil ||
        "End time value must have at least 1 hour gap from start time."
      );
    } else {
      return false;
    }
  }

  function validateStartAndEndTime(startTime: string, endTime: string) {
    if (startTime && endTime) {
      const startTimeDate = new Date();
      startTimeDate.setHours(startTime.split(":")[0], startTime.split(":")[1]);

      const endTimeDate = new Date();
      endTimeDate.setHours(endTime.split(":")[0], endTime.split(":")[1]);

      return (
        startTimeDate < endTimeDate ||
        "End time value must be higher than start time."
      );
    } else {
      return false;
    }
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
    const startMonth = startDate.toLocaleString("default", {
      month: "short",
    });
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

  function formatDateAndTime(value: string | Date, isNotAdjusted?: boolean) {
    if (!value) return "";
    const datetime = new Date(value);
    if (!isNotAdjusted) {
      datetime.setHours(datetime.getHours() - 8);
    }

    return `${datetime.toLocaleDateString("en-US", { timeZone: "Asia/Singapore" })} ${datetime.toLocaleTimeString("en-US", { timeZone: "Asia/Singapore", hour: "2-digit", minute: "2-digit" })}`;
  }

  function formatDate(value: string | Date) {
    if (!value) return "";
    return new Date(value).toLocaleDateString();
  }

  function compareDate(checkIn: string | Date, checkOut: string | Date) {
    // Get the current date without time component
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    if (checkIn && checkOut) {
      // Convert checkIn and checkOut to Date objects if they are strings
      const checkInDate =
        typeof checkIn === "string" ? new Date(checkIn) : checkIn;
      const checkOutDate =
        typeof checkOut === "string" ? new Date(checkOut) : checkOut;

      // Get the dates without the time components
      const checkInDateWithoutTime = new Date(
        checkInDate.getFullYear(),
        checkInDate.getMonth(),
        checkInDate.getDate(),
      );

      const checkOutDateWithoutTime = new Date(
        checkOutDate.getFullYear(),
        checkOutDate.getMonth(),
        checkOutDate.getDate(),
      );

      // If checkOut date is greater than checkIn date, it's considered overnight
      // Also, if checkIn date is in the past (less than or equal to current date), it's considered overnight
      return checkOutDateWithoutTime > checkInDateWithoutTime;
    } else {
      return false;
    }
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
    let minute = today.getMinutes();

    return `${hour}:${minute}`;
  }

  function standardFormatDateTime(date: string | Date) {
    if (!date) return "";

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

  function formatTime(value: string | Date, isDefault: Boolean = true) {
    return new Date(value).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
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

    return `${datetime.toLocaleDateString("en-SG", options)} ${hours}${minutes}h`;
  }

  function formatDateSG(value: string | Date) {
    if (!value) return "";
    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return date.toLocaleDateString("en-SG", options);
  }

  function formatDateToDB(value: string | Date) {
    if (value === undefined || value === null) return ""; // If value is undefined or null, return an empty string

    try {
      let _dateFormat = "";
      let dateParts =
        typeof value === "string" ? value.split("/") : String(value).split("/");
      let _date = new Date(
        `${dateParts[2]}-${dateParts[1]}-${dateParts[0]} 00:00`,
      );
      _dateFormat = new Intl.DateTimeFormat("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }).format(_date);
      return _dateFormat;
    } catch (error) {
      return "";
    }
  }

  function formatTime24(value: string | Date) {
    const date = new Date(value);
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}${minutes}h`;
  }

  function formatISODateTime(dateTimeString: string | Date) {
    const dateTime = new Date(dateTimeString);

    const monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const monthName = monthNames[dateTime.getMonth()];
    const day = dateTime.getDate();
    const year = dateTime.getFullYear();

    const hours = dateTime.getHours();
    const minutes = dateTime.getMinutes();

    const formattedDateTime = `${monthName} ${day}, ${year} ${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;

    return formattedDateTime;
  }

  function formatToNormalDate(dateString: string) {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(dateString);
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    return `${month} ${day}, ${year}`;
  }

  function getInitial(name: string): string {
    const rgx: RegExp = /\b\w/g;

    const initials: string[] = name?.match(rgx) || [];

    return initials.join("").toUpperCase();
  }

  function generateRandomColors() {
    return (
      "#" + (0x1000000 + Math.random() * 0xffffff).toString(16).substr(1, 6)
    );
  }

  function stringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(
      Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216),
    ).toString(16);
    return "#" + Array(6 - color.length + 1).join("0") + color;
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
      return "Service Provider Management";
    }

    if (type === "service-provider-member") {
      return "Service Provider Team";
    }

    return type;
  }

  function isImage(filename: string) {
    if (!filename) return false;
    // Extract the file extension
    const extension = filename.split(".").pop().toLowerCase();

    // Define a list of image file extensions
    const imageExtensions = ["jpg", "jpeg", "png", "gif", "bmp", "svg"];

    // Check if the extension is in the list of image extensions
    return imageExtensions.includes(extension);
  }

  function formatScheduleDays(days: []) {
    const dataFormat: any = [];
    days.map((day: string) => {
      dataFormat.push(day.substring(0, 3));
    });

    return dataFormat.join(",").replace(/,/g, ", ");
  }

  function calculateRemainingTime(item: Date | String) {
    let _date = new Date(item);
    _date.setHours(_date.getHours() - 8);
    const creationTime = _date.getTime();
    const currentTime = Date.now();
    const differenceInMillis = currentTime - creationTime;
    const differenceInSeconds = Math.floor(differenceInMillis / 1000);
    const desiredDurationInSeconds = 72 * 60 * 60; // 72 hours in seconds
    const remainingTimeInSeconds =
      desiredDurationInSeconds - differenceInSeconds;
    return remainingTimeInSeconds;
  }

  function capitalizeName(name: string): string {
    return name
      ?.split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function timeValidation(value: String | undefined, id: String) {
    if (value == "") {
      let _element = document.getElementById(id);
      _element?.classList.add("required-time");
    }
  }

  function timeValueValidation(elem: String | undefined) {
    if (elem != "") {
      if (elem.includes("mm") || elem.includes("HH")) {
        return false;
      }
      return true;
    }

    return false;
  }

  //accepts space separated words
  //returns capitalized letter in the beginning of each word
  function getProperWords(sentence = "") {
    const words = sentence.split(" ");
    for (let i = 0; i < words.length; i++) {
      words[i] = words[i][0].toUpperCase() + words[i].substr(1);
    }
    words.join(" ");
  }

  //capitalizes first letter of the word
  function getCapitalized(word = "") {
    return word[0].toUpperCase() + word.substring(1);
  }

  function prettifyString(text: string) {
    return text
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  }

  function getChangedValues<T extends Record<string, any>>(
    original: T,
    modified: T,
  ) {
    // Helper function to check if a value is an object
    function isObject(value: T) {
      return value && typeof value === "object" && !Array.isArray(value);
    }

    // Recursive function to find differences
    function findChanges(original: T, modified: T) {
      const changes: Partial<T> = {};

      for (const key in modified) {
        if (original.hasOwnProperty(key)) {
          if (isObject(modified[key]) && isObject(original[key])) {
            // If both are objects, recurse
            const nestedChanges = findChanges(original[key], modified[key]);
            if (Object.keys(nestedChanges).length > 0) {
              changes[key] = nestedChanges as any;
            }
          } else if (
            Array.isArray(modified[key]) &&
            Array.isArray(original[key])
          ) {
            // If both are arrays, compare arrays (simple shallow comparison)
            if (
              modified[key].length !== original[key].length ||
              !modified[key].every(
                (val: T, idx: number) => val === original[key][idx],
              )
            ) {
              changes[key] = modified[key];
            }
          } else if (modified[key] !== original[key]) {
            // If values are different, record the change
            changes[key] = modified[key];
          }
        } else {
          // Key doesn't exist in original, record the change
          changes[key] = modified[key];
        }
      }

      // Add properties that were removed in the modified object
      for (const key in original) {
        if (!modified.hasOwnProperty(key)) {
          changes[key] = undefined;
        }
      }

      return changes;
    }

    return findChanges(original, modified);
  }

  function generatePageTitle(overrideTitle?: string) {
    const route = useRoute();
    const { routes, services } = useLocalRoute();
    const serviceSublist = services.value.filter((service) => service.sublist);
    const baseLocal =
      routes.value?.find((local) =>
        route.name?.toString().includes(local.name),
      ) ||
      services.value.find((local) =>
        route.name?.toString().includes(local.name),
      ) ||
      serviceSublist.find((local) =>
        route.name?.toString().includes(local.name),
      );
    const brand = "Seven365";
    const title = `${prettifyString(overrideTitle ? overrideTitle : (baseLocal?.text! ?? route.name))} | ${brand}`;
    return title;
  }

  function formatPhoneNumber(prefix: string, number: string) {
    return `${prefix}-${number}`;
  }

  function displayPhoneNumber(number: string) {
    const countryCode = number.split("-")[0];
    const pNumber = number.split("-")[1];
    return { countryCode, pNumber };
  }

  function maskText(text: string, limit = 4) {
    if (text.length <= limit) {
      return text;
    }
    const maskedLength = text.length - limit;
    const maskedPart = "*".repeat(maskedLength);
    const visiblePart = text.slice(-4);
    return maskedPart + visiblePart;
  }

  const standardFormatDateYearMonthDay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  function getFullName(user: string | TUser) {
    if (!user || typeof user === "string") return user;
    return `${user.givenName} ${user.surname}`;
  }

  const daysOfWeek: Record<string, number> = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  function validateSchedule(schedule: any): string | boolean {
    const { startDay, startTime, endDay, endTime } = schedule;

    if (!startDay || !startTime || !endDay || !endTime) {
      return "All fields (startDay, startTime, endDay, endTime) must be provided.";
    }

    const startDayIndex = daysOfWeek[startDay];
    const endDayIndex = daysOfWeek[endDay];

    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);

    const startInMinutes =
      startDayIndex * 1440 + startHours * 60 + startMinutes;
    const endInMinutes = endDayIndex * 1440 + endHours * 60 + endMinutes;

    if (endInMinutes <= startInMinutes) {
      return "End day/time must be after the start day/time.";
    }

    const minTimeGap = 60;
    if (endInMinutes - startInMinutes < minTimeGap) {
      return "End time must be at least 1 hour after the start time.";
    }

    return true;
  }

  function validateDateTimeInput(day: string, time: string) {
    if (day && time) return false;

    return true;
  }

  function divideArrayAndRemoveUneven(array: any, n: number) {
    if (n <= 0) return [];
    const partSize = Math.floor(array.length / n);
    const evenLength = partSize * n;
    const result = [];
    for (let i = 0; i < partSize; i++) {
      result.push(array.splice(0, n));
    }
    return result;
  }

  function calculateDaysInSchedule(schedule: any): any[] {
    const daysOfWeek: string[] = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const minutesInDay = 24 * 60;
    const totalWeekMinutes = 7 * minutesInDay;

    if (schedule.startDay === schedule.endDay) {
      let days = daysOfWeek.filter(
        (item: any) => item !== schedule.startDay,
      ) as any;

      days = days.map((item: any) => {
        return {
          label: item,
          value: {
            startDay: item,
            startTime: schedule.startTime,
            endDay: item,
            endTime: schedule.endTime,
          },
        };
      });

      return days;
    }

    function convertToMinutes(day: string, time: string): number {
      const dayIndex = daysOfWeek.indexOf(day);
      const [hours, minutes] = time.split(":").map(Number);
      return dayIndex * minutesInDay + hours * 60 + minutes;
    }

    function convertToDayTime(minutes: number): { day: string; time: string } {
      const dayIndex = Math.floor(minutes / minutesInDay) % 7;
      const remainingMinutes = minutes % minutesInDay;
      const hours = Math.floor(remainingMinutes / 60)
        .toString()
        .padStart(2, "0");
      const mins = (remainingMinutes % 60).toString().padStart(2, "0");
      return { day: daysOfWeek[dayIndex], time: `${hours}:${mins}` };
    }

    const { startDay, startTime, endDay, endTime } = schedule;
    const startInMinutes = convertToMinutes(startDay, startTime);
    const endInMinutes = convertToMinutes(endDay, endTime);
    const duration =
      endInMinutes >= startInMinutes
        ? endInMinutes - startInMinutes
        : totalWeekMinutes - startInMinutes + endInMinutes;

    let remainingSchedules: any = [];

    let nextStartInMinutes = endInMinutes;
    let lastDay = "";

    while (nextStartInMinutes + duration <= 7 * minutesInDay) {
      const nextEndInMinutes = nextStartInMinutes + duration;

      const nextStartDayTime = convertToDayTime(nextStartInMinutes);
      const nextEndDayTime = convertToDayTime(nextEndInMinutes);

      if (
        nextStartDayTime.day !== schedule.endDay &&
        nextStartDayTime.day !== lastDay
      ) {
        lastDay = nextEndDayTime.day;
        remainingSchedules.push({
          startDay: nextStartDayTime.day,
          startTime: schedule.startTime,
          endDay: nextEndDayTime.day,
          endTime: schedule.endTime,
        });
      }

      nextStartInMinutes = nextEndInMinutes;
    }

    remainingSchedules = remainingSchedules.map((item: any) => {
      return {
        label:
          item.startDay !== item.endDay
            ? `${item.startDay} - ${item.endDay}`
            : `${item.startDay}`,
        value: item,
      };
    });

    return remainingSchedules;
  }

  return {
    validEmail,
    minPasswordLength,
    requiredInput,
    requiredArrayInput,
    alphabetAndSpaceOnly,
    formatNumberIntoString,
    calculateDateRange,
    formatDate,
    getInitial,
    generateRandomColors,
    materialColors,
    stringToColor,
    formatTime,
    formatTime24,
    useLocalFetchUtil,
    getUserType,
    isImage,
    calculateRemainingTime,
    formatDateAndTime,
    formatScheduleDays,
    formatDateAndTimeSG,
    formatDateSG,
    formatISODateTime,
    formatToNormalDate,
    formatDateToDB,
    formatPhoneNumber,
    capitalizeName,
    timeValidation,
    timeValueValidation,
    compareDate,
    prettifyString,
    standardFormatDate,
    standardFormatTime,
    standardFormatDateTime,
    getProperWords,
    getCapitalized,
    getChangedValues,
    searchCountryCode,
    selectedCountryCode,
    countryCodes,
    filterNumericInput,
    generatePageTitle,
    displayPhoneNumber,
    maskText,
    standardFormatDateYearMonthDay,
    validateSchedule,
    validateDateTimeInput,
    validateStartAndEndTime,
    validateOneHourGapTime,
    getFullName,
    calculateDaysInSchedule,
  };
}
