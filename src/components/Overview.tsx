import * as React from "react";
import { Dropdown, LineGraph, Loader, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import "../styles/overview.sass";
import { AppDataContext } from "./AppDataContext";

type OverviewProps = {
  headerAction: (value: { month: number; year: number }) => void;
};

export const Overview: React.FC<OverviewProps> = ({ headerAction }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [view, setView] = React.useState("budgeted");

  type timeframe = {
    month: number;
    year: number;
  };

  const timeframes: timeframe[] = [];
  for (let i = 0; i < 11; i++) {
    const today = new Date();
    const month = today.getMonth() + i;
    const year = today.getFullYear() + (month > 12 ? 1 : 0);
    timeframes.push({
      month: month - (month > 12 ? 12 : 0),
      year: year,
    });
  }

  const formatAmounts = (value: number | undefined, isTotal: boolean) =>
    !value
      ? "$0"
      : isTotal
      ? value < 0
        ? "($" + Math.abs(value) + ")"
        : "$" + Math.abs(value)
      : "$" + Math.abs(value);

  return (
    <div className="budget-overview">
      <div className="budget-overview-header">Monthly Expenses and Incomes</div>
      <div>Click on a column header to view a detailed breakdown.</div>
      <Dropdown
        label="Select View"
        options={[
          { label: "Budgeted", value: "budgeted" },
          { label: "Actual", value: "actual" },
          { label: "Both", value: "both" },
        ]}
        onChange={(value: { label: string; value: string }) => setView(value.value)}
        placeholder="Budgeted"
      />
      <div className="budget-overview-table">
        {data && (
          <Table>
            <TableHeader>
              <TableCell header>Category</TableCell>
              {/*Starting at current month, add a header for each month for the next 11 months*/}
              {timeframes.map(timeframe => (
                <TableCell
                  colspan={view === "both" ? 2 : 1}
                  header
                  clickable
                  onClick={() => headerAction(timeframe)}
                  key={timeframe.month}
                >
                  {new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" })}
                </TableCell>
              ))}
            </TableHeader>
            <TableBody>
              {/*For each category in ["expenses", "incomes"], add a group of rows starting with one labeling the category*/}
              {["incomes", "expenses"].map(category => {
                const group = category === "incomes" ? "positive" : "negative";
                return (
                  <React.Fragment key={category}>
                    <TableRow>
                      <TableCell group={group} colspan={26}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TableCell>
                    </TableRow>
                    {/*For each subcategory within the category, add a row with its amounts for each timeframe*/}
                    {Object.keys(data.categories[category as "incomes" | "expenses"]).map(subcategory => (
                      <TableRow key={subcategory}>
                        <TableCell group={group} indent={1} key={subcategory}>
                          {subcategory}
                        </TableCell>
                        {timeframes.map(timeframe => {
                          let budgeted =
                            data?.timeframes?.[timeframe.year]?.[timeframe.month]?.budgeted?.[
                              category as "expenses" | "incomes"
                            ]?.[subcategory]?.amount;
                          let actual =
                            data?.timeframes?.[timeframe.year]?.[timeframe.month]?.actual?.[
                              category as "expenses" | "incomes"
                            ]?.[subcategory]?.amount;
                          return (
                            <React.Fragment key={timeframe.month}>
                              {(view === "both" || view === "budgeted") && (
                                <TableCell key={"budgeted" + timeframe.month}>
                                  {formatAmounts(budgeted, false)}
                                </TableCell>
                              )}
                              {(view === "both" || view === "actual") && (
                                <TableCell key={"actual" + timeframe.month}>{formatAmounts(actual, false)}</TableCell>
                              )}
                            </React.Fragment>
                          );
                        })}
                      </TableRow>
                    ))}
                  </React.Fragment>
                );
              })}
              {/* Inside a total row, add a total cell for each timeframe.*/}
              <TableRow>
                <TableCell group="total">Total</TableCell>
                {timeframes.map((timeframe, i) => {
                  let budgeted = data?.timeframes?.[timeframe.year]?.[timeframe.month]?.budgeted?.amount;
                  let actual = data?.timeframes?.[timeframe.year]?.[timeframe.month]?.actual?.amount;
                  return (
                    <React.Fragment key={timeframe.month}>
                      {(view === "budgeted" || view === "both") && (
                        <TableCell key={"b" + timeframe.month}>{formatAmounts(budgeted, true)}</TableCell>
                      )}
                      {(view === "actual" || view === "both") && (
                        <TableCell key={"a" + timeframe.month}>{formatAmounts(actual, true)}</TableCell>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            </TableBody>
          </Table>
        )}
        {!data && <Loader />}
      </div>
      <div className="budget-overview-graph">
        {data && (
          <LineGraph
            lines={[
              {
                label: "Incomes",
                options: {
                  lineColor: "green",
                  lineWidth: 2,
                  pointFill: "white",
                  pointRadius: 2,
                },
                data: timeframes.map(timeframe => {
                  let actual = data?.timeframes?.[timeframe.year]?.[timeframe.month]?.actual?.incomes?.amount;
                  return {
                    x: new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" }),
                    y: actual || 0,
                  };
                }),
              },
              {
                label: "Expenses",
                options: {
                  lineColor: "Red",
                  lineWidth: 2,
                  pointFill: "white",
                  pointRadius: 2,
                },
                data: timeframes.map(timeframe => {
                  let actual = data?.timeframes?.[timeframe.year]?.[timeframe.month]?.actual?.expenses?.amount;
                  return {
                    x: new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" }),
                    y: actual || 0,
                  };
                }),
              },
            ]}
            yPrefix="$"
            legend
          />
        )}
      </div>
    </div>
  );
};
