import * as React from "react";
import { Loader, Modal, Button, Notice, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import { RiPrinterFill } from "@meronex/icons/ri";
import "../styles/breakdown.sass";
import { AddIncome } from "./AddIncome";
import { AddExpense } from "./AddExpense";
import { AppDataContext } from "./AppDataContext";

type BreakdownProps = {
  month: number;
  year: number;
  buttonAction?: (value: string) => void;
};

export const Breakdown: React.FC<BreakdownProps> = ({ month, year, buttonAction }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [modalProps, setModalProps] = React.useState({ open: false, contents: "" });
  const [notice, setNotice] = React.useState({ mounted: false, message: "" });

  const currentTimeframe = data?.timeframes.filter(
    timeframe => timeframe.year === year && timeframe.month === month
  )[0];

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
      {notice.mounted ? <Notice text={notice.message} position={{ left: "200px" }} /> : null}
      <div className="budget-breakdown-header">
        {"Breakdown - " +
          new Date(year, month).toLocaleDateString("default", { month: "short" }) +
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
          onClick={() => setModalProps({ open: true, contents: "add-income" })}
        />
        <Button
          color="red"
          text="Add an Expense"
          onClick={() => setModalProps({ open: true, contents: "add-expense" })}
        />
        <Button color="blue" text="Print" icon={<RiPrinterFill />} floatRight />
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
              {(Object.keys(data.categories) as ("expenses" | "incomes")[]).map(category => {
                const group = category === "incomes" ? "positive" : "negative";
                return (
                  <React.Fragment key={category}>
                    <TableRow key={category}>
                      <TableCell group={group} colspan={3}>
                        {category.charAt(0).toUpperCase() + category.slice(1)}
                      </TableCell>
                    </TableRow>
                    {Object.keys(data.categories[category]).map(key => {
                      const hasSubs = data.categories[category]?.[key].length > 0;
                      return (
                        <React.Fragment key={key}>
                          <TableRow key={key}>
                            <TableCell group={group} indent={1} colspan={hasSubs ? 3 : 1}>
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </TableCell>
                            {!hasSubs ? (
                              <>
                                <TableCell>
                                  {currentTimeframe
                                    ? formatAmounts(currentTimeframe.actual[category]?.[key]?.["amount"], false)
                                    : "$0"}
                                </TableCell>
                                <TableCell>
                                  {currentTimeframe && currentTimeframe.actual[category]?.[key]?.["note"]}
                                </TableCell>
                              </>
                            ) : null}
                          </TableRow>
                          {hasSubs
                            ? data.categories[category]?.[key].map(subcategory => {
                                return (
                                  <TableRow key={subcategory}>
                                    <TableCell group={group} indent={2}>
                                      {subcategory}
                                    </TableCell>
                                    <TableCell>
                                      {formatAmounts(
                                        currentTimeframe?.actual[category]?.[key]?.[subcategory]?.amount,
                                        false
                                      )}
                                    </TableCell>
                                    <TableCell>
                                      {currentTimeframe?.actual[category]?.[key]?.[subcategory]?.note}
                                    </TableCell>
                                  </TableRow>
                                );
                              })
                            : null}
                        </React.Fragment>
                      );
                    })}
                  </React.Fragment>
                );
              })}
              <TableRow bold>
                <TableCell group="total">Total</TableCell>
                <TableCell colspan={2}>{formatAmounts(currentTimeframe?.actual.amount, true)}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </div>
      <Modal position={{ left: "200px" }} open={modalProps.open}>
        {modalProps.contents === "add-income" && (
          <AddIncome
            noticeCallback={(value: string) => setNotice({ mounted: true, message: value })}
            modalCallback={() => setModalProps({ ...modalProps, open: false })}
          />
        )}
        {modalProps.contents === "add-expense" && (
          <AddExpense
            noticeCallback={(value: string) => setNotice({ mounted: true, message: value })}
            modalCallback={() => setModalProps({ ...modalProps, open: false })}
          />
        )}
      </Modal>
    </div>
  );
};
