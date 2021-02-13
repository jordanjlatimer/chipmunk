import * as React from "react";

export interface endCategory{
  timeframes: {
    [key: string]: {
      [key: string]: {
        actual: number,
        budgeted: number
      }
    }
  }
}

export interface category{
  [key: string]: category | endCategory
}

export interface AppData {
  data?: {
    [key in "expenses" | "incomes"]: category
  } & {username: string}
  updateAppData: (value: AppData["data"]) => void;
}

export const AppDataContext = React.createContext<AppData | null>(null);
