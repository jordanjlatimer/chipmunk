import * as React from "react";
import { Dropdown, LineGraph, Loader, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import "../styles/overview.sass";
import { AppData, AppDataContext, category, endCategory } from "./AppDataContext";

type OverviewProps = {
  headerAction: (value: { month: number; year: number }) => void;
};

export const Overview: React.FC<OverviewProps> = ({ headerAction }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [view, setView] = React.useState({label: "Budgeted", value: "budgeted"});

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

  const formatAmounts = (value: number, isTotal: boolean) =>
      isTotal
      ? value < 0
        ? "($" + Math.abs(value) + ")"
        : "$" + Math.abs(value)
      : "$" + Math.abs(value);

  const generateTableBody = (subData: any, indent: number, group?: string) => {
    if (subData["timeframes"]){
      return timeframes.map(timeframe => {
        if (subData["timeframes"][timeframe.year.toString()]?.[timeframe.month.toString()]){
          return (
            <React.Fragment>
              <TableCell>${subData["timeframes"][timeframe.year][timeframe.month][view.value === "both" ? "budgeted" : view.value]}</TableCell>
              {view.value === "both" && <TableCell>${subData["timeframes"][timeframe.year][timeframe.month]["actual"]}</TableCell>}
            </React.Fragment>
          )
        } else {
          return (
            <React.Fragment>
              <TableCell>$0</TableCell>
              {view.value === "both" && <TableCell>$0</TableCell>}
            </React.Fragment>
          )
        }
      })
    } else {
      return (
        Object.keys(subData).filter(key => key !== "username").map(key => {
          group = key === "Incomes" ? "positive" : key === "Expenses" ? "negative" : group
          if (subData[key]["timeframes"]){
            return (
              <React.Fragment>
                <TableRow>
                  <TableCell group={group} indent={indent}>{key}</TableCell>
                  {generateTableBody(subData[key], 0, group)}
                </TableRow>
              </React.Fragment>
            )
          } else {
            return (
              <React.Fragment>
                <TableRow>
                  <TableCell group={group} colspan={view.value === "both" ? 25 : 13} indent={indent}>{key}</TableCell>
                </TableRow>
                {generateTableBody(subData[key], indent + 1, group)}
              </React.Fragment>
            )
          }
        })
      )
    }
  }

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
        onChange={(value: { label: string; value: string }) => setView(value)}
        value={[view]}
      />
      <div className="budget-overview-table">
        {data ?
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
            <TableBody>
              {generateTableBody(data, 0)}
            </TableBody>
          </Table>
          : <Loader/>
        }
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
