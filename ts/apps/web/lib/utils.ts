import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function langCodeToName(code: string) {
  switch (code) {
    case "en":
      return "english";
    case "fr":
      return "french";
    default:
      throw new Error(`Unknown language code: ${code}`);
  }
}

export function languageToCode(language: string) {
  switch (language) {
    case "english":
      return "en";
    case "french":
      return "fr";
    default:
      throw new Error(`Unknown language: ${language}`);
  }
}
