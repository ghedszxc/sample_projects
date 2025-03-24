export function hasMorePages(pageRange: string): boolean {
  if (!pageRange || typeof pageRange !== "string") {
    return false;
  }
  try {
    const parts = pageRange.split(" ");
    if (parts.length < 3 || !parts[0].includes("-")) {
      return false;
    }
    const currentPageMax = parseInt(parts[0].split("-")[1], 10);
    const totalItems = parseInt(parts[2], 10);
    if (isNaN(currentPageMax) || isNaN(totalItems)) {
      return false;
    }
    return currentPageMax < totalItems;
  } catch (error) {
    return false;
  }
}
