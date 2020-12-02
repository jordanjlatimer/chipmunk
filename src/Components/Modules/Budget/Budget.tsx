import * as React from "react";
import { BudgetCard } from "./BudgetCard/BudgetCard";
import "./budget.sass";
import { LineGraph, Loader } from "simp-ui";

type dataFormat = {
  month: string;
  expenses: {
    category: string;
    amount: number | null;
  }[];
  revenues: {
    category: string;
    amount: number | null;
  }[];
}[];

const Budget: React.FC<{}> = () => {
  const [data, setData] = React.useState<dataFormat>([]);

  React.useEffect(() => {
    fetch("https://my.api.mockaroo.com/chipmunk-monthly-expenses-and-revenues.json?key=b1b7fe80")
      .then(response => response.json())
      .then(json => {
        setData(json);
      });
  }, []);

  return (
    <>
      <div className="budget-cards">
        <div className="budget-cards-header">Monthly Expenses and Revenues</div>
        <div className="budget-cards-items">
          {data.length < 1 ? <Loader /> : data.map(month => <BudgetCard data={month} />)}
        </div>
      </div>
      <div className="budget-graph">
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
                  return { x: month.month, y: month.revenues.reduce((a, b) => a + (b.amount ? b.amount : 0), 0) };
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
                  return { x: month.month, y: month.expenses.reduce((a, b) => a + (b.amount ? b.amount : 0), 0) };
                }),
              },
            ]}
            yPrefix="$"
            legend
          />
        )}
      </div>
    </>
  );
};

Budget.displayName = "Budget";

export { Budget };
