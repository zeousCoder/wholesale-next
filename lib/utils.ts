import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function normalizeName(name: string) {
  return name
    .trim()
    .replace(/_+/g, " ") // instead of ( _ ) use ( backslash s)
    .replace(/[^a-zA-Z_'-]/g, "") // instead of ( _ ) use ( backslash s)
    .replace(/_/g, (char) => char.toUpperCase()); // instead of ( _ ) use ( backslash b backslash w)
}

export const VALID_DOMAINS = () => {
  const domains = ["gmail.com", "yahoo.com", "outlook.com"];

  if (process.env.NODE_ENV === "development") {
    domains.push("example.com");
  }

  return domains;
};
