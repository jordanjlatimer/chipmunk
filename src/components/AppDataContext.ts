import * as React from "react";

export interface AppData {
  data?: {
    categories: {
      [key in "expenses" | "incomes"]: {
        [key: string]: null | {
          [key: string]: null;
        };
      };
    };
    username: string;
    timeframes: {
      [key: string]: null | {
        [key: string]:
          | null
          | {
              [key in "actual" | "budgeted"]:
                | null
                | ({
                    [key in "incomes" | "expenses"]:
                      | null
                      | ({
                          [key: string]:
                            | null
                            | ({
                                [key: string]: null | {
                                  amount: number;
                                  note: string;
                                };
                              } & { amount: number; note: string });
                        } & { amount: number });
                  } & { amount: number });
            };
      };
    };
  };
  updateAppData: (value: AppData["data"]) => void;
}

export const AppDataContext = React.createContext<AppData | null>(null);
