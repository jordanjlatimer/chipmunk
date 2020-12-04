import * as React from "react";
import "./table.sass";

type TableProps = {
  data: {
    month: string;
    expenses: {
     [key: string]: number
    };
    revenues: {
      [key: string]: number
     };
  }[]
}

const Table: React.FC<TableProps> = ({data}) => {

  return (
    <table className="budget-table">
      <thead>
        <tr>
          <th key="th">Category</th>
          {data.map(month => <th key={month.month}>{month.month}</th>)}
        </tr>
      </thead>
      <tbody>
        <tr>
          <td colSpan={13} className="revenue">Revenues</td>
        </tr>
        {Object.keys(data[0].revenues).map(revenueCategory => {
          return (
            <tr key={revenueCategory}>
              <td className="revenue-category">{revenueCategory.charAt(0).toUpperCase() + revenueCategory.slice(1)}</td>
              {data.map(month => {
                return <td>${month.revenues[revenueCategory]}</td>
              })}
            </tr>
          )
        })}
        <tr>
          <td colSpan={13} className="expense">Expenses</td>
        </tr>
        {Object.keys(data[0].expenses).map(expenseCategory => {
          return (
            <tr>
              <td className="expense-category">{expenseCategory.charAt(0).toUpperCase() + expenseCategory.slice(1)}</td>
              {data.map(month => {
                return <td>(${month.expenses[expenseCategory]})</td>
              })}
            </tr>
          )
        })}
        <tr>
          <td colSpan={13} className="total">Totals</td>
        </tr>
        <tr>
          <td className="total-category">Totals</td>
          {data.map(month => {
            const expenses = Object.keys(month.expenses).reduce((a, b) => a + month.expenses[b], 0)
            const revenues = Object.keys(month.revenues).reduce((a, b) => a + month.revenues[b], 0)
            return (
              <td>{expenses > revenues ? "(" : ""}${Math.abs(revenues - expenses)}{expenses > revenues ? ")" : ""}</td>
            )
          })}
        </tr>
      </tbody>
    </table>
  );
};

Table.displayName = "Table";

export { Table };
