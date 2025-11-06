import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"



export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export const filteredItems = (items, term) => {
  return items.filter((item) =>
    Object.values(item).some(
      (value) =>
        typeof value === "string" &&
        value.toLowerCase().includes(term.toLowerCase())
    )
  );
};

export const formatDateTime = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

export const toInputDateTime = (isoString) => {
  if (!isoString) return "";
  const d = new Date(isoString);
  return d.toISOString().slice(0, 16);
};

export const fromInputDateTimeToISO = (localDateTimeString) => {
  if (!localDateTimeString) return null;
  return new Date(localDateTimeString).toISOString();
};

