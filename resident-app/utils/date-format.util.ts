import moment from "moment-timezone";

export function formatEndDate(date: string | Date): Date {
  if (typeof date === "string") {
    // Remove timezone information from the string
    const dateWithoutTimezone = date.replace(/\s*\+\d{2}:\d{2}$/, "");
    // Create a new Date object using the formatted string
    date = new Date(dateWithoutTimezone);
  }
  // Set timezone to Asia/Singapore
  const singaporeMoment = moment.tz(date, "Asia/Singapore");
  // Set time to 23:59:59.999
  singaporeMoment.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
  return singaporeMoment.toDate();
}

export function formatDateString(
  today: Date | string,
  format?: "mm-dd-yyyy" | "dd-mm-yyyy",
  dateRange?: "startDate" | "endDate",
) {
  // Get month, day, and year
  today = typeof today === "string" ? new Date(today) : today;

  let month = today.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
  let day = today.getDate();
  let year = today.getFullYear();

  // Formatting
  let formattedDate;
  if (format === "mm-dd-yyyy") {
    formattedDate = `${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}-${year}`;
  } else if (format === "dd-mm-yyyy") {
    formattedDate = `${day.toString().padStart(2, "0")}-${month.toString().padStart(2, "0")}-${year}`;
  } else {
    // default yyyy-mm-dd
    formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
  }
  return formattedDate;
}

export function formatCronDate(
  date: Date | string,
  dateRange?: "startDate" | "endDate",
): Date {
  date = formatDateString(date, undefined);
  date = typeof date === "string" ? new Date(date) : date;

  // Set timezone to Asia/Singapore
  const singaporeMoment = moment.tz(date, "Asia/Singapore");

  if (!dateRange) {
    // Set time to 00:00:00
    singaporeMoment.set({ hour: 0, minute: 0, second: 0, millisecond: 0 });
    return singaporeMoment.toDate();
  }

  if (dateRange === "endDate") {
    // Set time to 23:59:59.999
    singaporeMoment.set({ hour: 23, minute: 59, second: 59, millisecond: 999 });
  }

  return singaporeMoment.toDate();
}
// this is for schedule task cronjob creating every 12 am and for date filtering
export function formatCronDateForCreate(date: Date | string) {
  // If the input is a string, parse it into a Date object
  const parsedDate = typeof date === "string" ? new Date(date) : date;

  let month = parsedDate.getMonth() + 1; // Adding 1 because getMonth() returns zero-based index
  let day = parsedDate.getDate();
  let year = parsedDate.getFullYear();

  // Formatting
  let formattedDate;
  formattedDate = `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;

  return new Date(`${formattedDate}T00:00:00.000+00:00`);
}
