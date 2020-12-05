import * as React from "react"
import { LineGraph, Loader } from "simp-ui";
import { Table } from "../../../Reusables/Table/Table";
import { TableBody } from "../../../Reusables/Table/TableBody";
import { TableCell } from "../../../Reusables/Table/TableCell";
import { TableHeader } from "../../../Reusables/Table/TableHeader";
import { TableRow } from "../../../Reusables/Table/TableRow";
import "../../../../styles/overview.sass"

type dataFormat = {
  year: number
  month: string;
  expenses: {
    [key: string]: number
   };
   revenues: {
    [key: string]: number
   };
}[];

type OverviewProps = {
  headerAction: (value: {month: string, year: number}) => void
}

const Overview: React.FC<OverviewProps> = ({headerAction}) => {
  const [data, setData] = React.useState<dataFormat>([]);

  React.useEffect(() => {
    fetch("https://my.api.mockaroo.com/chipmunk-monthly-expenses-and-revenues.json?key=b1b7fe80")
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, []);

  return (
    <div className="budget-overview">
      <div className="budget-overview-header">Monthly Expenses and Revenues</div>
      <div>Click on a month to view a detailed breakdown.</div>
      <div className="budget-overview-table">
        {
          data.length < 1 ? 
            <Loader /> 
            : 
            <Table>
              <TableHeader>
                <TableCell header>Category</TableCell>
                {data.map(month => <TableCell header clickable onClick={() => headerAction({month: month.month, year: month.year})} key={month.month}>{month.month}</TableCell>)}
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell group="positive" colspan={data.length + 1}>Revenues</TableCell>
                </TableRow>
                {Object.keys(data[0].revenues).map(revenueCategory => {
                  return (
                    <TableRow key={revenueCategory}>
                      <TableCell group="positive" indent={1}>{revenueCategory.charAt(0).toUpperCase() + revenueCategory.slice(1)}</TableCell>
                      {data.map((month, i) => {
                        return <TableCell key={"td" + i}>${month.revenues[revenueCategory]}</TableCell>
                      })}
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell group="negative" colspan={data.length + 1}>Expenses</TableCell>
                </TableRow>
                {Object.keys(data[0].expenses).map(expenseCategory => {
                  return (
                    <TableRow key={expenseCategory}>
                      <TableCell group="negative" indent={1}>{expenseCategory.charAt(0).toUpperCase() + expenseCategory.slice(1)}</TableCell>
                      {data.map((month, i) => {
                        return <TableCell key={"td" + i}>${month.expenses[expenseCategory]}</TableCell>
                      })}
                    </TableRow>
                  )
                })}
                <TableRow>
                  <TableCell group="total" colspan={data.length + 1}>Total</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell group="total" indent={1}>Totals</TableCell>
                  {data.map((month, i) => {
                    const expenses = Object.keys(month.expenses).reduce((a, b) => a + month.expenses[b], 0)
                    const revenues = Object.keys(month.revenues).reduce((a, b) => a + month.revenues[b], 0)
                    return (
                      <TableCell key={"td" + i}>{expenses > revenues ? "(" : ""}${Math.abs(revenues - expenses)}{expenses > revenues ? ")" : ""}</TableCell>
                    )
                  })}
                </TableRow>
              </TableBody>
            </Table>
        }
      </div>
      <div className="budget-overview-graph">
        {data.length < 1 ? (
          null
        ) : (
          <LineGraph
            lines={[
              {
                label: "Revenues",
                options: {
                  lineColor: "green",
                  lineWidth: 2,
                  pointFill: "white",
                  pointRadius: 2,
                },
                data: data.map(month => {
                  return { x: month.month, y: Object.keys(month.revenues).reduce((a, b) => a + month.revenues[b], 0)};
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
                data: data.map(month => {
                  return { x: month.month, y: Object.keys(month.expenses).reduce((a, b) => a + month.expenses[b], 0)};
                }),
              },
            ]}
            yPrefix="$"
            legend
          />
        )}
      </div>
    </div>
  )
}

Overview.displayName = "Overview"

export { Overview }