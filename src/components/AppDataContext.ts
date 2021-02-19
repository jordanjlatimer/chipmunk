import * as React from "react";

export interface endCategory {
  timeframes: {
    [key: string]: {
      [key: string]: {
        actual: number;
        budgeted: number;
      };
    };
  };
}

export interface category {
  timeframes: never;
  [key: string]: category | endCategory;
}

export interface AppData {
  data?: {
    [key in "Expenses" | "Incomes"]: category;
  } & { username: string; Totals: endCategory; timeframes: never };
  updateAppData: (value: AppData["data"]) => void;
}

export const AppDataContext = React.createContext<AppData | null>(null);
