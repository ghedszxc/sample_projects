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
  const countryCodes = [
    {
      code: "+7 840",
      name: "Abkhazia",
    },
    {
      code: "+93",
      name: "Afghanistan",
    },
    {
      code: "+355",
      name: "Albania",
    },
    {
      code: "+213",
      name: "Algeria",
    },
    {
      code: "+1 684",
      name: "American Samoa",
    },
    {
      code: "+376",
      name: "Andorra",
    },
    {
      code: "+244",
      name: "Angola",
    },
    {
      code: "+1 264",
      name: "Anguilla",
    },
    {
      code: "+1 268",
      name: "Antigua and Barbuda",
    },
    {
      code: "+54",
      name: "Argentina",
    },
    {
      code: "+374",
      name: "Armenia",
    },
    {
      code: "+297",
      name: "Aruba",
    },
    {
      code: "+247",
      name: "Ascension",
    },
    {
      code: "+61",
      name: "Australia",
    },
    {
      code: "+672",
      name: "Australian External Territories",
    },
    {
      code: "+43",
      name: "Austria",
    },
    {
      code: "+994",
      name: "Azerbaijan",
    },
    {
      code: "+1 242",
      name: "Bahamas",
    },
    {
      code: "+973",
      name: "Bahrain",
    },
    {
      code: "+880",
      name: "Bangladesh",
    },
    {
      code: "+1 246",
      name: "Barbados",
    },
    {
      code: "+1 268",
      name: "Barbuda",
    },
    {
      code: "+375",
      name: "Belarus",
    },
    {
      code: "+32",
      name: "Belgium",
    },
    {
      code: "+501",
      name: "Belize",
    },
    {
      code: "+229",
      name: "Benin",
    },
    {
      code: "+1 441",
      name: "Bermuda",
    },
    {
      code: "+975",
      name: "Bhutan",
    },
    {
      code: "+591",
      name: "Bolivia",
    },
    {
      code: "+387",
      name: "Bosnia and Herzegovina",
    },
    {
      code: "+267",
      name: "Botswana",
    },
    {
      code: "+55",
      name: "Brazil",
    },
    {
      code: "+246",
      name: "British Indian Ocean Territory",
    },
    {
      code: "+1 284",
      name: "British Virgin Islands",
    },
    {
      code: "+673",
      name: "Brunei",
    },
    {
      code: "+359",
      name: "Bulgaria",
    },
    {
      code: "+226",
      name: "Burkina Faso",
    },
    {
      code: "+257",
      name: "Burundi",
    },
    {
      code: "+855",
      name: "Cambodia",
    },
    {
      code: "+237",
      name: "Cameroon",
    },
    {
      code: "+1",
      name: "Canada",
    },
    {
      code: "+238",
      name: "Cape Verde",
    },
    {
      code: "+ 345",
      name: "Cayman Islands",
    },
    {
      code: "+236",
      name: "Central African Republic",
    },
    {
      code: "+235",
      name: "Chad",
    },
    {
      code: "+56",
      name: "Chile",
    },
    {
      code: "+86",
      name: "China",
    },
    {
      code: "+61",
      name: "Christmas Island",
    },
    {
      code: "+61",
      name: "Cocos-Keeling Islands",
    },
    {
      code: "+57",
      name: "Colombia",
    },
    {
      code: "+269",
      name: "Comoros",
    },
    {
      code: "+242",
      name: "Congo",
    },
    {
      code: "+243",
      name: "Congo, Dem. Rep. of (Zaire)",
    },
    {
      code: "+682",
      name: "Cook Islands",
    },
    {
      code: "+506",
      name: "Costa Rica",
    },
    {
      code: "+385",
      name: "Croatia",
    },
    {
      code: "+53",
      name: "Cuba",
    },
    {
      code: "+599",
      name: "Curacao",
    },
    {
      code: "+537",
      name: "Cyprus",
    },
    {
      code: "+420",
      name: "Czech Republic",
    },
    {
      code: "+45",
      name: "Denmark",
    },
    {
      code: "+246",
      name: "Diego Garcia",
    },
    {
      code: "+253",
      name: "Djibouti",
    },
    {
      code: "+1 767",
      name: "Dominica",
    },
    {
      code: "+1 809",
      name: "Dominican Republic",
    },
    {
      code: "+670",
      name: "East Timor",
    },
    {
      code: "+56",
      name: "Easter Island",
    },
    {
      code: "+593",
      name: "Ecuador",
    },
    {
      code: "+20",
      name: "Egypt",
    },
    {
      code: "+503",
      name: "El Salvador",
    },
    {
      code: "+240",
      name: "Equatorial Guinea",
    },
    {
      code: "+291",
      name: "Eritrea",
    },
    {
      code: "+372",
      name: "Estonia",
    },
    {
      code: "+251",
      name: "Ethiopia",
    },
    {
      code: "+500",
      name: "Falkland Islands",
    },
    {
      code: "+298",
      name: "Faroe Islands",
    },
    {
      code: "+679",
      name: "Fiji",
    },
    {
      code: "+358",
      name: "Finland",
    },
    {
      code: "+33",
      name: "France",
    },
    {
      code: "+596",
      name: "French Antilles",
    },
    {
      code: "+594",
      name: "French Guiana",
    },
    {
      code: "+689",
      name: "French Polynesia",
    },
    {
      code: "+241",
      name: "Gabon",
    },
    {
      code: "+220",
      name: "Gambia",
    },
    {
      code: "+995",
      name: "Georgia",
    },
    {
      code: "+49",
      name: "Germany",
    },
    {
      code: "+233",
      name: "Ghana",
    },
    {
      code: "+350",
      name: "Gibraltar",
    },
    {
      code: "+30",
      name: "Greece",
    },
    {
      code: "+299",
      name: "Greenland",
    },
    {
      code: "+1 473",
      name: "Grenada",
    },
    {
      code: "+590",
      name: "Guadeloupe",
    },
    {
      code: "+1 671",
      name: "Guam",
    },
    {
      code: "+502",
      name: "Guatemala",
    },
    {
      code: "+224",
      name: "Guinea",
    },
    {
      code: "+245",
      name: "Guinea-Bissau",
    },
    {
      code: "+595",
      name: "Guyana",
    },
    {
      code: "+509",
      name: "Haiti",
    },
    {
      code: "+504",
      name: "Honduras",
    },
    {
      code: "+852",
      name: "Hong Kong SAR China",
    },
    {
      code: "+36",
      name: "Hungary",
    },
    {
      code: "+354",
      name: "Iceland",
    },
    {
      code: "+91",
      name: "India",
    },
    {
      code: "+62",
      name: "Indonesia",
    },
    {
      code: "+98",
      name: "Iran",
    },
    {
      code: "+964",
      name: "Iraq",
    },
    {
      code: "+353",
      name: "Ireland",
    },
    {
      code: "+972",
      name: "Israel",
    },
    {
      code: "+39",
      name: "Italy",
    },
    {
      code: "+225",
      name: "Ivory Coast",
    },
    {
      code: "+1 876",
      name: "Jamaica",
    },
    {
      code: "+81",
      name: "Japan",
    },
    {
      code: "+962",
      name: "Jordan",
    },
    {
      code: "+7 7",
      name: "Kazakhstan",
    },
    {
      code: "+254",
      name: "Kenya",
    },
    {
      code: "+686",
      name: "Kiribati",
    },
    {
      code: "+965",
      name: "Kuwait",
    },
    {
      code: "+996",
      name: "Kyrgyzstan",
    },
    {
      code: "+856",
      name: "Laos",
    },
    {
      code: "+371",
      name: "Latvia",
    },
    {
      code: "+961",
      name: "Lebanon",
    },
    {
      code: "+266",
      name: "Lesotho",
    },
    {
      code: "+231",
      name: "Liberia",
    },
    {
      code: "+218",
      name: "Libya",
    },
    {
      code: "+423",
      name: "Liechtenstein",
    },
    {
      code: "+370",
      name: "Lithuania",
    },
    {
      code: "+352",
      name: "Luxembourg",
    },
    {
      code: "+853",
      name: "Macau SAR China",
    },
    {
      code: "+389",
      name: "Macedonia",
    },
    {
      code: "+261",
      name: "Madagascar",
    },
    {
      code: "+265",
      name: "Malawi",
    },
    {
      code: "+60",
      name: "Malaysia",
    },
    {
      code: "+960",
      name: "Maldives",
    },
    {
      code: "+223",
      name: "Mali",
    },
    {
      code: "+356",
      name: "Malta",
    },
    {
      code: "+692",
      name: "Marshall Islands",
    },
    {
      code: "+596",
      name: "Martinique",
    },
    {
      code: "+222",
      name: "Mauritania",
    },
    {
      code: "+230",
      name: "Mauritius",
    },
    {
      code: "+262",
      name: "Mayotte",
    },
    {
      code: "+52",
      name: "Mexico",
    },
    {
      code: "+691",
      name: "Micronesia",
    },
    {
      code: "+1 808",
      name: "Midway Island",
    },
    {
      code: "+373",
      name: "Moldova",
    },
    {
      code: "+377",
      name: "Monaco",
    },
    {
      code: "+976",
      name: "Mongolia",
    },
    {
      code: "+382",
      name: "Montenegro",
    },
    {
      code: "+1664",
      name: "Montserrat",
    },
    {
      code: "+212",
      name: "Morocco",
    },
    {
      code: "+95",
      name: "Myanmar",
    },
    {
      code: "+264",
      name: "Namibia",
    },
    {
      code: "+674",
      name: "Nauru",
    },
    {
      code: "+977",
      name: "Nepal",
    },
    {
      code: "+31",
      name: "Netherlands",
    },
    {
      code: "+599",
      name: "Netherlands Antilles",
    },
    {
      code: "+1 869",
      name: "Nevis",
    },
    {
      code: "+687",
      name: "New Caledonia",
    },
    {
      code: "+64",
      name: "New Zealand",
    },
    {
      code: "+505",
      name: "Nicaragua",
    },
    {
      code: "+227",
      name: "Niger",
    },
    {
      code: "+234",
      name: "Nigeria",
    },
    {
      code: "+683",
      name: "Niue",
    },
    {
      code: "+672",
      name: "Norfolk Island",
    },
    {
      code: "+850",
      name: "North Korea",
    },
    {
      code: "+1 670",
      name: "Northern Mariana Islands",
    },
    {
      code: "+47",
      name: "Norway",
    },
    {
      code: "+968",
      name: "Oman",
    },
    {
      code: "+92",
      name: "Pakistan",
    },
    {
      code: "+680",
      name: "Palau",
    },
    {
      code: "+970",
      name: "Palestinian Territory",
    },
    {
      code: "+507",
      name: "Panama",
    },
    {
      code: "+675",
      name: "Papua New Guinea",
    },
    {
      code: "+595",
      name: "Paraguay",
    },
    {
      code: "+51",
      name: "Peru",
    },
    {
      code: "+63",
      name: "Philippines",
    },
    {
      code: "+48",
      name: "Poland",
    },
    {
      code: "+351",
      name: "Portugal",
    },
    {
      code: "+1 787",
      name: "Puerto Rico",
    },
    {
      code: "+974",
      name: "Qatar",
    },
    {
      code: "+262",
      name: "Reunion",
    },
    {
      code: "+40",
      name: "Romania",
    },
    {
      code: "+7",
      name: "Russia",
    },
    {
      code: "+250",
      name: "Rwanda",
    },
    {
      code: "+685",
      name: "Samoa",
    },
    {
      code: "+378",
      name: "San Marino",
    },
    {
      code: "+966",
      name: "Saudi Arabia",
    },
    {
      code: "+221",
      name: "Senegal",
    },
    {
      code: "+381",
      name: "Serbia",
    },
    {
      code: "+248",
      name: "Seychelles",
    },
    {
      code: "+232",
      name: "Sierra Leone",
    },
    {
      code: "+65",
      name: "Singapore",
    },
    {
      code: "+421",
      name: "Slovakia",
    },
    {
      code: "+386",
      name: "Slovenia",
    },
    {
      code: "+677",
      name: "Solomon Islands",
    },
    {
      code: "+27",
      name: "South Africa",
    },
    {
      code: "+500",
      name: "South Georgia and the South Sandwich Islands",
    },
    {
      code: "+82",
      name: "South Korea",
    },
    {
      code: "+34",
      name: "Spain",
    },
    {
      code: "+94",
      name: "Sri Lanka",
    },
    {
      code: "+249",
      name: "Sudan",
    },
    {
      code: "+597",
      name: "Suriname",
    },
    {
      code: "+268",
      name: "Swaziland",
    },
    {
      code: "+46",
      name: "Sweden",
    },
    {
      code: "+41",
      name: "Switzerland",
    },
    {
      code: "+963",
      name: "Syria",
    },
    {
      code: "+886",
      name: "Taiwan",
    },
    {
      code: "+992",
      name: "Tajikistan",
    },
    {
      code: "+255",
      name: "Tanzania",
    },
    {
      code: "+66",
      name: "Thailand",
    },
    {
      code: "+670",
      name: "Timor Leste",
    },
    {
      code: "+228",
      name: "Togo",
    },
    {
      code: "+690",
      name: "Tokelau",
    },
    {
      code: "+676",
      name: "Tonga",
    },
    {
      code: "+1 868",
      name: "Trinidad and Tobago",
    },
    {
      code: "+216",
      name: "Tunisia",
    },
    {
      code: "+90",
      name: "Turkey",
    },
    {
      code: "+993",
      name: "Turkmenistan",
    },
    {
      code: "+1 649",
      name: "Turks and Caicos Islands",
    },
    {
      code: "+688",
      name: "Tuvalu",
    },
    {
      code: "+1 340",
      name: "U.S. Virgin Islands",
    },
    {
      code: "+256",
      name: "Uganda",
    },
    {
      code: "+380",
      name: "Ukraine",
    },
    {
      code: "+971",
      name: "United Arab Emirates",
    },
    {
      code: "+44",
      name: "United Kingdom",
    },
    {
      code: "+1",
      name: "United States",
    },
    {
      code: "+598",
      name: "Uruguay",
    },
    {
      code: "+998",
      name: "Uzbekistan",
    },
    {
      code: "+678",
      name: "Vanuatu",
    },
    {
      code: "+58",
      name: "Venezuela",
    },
    {
      code: "+84",
      name: "Vietnam",
    },
    {
      code: "+1 808",
      name: "Wake Island",
    },
    {
      code: "+681",
      name: "Wallis and Futuna",
    },
    {
      code: "+967",
      name: "Yemen",
    },
    {
      code: "+260",
      name: "Zambia",
    },
    {
      code: "+255",
      name: "Zanzibar",
    },
    {
      code: "+263",
      name: "Zimbabwe",
    },
  ];

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

  function noSpecialCharacters(input: string) {
    const regex = /^[a-zA-Z0-9]+$/;
    return regex.test(input) || "No special characters allowed";
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

  function formatDateMDY(date) {
    let month = date.getMonth() + 1; // Months are zero-based
    let day = date.getDate();
    let year = date.getFullYear();

    // Add leading zero to month and day if they are single digits
    if (month < 10) {
      month = "0" + month;
    }
    if (day < 10) {
      day = "0" + day;
    }

    return `${month}/${day}/${year}`;
  }

  function formatDate(value: string | Date) {
    if (!value) return "";

    const date = new Date(value);
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    };

    return date.toLocaleDateString("en-GB", options);
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
    if (typeof name !== "string") {
      return "";
    }
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
    if (type === "admin") {
      return "Seven 365 Pte Ltd.";
    }
    if (type === "organization") {
      return "Managing Agent Head Quarters (MA-HQ)";
    }

    if (type === "site") {
      return "Managing Agent Site Personnel (MA-SP)";
    }

    if (type === "service-provider") {
      return "Service Provider Management (SPM)";
    }

    if (type === "service-provider-member") {
      return "Service Provider Team (SPT)";
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
      dataFormat.push(day != "Thursday" ? day.charAt(0) : "TH");
    });

    return dataFormat.join(",").replace(/,/g, "/");
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

  function getPast30DaysDate() {
    const now = new Date();
    return new Date(now.setDate(now.getDate() - 30));
  }

  const standardFormatDateYearMonthDay = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const timeFormatRule = (v: any) => {
    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    return timePattern.test(v) || "Time must be in HH:mm format";
  };

  const validateMilitaryTime = (event: Event) => {
    const char = String.fromCharCode(event.keyCode);
    const isValid = /[0-9:]/.test(char);
    if (!isValid) {
      event.preventDefault();
    }
  };

  function getFullName(user: string | TUser) {
    if (!user || typeof user === "string") return user;
    return `${user.givenName} ${user.surname}`;
  }

  function getNRICInfoScan(text: string) {
    const nricPattern = /[STFG]\d{7}[A-Z]/; // NRIC pattern
    const passportPattern = /[A-Z]\d{7}/; // Passport number pattern
    const licensePattern = /\d{8}/; // Driver license pattern (varies by country)
    // Look for possible name keywords
    const namePattern = /(?:Name|Given Name|Surname)\s*[:\-]?\s*([A-Za-z\s]+)/i;
    // Match the patterns
    const nric = text.match(nricPattern);
    const passport = text.match(passportPattern);
    const license = text.match(licensePattern);
    const nameMatch = text.match(namePattern);

    // Extracted data
    const extractedInfo = {
      name: nameMatch ? nameMatch[1].trim().replace(/[\s\n]+$/, "") : null, // Extract the name and remove trailing whitespaces and newlines
      nric: nric ? nric[0] : null,
      passport: passport ? passport[0] : null,
      license: license ? license[0] : null,
    };

    return extractedInfo;
  }

  async function getImage(url: string) {
    try {
      const response = await localFetchUtil<Blob>(url, "GET");
      return response;
    } catch (error: any) {
      console.log(error);
    }
  }

  async function localFetchUtil<T>(
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
      const { error, data } = await useLocalFetch<T>(url, options);
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
  // FORMATTER
  function formatStandardDate(date: string | Date) {
    if (!date) return "";

    const today = new Date(date);
    const year = today.getFullYear();
    let month = today.getMonth() + 1;
    let day = today.getDate();

    if (day < 10) day = `0${day}` as unknown as number;
    if (month < 10) month = `0${month}` as unknown as number;
    // to format with time please use formatStandardDateTime
    return `${day}/${month}/${year}`;
  }

  // UI LOGIC
  function uiStringToColor(str: string) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    const color = Math.floor(
      Math.abs(((Math.sin(hash) * 10000) % 1) * 16777216),
    ).toString(16);
    return "#" + Array(6 - color.length + 1).join("0") + color;
  }
  function uiGetInitials(name: string): string {
    const rgx: RegExp = /\b\w/g;

    const initials: string[] = name?.match(rgx) || [];

    return initials.join("").toUpperCase();
  }
  function uiStatusColor(status: string) {
    if (
      /Reject|Stop|Cancel|To Be Reviewed|ToBeReviewed|To Be Review|ToBeReview|Late$/i.test(
        status,
      ) ||
      (typeof status === "boolean" && !status)
    ) {
      return "red";
    } else if (
      /ToDo|To-Do|Pending|Waiting|In-Progress|In Progress|InProgress|toBeReview|To Be Review$/i.test(
        status,
      )
    ) {
      return "orange";
    } else if (
      /Approve|Complete|Done|Finish$/i.test(status) ||
      (typeof status === "boolean" && status)
    ) {
      return "green";
    }
    return "primary";
  }

  function jsonItem<T>(data: T) {
    return JSON.parse(JSON.stringify(data)) as T;
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
    formatStandardDate,
    uiStringToColor,
    uiGetInitials,
    uiStatusColor,
    jsonItem,
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
    formatDateMDY,
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
    getPast30DaysDate,
    standardFormatDateYearMonthDay,
    validateMilitaryTime,
    timeFormatRule,
    getFullName,
    getNRICInfoScan,
    getImage,
    noSpecialCharacters,
  };
}
