import * as React from "react";
import { Dropdown, LineGraph, Loader, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import "../styles/overview.sass";
import { AppData, AppDataContext, category, endCategory } from "./AppDataContext";

type OverviewProps = {
  headerAction: (value: { month: number; year: number }) => void;
};

export const Overview: React.FC<OverviewProps> = ({ headerAction }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [view, setView] = React.useState({ label: "Budgeted", value: "budgeted" });

  type timeframe = {
    month: number;
    year: number;
  };

  const timeframes: timeframe[] = [];
  for (let i = 0; i < 12; i++) {
    const today = new Date();
    const month = today.getMonth() + i;
    const year = today.getFullYear() + (month > 12 ? 1 : 0);
    timeframes.push({
      month: month - (month > 12 ? 12 : 0),
      year: year,
    });
  }

  function getCategoryTotal(data: category | endCategory, timeframe: timeframe, group: "budgeted" | "actual"): number {
    let returnValue = 0;
    if (data.timeframes) {
      if (data.timeframes[timeframe.year]?.[timeframe.month]) {
        returnValue += data.timeframes[timeframe.year][timeframe.month][group];
      }
    } else {
      Object.keys(data).forEach(key => (returnValue += getCategoryTotal((data as category)[key], timeframe, group)));
    }
    return returnValue;
  }

  function formatValue(value: number, isTotal?: boolean) {
    if (isTotal && value < 0) {
      return "($" + Math.abs(Math.round(value * 100) / 100) + ")";
    } else {
      return "$" + Math.abs(Math.round(value * 100) / 100);
    }
  }

  function generateTableBody(data: AppData["data"]) {
    if (data) {
      return Object.keys(data)
        .filter(key => key !== "username")
        .map(category => {
          const group = category === "Incomes" ? "positive" : category === "Expenses" ? "negative" : "total";
          if (category === "Totals") {
            return (
              <TableRow group="total">
                <TableCell group={group}>Total</TableCell>
                {timeframes.map(timeframe => {
                  return (
                    <React.Fragment>
                      {(view.value === "budgeted" || view.value === "both") && (
                        <TableCell>
                          {formatValue(getCategoryTotal(data[category], timeframe, "budgeted"), true)}
                        </TableCell>
                      )}
                      {(view.value === "actual" || view.value === "both") && (
                        <TableCell>
                          {formatValue(getCategoryTotal(data[category], timeframe, "actual"), true)}
                        </TableCell>
                      )}
                    </React.Fragment>
                  );
                })}
              </TableRow>
            );
          } else {
            return (
              <React.Fragment>
                <TableRow>
                  <TableCell group={group} colspan={view.value === "both" ? 25 : 13}>
                    {category}
                  </TableCell>
                </TableRow>
                {Object.keys(data[category as "Incomes" | "Expenses"]).map(subcategory => (
                  <TableRow>
                    <TableCell group={group} indent={1}>
                      {subcategory}
                    </TableCell>
                    {timeframes.map(timeframe => {
                      return (
                        <React.Fragment>
                          {(view.value === "budgeted" || view.value === "both") && (
                            <TableCell>
                              {formatValue(
                                getCategoryTotal(
                                  data[category as "Incomes" | "Expenses"][subcategory],
                                  timeframe,
                                  "budgeted"
                                )
                              )}
                            </TableCell>
                          )}
                          {(view.value === "actual" || view.value === "both") && (
                            <TableCell>
                              {formatValue(
                                getCategoryTotal(
                                  data[category as "Incomes" | "Expenses"][subcategory],
                                  timeframe,
                                  "actual"
                                )
                              )}
                            </TableCell>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </TableRow>
                ))}
              </React.Fragment>
            );
          }
        });
    } else {
      return null;
    }
  }

  return (
    <div className="budget-overview">
      <div className="budget-overview-header">Budget Overview</div>
      <div>Click on a column header to view a detailed breakdown.</div>
      <Dropdown
        label="Select View"
        options={[
          { label: "Budgeted", value: "budgeted" },
          { label: "Actual", value: "actual" },
          { label: "Both", value: "both" },
        ]}
        onChange={(value: { label: string; value: string }) => setView(value)}
        value={[view]}
      />
      <div className="budget-overview-table">
        {data ? (
          <Table>
            <TableHeader>
              <TableCell header>Category</TableCell>
              {timeframes.map(timeframe => (
                <TableCell
                  colspan={view.value === "both" ? 2 : 1}
                  header
                  clickable
                  onClick={() => headerAction(timeframe)}
                  key={timeframe.month}
                >
                  {new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" })}
                </TableCell>
              ))}
            </TableHeader>
            <TableBody>{generateTableBody(data)}</TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </div>
      {/*data &&
        <div className="budget-overview-graph">
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
        </div>
      */}
    </div>
  );
};
