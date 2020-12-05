import * as React from "react"
import { Loader } from "simp-ui";
import { Table } from "../../../Reusables/Table/Table";
import { TableBody } from "../../../Reusables/Table/TableBody";
import { TableCell } from "../../../Reusables/Table/TableCell";
import { TableHeader } from "../../../Reusables/Table/TableHeader";
import { TableRow } from "../../../Reusables/Table/TableRow";
import { ActionBar } from "../../../Reusables/ActionBar";
import "../../../../styles/breakdown.sass"

type dataFormat = {
  expenses: {
    [key: string]: {
      [key: string]: {
        amount: number,
        note: string
      }
    }
   };
  revenues: {
    [key: string]: {
      [key: string]: {
        amount: number,
        note: string
      }
    }
  };
} | undefined;

type BreakdownProps = {
  month: string,
  year: string | number
}

const Breakdown: React.FC<BreakdownProps> = ({month, year}) => {
  const [data, setData] = React.useState<dataFormat>(undefined);

  React.useEffect(() => {
    fetch("https://my.api.mockaroo.com/chipmunk-month-breakdown.json?key=b1b7fe80")
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, []);

  const totalAmounts = () => {
    if (data) {
      let expenses = 0;
      for(const key in data.expenses){
        for(const key2 in data.expenses[key]){
          expenses += data.expenses[key][key2]["amount"]
        }
      }
      let revenues = 0;
      for(const key in data.revenues){
        for(const key2 in data.revenues[key]){
          revenues += data.revenues[key][key2]["amount"]
        }
      }
      return revenues > expenses ? "$" + (revenues - expenses) : "($" + Math.abs(revenues - expenses) + ")"
    }
  }

  return (
    <div className="budget-breakdown">
      <div className="budget-breakdown-header">
        {"Breakdown - " + month + ", " + year + " Budget"}
      </div>
      <ActionBar/>
      <div className="budget-breakdown-table">
        {
          data ?
            <Table>
              <TableHeader>
                <TableCell header>Category</TableCell>
                <TableCell header>Amount</TableCell>
                <TableCell header>Notes (If Any)</TableCell>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell group="positive" colspan={3}>Revenues</TableCell>
                </TableRow>
                {Object.keys(data.revenues).map(key1 => {
                  return (
                    <React.Fragment key={key1}>
                      <TableRow>
                        <TableCell group="positive" colspan={3} indent={1}>{key1.charAt(0).toUpperCase() + key1.slice(1)}</TableCell>
                      </TableRow>
                      {Object.keys(data.revenues[key1]).map(key2 => {
                        return (
                          <TableRow key={key2}>
                            <TableCell group="positive" indent={2}>{key2.charAt(0).toUpperCase() + key2.slice(1)}</TableCell>
                            <TableCell>{"$" + data.revenues[key1][key2]["amount"]}</TableCell>
                            <TableCell>{data.revenues[key1][key2]["note"]}</TableCell>
                          </TableRow>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
                <TableRow>
                  <TableCell group="negative" colspan={3}>Expenses</TableCell>
                </TableRow>
                {Object.keys(data.expenses).map(key1 => {
                  return (
                    <React.Fragment key={key1}>
                      <TableRow>
                        <TableCell group="negative" colspan={3} indent={1}>{key1.charAt(0).toUpperCase() + key1.slice(1)}</TableCell>
                      </TableRow>
                      {Object.keys(data.expenses[key1]).map(key2 => {
                        return (
                          <TableRow key={key2}>
                            <TableCell group="negative" indent={2}>{key2.charAt(0).toUpperCase() + key2.slice(1)}</TableCell>
                            <TableCell>{"($" + data.expenses[key1][key2]["amount"] + ")"}</TableCell>
                            <TableCell>{data.expenses[key1][key2]["note"]}</TableCell>
                          </TableRow>
                        )
                      })}
                    </React.Fragment>
                  )
                })}
                <TableRow>
                  <TableCell group="total">Total</TableCell>
                  <TableCell colspan={2}>
                    {totalAmounts()}
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            :
            <Loader /> 
        }
      </div>
    </div>
  )
}

Breakdown.displayName = "Breakdown"

export { Breakdown }