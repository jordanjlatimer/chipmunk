import * as React from "react";
import { LineGraph, Loader, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import "../styles/overview.sass";
import { AppDataContext } from "./AppDataContext";

type OverviewProps = {
  headerAction: (value: { month: number; year: number }) => void;
};

export const Overview: React.FC<OverviewProps> = ({ headerAction }) => {
  const data = React.useContext(AppDataContext)?.data;

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

  const formatAmounts = (value: number | undefined, isTotal: boolean) => {
    return !value
      ? "$0"
      : value > 0
      ? "$" + Math.abs(value)
      : isTotal
      ? "($" + Math.abs(value) + ")"
      : "$" + Math.abs(value);
  };

  return (
    <div className="budget-overview">
      <div className="budget-overview-header">Monthly Expenses and Incomes</div>
      <div>Click on a column header to view a detailed breakdown.</div>
      <div className="budget-overview-table">
        {!data ? (
          <Loader />
        ) : (
          <Table>
            <TableHeader>
              <TableCell header>Category</TableCell>
              {timeframes.map(timeframe => (
                <TableCell header clickable onClick={() => headerAction(timeframe)} key={timeframe.month}>
                  {new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" })}
                </TableCell>
              ))}
            </TableHeader>
            <TableBody>
              {(Object.keys(data.categories) as ("expenses" | "incomes")[]).map(category => {
                const group = category === "incomes" ? "positive" : "negative";
                return (
                  <React.Fragment key={category}>
                    <TableRow>
                      <TableCell group={group} colspan={13}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TableCell>
                    </TableRow>
                    {Object.keys(data.categories[category]).map(key => {
                      return (
                        <TableRow key={key}>
                          <TableCell group={group} indent={1} key={key}>
                            {key.charAt(0).toUpperCase() + key.slice(1)}
                          </TableCell>
                          {timeframes.map(timeframe => {
                            let amount = data.timeframes.filter(
                              item => item.month === timeframe.month && item.year === timeframe.year
                            )[0]?.actual[category]?.[key]?.amount;
                            return (
                              <TableCell key={timeframe.month}>
                                {amount ? formatAmounts(amount, false) : "$0"}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              <TableRow>
                <TableCell group="total">Total</TableCell>
                {timeframes.map(timeframe => {
                  let amount = data.timeframes.filter(
                    item => item.month === timeframe.month && item.year === timeframe.year
                  )[0]?.actual.amount;
                  return <TableCell key={timeframe.month}>{amount ? formatAmounts(amount, true) : "$0"}</TableCell>;
                })}
              </TableRow>
            </TableBody>
          </Table>
        )}
      </div>
      <div className="budget-overview-graph">
        {!data ? null : (
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
                  let month = data.timeframes.filter(
                    dataTimeframe => timeframe.month === dataTimeframe.month && timeframe.year === dataTimeframe.year
                  )[0];
                  return {
                    x: new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" }),
                    y: month ? month.actual.incomes.amount : 0,
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
                  let month = data.timeframes.filter(
                    dataTimeframe => timeframe.month === dataTimeframe.month && timeframe.year === dataTimeframe.year
                  )[0];
                  return {
                    x: new Date(timeframe.year, timeframe.month).toLocaleString("default", { month: "short" }),
                    y: month ? month.actual.expenses.amount : 0,
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
