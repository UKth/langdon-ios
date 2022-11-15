import { TermCode, TermCodeType } from "@customTypes/models";

export const EXAMDATE_OFFSET = 1670750000000; // why??
export const MIN_TS = 60 * 1000;
export const HOUR_TS = 60 * MIN_TS;
export const WI_GMT_DIFF = -6 * HOUR_TS;
export const TIMEBOX_HOUR_HEIGHT = 50;
export const SMALLBOX_HOUR_HEIGHT = 30;

export const ANONYMOUS_USERNAME = "Badger";

export const API_URL = "https://langdon.vercel.app/api/";
export const WEB_URL = "https://collegetable.vercel.app/";

export const terms: { code: TermCodeType; name: string }[] = [
  { code: "T_1232", name: "Fall 2022" },
  { code: "T_1234", name: "Spring 2023" },
];

export const termNames: { [key: TermCode]: string } = {
  T_1232: "Fall 2022",
  T_1234: "Spring 2023",
};

export const CURRENT_TERMCODE: TermCodeType = "T_1232";
