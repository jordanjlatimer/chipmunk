import * as React from "react";
import { Loader, Modal, Button, Notice, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import { RiPrinterFill } from "@meronex/icons/ri";
import "../styles/breakdown.sass";
import { AddIncome } from "./AddIncome";
import { AddExpense } from "./AddExpense";
import { AppDataContext } from "./AppDataContext";

type BreakdownProps = {
  month?: number;
  year?: number;
};

type modalProps = {
  open: boolean;
  contents: React.ReactNode | undefined;
};

export const Breakdown: React.FC<BreakdownProps> = ({ month, year }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [modal, setModal] = React.useState<modalProps>({ open: false, contents: undefined });
  const [notice, setNotice] = React.useState({ mounted: false, message: "" });

  const currentTimeframe = data?.timeframes?.[year!]?.[month!];

  React.useEffect(() => {
    if (notice.mounted) {
      window.setTimeout(() => setNotice({ ...notice, mounted: false }), 4500);
    }
  }, [notice]);

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
    <div className="budget-breakdown">
      {notice.mounted ? <Notice text={notice.message} /> : null}
      <div className="budget-breakdown-header">
        {"Breakdown - " +
          new Date(year || 0, month || 0).toLocaleDateString("default", { month: "short" }) +
          ", " +
          year +
          " Budget"}
      </div>
      <div>Here you can edit the month's budget.</div>
      <div className="budget-breakdown-actionbar">
        <Button
          marginRight
          color="green"
          text="Add an Income"
          onClick={() => setModal({ open: true, contents: "add-income" })}
        />
        <Button color="red" text="Add an Expense" onClick={() => setModal({ open: true, contents: "add-expense" })} />
        <Button color="blue" text="Print" icon={<RiPrinterFill />} floatRight />
      </div>
      <div className="budget-breakdown-table">
        {data ? (
          <Table>
            <TableHeader>
              <TableCell header>Category</TableCell>
              <TableCell header>Budgeted</TableCell>
              <TableCell header>Notes (If Any)</TableCell>
              <TableCell header>Actual</TableCell>
              <TableCell header>Notes (If Any)</TableCell>
            </TableHeader>
            <TableBody>
              {/*For each category in ["expenses", "incomes"], add a group of rows starting with one labeling the category*/}
              {["incomes", "expenses"].map(category => {
                const group = category === "incomes" ? "positive" : "negative";
                return (
                  <React.Fragment key={category}>
                    <TableRow key={category}>
                      <TableCell group={group} colspan={5}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TableCell>
                    </TableRow>
                    {/*For each subcategory within the category, add a row with its amounts and notes, or 2nd level subcategories*/}
                    {Object.keys(data.categories[category as "incomes" | "expenses"]).map(subcategory => {
                      const hasSubs = data?.categories?.[category as "incomes" | "expenses"]?.[subcategory];
                      return (
                        <React.Fragment key={subcategory}>
                          <TableRow key={subcategory}>
                            <TableCell group={group} indent={1} colspan={hasSubs ? 5 : 1}>
                              {subcategory}
                            </TableCell>
                            {!hasSubs ? (
                              <>
                                <TableCell>
                                  {formatAmounts(
                                    currentTimeframe?.budgeted?.[category as "incomes" | "expenses"]?.[subcategory]?.[
                                      "amount"
                                    ],
                                    false
                                  )}
                                </TableCell>
                                <TableCell>
                                  {
                                    currentTimeframe?.budgeted?.[category as "incomes" | "expenses"]?.[subcategory]?.[
                                      "note"
                                    ]
                                  }
                                </TableCell>
                                <TableCell>
                                  {formatAmounts(
                                    currentTimeframe?.actual?.[category as "incomes" | "expenses"]?.[subcategory]?.[
                                      "amount"
                                    ],
                                    false
                                  )}
                                </TableCell>
                                <TableCell>
                                  {
                                    currentTimeframe?.actual?.[category as "incomes" | "expenses"]?.[subcategory]?.[
                                      "note"
                                    ]
                                  }
                                </TableCell>
                              </>
                            ) : null}
                          </TableRow>
                          {/*For each 2nd level subcategory, add a row with its amounts and notes*/}
                          {hasSubs
                            ? Object.keys(data.categories[category as "incomes" | "expenses"][subcategory]!).map(
                                subcategory2 => {
                                  return (
                                    <TableRow key={subcategory2}>
                                      <TableCell group={group} indent={2}>
                                        {subcategory2}
                                      </TableCell>
                                      <TableCell>
                                        {formatAmounts(
                                          currentTimeframe?.budgeted?.[category as "incomes" | "expenses"]?.[
                                            subcategory
                                          ]?.[subcategory2]?.amount,
                                          false
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {
                                          currentTimeframe?.budgeted?.[category as "incomes" | "expenses"]?.[
                                            subcategory
                                          ]?.[subcategory2]?.note
                                        }
                                      </TableCell>
                                      <TableCell>
                                        {formatAmounts(
                                          currentTimeframe?.actual?.[category as "incomes" | "expenses"]?.[
                                            subcategory
                                          ]?.[subcategory2]?.amount,
                                          false
                                        )}
                                      </TableCell>
                                      <TableCell>
                                        {
                                          currentTimeframe?.actual?.[category as "incomes" | "expenses"]?.[
                                            subcategory
                                          ]?.[subcategory2]?.note
                                        }
                                      </TableCell>
                                    </TableRow>
                                  );
                                }
                              )
                            : null}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              <TableRow bold>
                <TableCell group="total">Total</TableCell>
                <TableCell colspan={2}>{formatAmounts(currentTimeframe?.budgeted?.amount, true)}</TableCell>
                <TableCell colspan={2}>{formatAmounts(currentTimeframe?.actual?.amount, true)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </div>
      <Modal open={modal.open}>
        {modal.contents === "add-income" && (
          <AddIncome
            noticeCallback={(value: string) => setNotice({ mounted: true, message: value })}
            modalCallback={() => setModal({ ...modal, open: false })}
          />
        )}
        {modal.contents === "add-expense" && (
          <AddExpense
            noticeCallback={(value: string) => setNotice({ mounted: true, message: value })}
            modalCallback={() => setModal({ ...modal, open: false })}
          />
        )}
      </Modal>
    </div>
  );
};
