import * as React from "react";
import { Loader, Modal, Button } from "simp-ui";
import { Table } from "../../../../Reusables/Table/Table";
import { TableBody } from "../../../../Reusables/Table/TableBody";
import { TableCell } from "../../../../Reusables/Table/TableCell";
import { TableHeader } from "../../../../Reusables/Table/TableHeader";
import { TableRow } from "../../../../Reusables/Table/TableRow";
import "../../../../../styles/breakdown.sass";
import { RiPrinterFill } from "@meronex/icons/ri";
import { AddIncome } from "./AddIncome";
import { AddExpense } from "./AddExpense";

type dataFormat =
  | {
      expenses: {
        [key: string]: {
          [key: string]: {
            amount: number;
            note: string;
          };
        };
      };
      incomes: {
        [key: string]: {
          [key: string]: {
            amount: number;
            note: string;
          };
        };
      };
    }
  | undefined;

type BreakdownProps = {
  month: string;
  year: string | number;
  buttonAction?: (value: string) => void
  noticeCallback: (value: string) => void
};

const Breakdown: React.FC<BreakdownProps> = ({ month, year, buttonAction, noticeCallback }) => {
  const [data, setData] = React.useState<dataFormat>(undefined);
  const [modalProps, setModalProps] = React.useState({open: false, contents: ""})

  React.useEffect(() => {
    fetch("https://my.api.mockaroo.com/chipmunk-month-breakdown.json?key=b1b7fe80")
      .then(response => response.json())
      .then(json => {
        setData(undefined);
      });
  }, []);

  const totalAmounts = () => {
    if (data) {
      let expenses = 0;
      for (const key in data.expenses) {
        for (const key2 in data.expenses[key]) {
          expenses += data.expenses[key][key2]["amount"];
        }
      }
      let incomes = 0;
      for (const key in data.incomes) {
        for (const key2 in data.incomes[key]) {
          incomes += data.incomes[key][key2]["amount"];
        }
      }
      return incomes > expenses ? "$" + (incomes - expenses) : "($" + Math.abs(incomes - expenses) + ")";
    }
  };

  return (
    <div className="budget-breakdown">
      <div className="budget-breakdown-header">{"Breakdown - " + month + ", " + year + " Budget"}</div>
      <div>Here you can edit the month's budget.</div>
      <div className="budget-breakdown-actionbar">
        <Button marginRight color="green" text="Add an Income" onClick={() => setModalProps({open: true, contents: "add-income"})}/>
        <Button color="red" text="Add an Expense" onClick={() => setModalProps({open: true, contents: "add-expense"})}/>
        <Button color="blue" text="Print" icon={<RiPrinterFill/>} floatRight/>
      </div>
      <div className="budget-breakdown-table">
        {data ? (
          <Table>
            <TableHeader>
              <TableCell header>Category</TableCell>
              <TableCell header>Amount</TableCell>
              <TableCell header>Notes (If Any)</TableCell>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell group="positive" colspan={3}>
                  Incomes
                </TableCell>
              </TableRow>
              {Object.keys(data.incomes).map(key1 => {
                return (
                  <React.Fragment key={key1}>
                    <TableRow>
                      <TableCell group="positive" colspan={3} indent={1}>
                        {key1.charAt(0).toUpperCase() + key1.slice(1)}
                      </TableCell>
                    </TableRow>
                    {Object.keys(data.incomes[key1]).map(key2 => {
                      return (
                        <TableRow key={key2}>
                          <TableCell group="positive" indent={2}>
                            {key2.charAt(0).toUpperCase() + key2.slice(1)}
                          </TableCell>
                          <TableCell>{"$" + data.incomes[key1][key2]["amount"]}</TableCell>
                          <TableCell>{data.incomes[key1][key2]["note"]}</TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              <TableRow>
                <TableCell group="negative" colspan={3}>
                  Expenses
                </TableCell>
              </TableRow>
              {Object.keys(data.expenses).map(key1 => {
                return (
                  <React.Fragment key={key1}>
                    <TableRow>
                      <TableCell group="negative" colspan={3} indent={1}>
                        {key1.charAt(0).toUpperCase() + key1.slice(1)}
                      </TableCell>
                    </TableRow>
                    {Object.keys(data.expenses[key1]).map(key2 => {
                      return (
                        <TableRow key={key2}>
                          <TableCell group="negative" indent={2}>
                            {key2.charAt(0).toUpperCase() + key2.slice(1)}
                          </TableCell>
                          <TableCell>{"($" + data.expenses[key1][key2]["amount"] + ")"}</TableCell>
                          <TableCell>{data.expenses[key1][key2]["note"]}</TableCell>
                        </TableRow>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              <TableRow>
                <TableCell group="total">Total</TableCell>
                <TableCell colspan={2}>{totalAmounts()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </div>
      <Modal open={modalProps.open} callback={() => setModalProps({...modalProps, open: false})}>
        {modalProps.contents === "add-income" && <AddIncome noticeCallback={noticeCallback} modalCallback={() => setModalProps({...modalProps, open: false})}/>}
        {modalProps.contents === "add-expense" && <AddExpense/>}
      </Modal>
    </div>
  );
};

Breakdown.displayName = "Breakdown";

export { Breakdown };
