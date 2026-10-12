const ordinal = (day: number) => {
  const suffix =
    day % 100 >= 11 && day % 100 <= 13
      ? "th"
      : day % 10 === 1
        ? "st"
        : day % 10 === 2
          ? "nd"
          : day % 10 === 3
            ? "rd"
            : "th";
  return `${day}${suffix}`;
};

export const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  const day = ordinal(date.getDate());
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    date,
  );
  return `${day} ${month}, ${date.getFullYear()}`;
};

export const formatOfferTableDate = (value: string) => {
  if (!value) return "";
  const date = new Date(`${value}T00:00:00`);
  const day = ordinal(date.getDate());
  const month = new Intl.DateTimeFormat("en-GB", { month: "short" }).format(
    date,
  );
  return `${day} ${month}`;
};

export const formatDateRange = (start: string, end: string) =>
  `${formatOfferTableDate(start)} to ${formatOfferTableDate(end)}`;
export const formatNumber = (value: number) =>
  new Intl.NumberFormat("en-IN").format(value);
export const toDateInput = (value: string) => value;
export const isImageFileSupported = (file: File) =>
  ["image/png", "image/jpeg", "image/svg+xml"].includes(file.type) &&
  file.size <= 3 * 1024 * 1024;

export const getTodayDate = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getOfferStatus = (
  startDate: string,
  endDate: string,
): "active" | "scheduled" | "expired" => {
  const today = getTodayDate();

  if (today < startDate) return "scheduled";
  if (today > endDate) return "expired";
  return "active";
};
