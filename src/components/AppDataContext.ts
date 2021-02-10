import * as React from "react";

export interface appData {
  data: {
    categories: {
      [key in "expenses" | "incomes"]: {
        [key: string]: string[];
      };
    };
    username: string;
    timeframes: ({
      month: number;
      year: number;
    } & {
      [key in "actual" | "budgeted"]: {
        amount: number;
      } & {
        [key in "expenses" | "incomes"]: {
          [key: string]: {
            [key: string]: {
              amount: number;
              note: string;
            };
          } & {
            amount: number;
            note?: string;
          };
        } & {
          amount: number;
        };
      };
    })[];
  };
  updateAppData: (value: {}) => void;
}

export const AppDataContext = React.createContext<appData | null>(null);
