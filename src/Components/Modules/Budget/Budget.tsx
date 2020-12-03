import * as React from "react";
import { LineGraph, Loader } from "simp-ui";
import { Table } from "./Table/Table";
import "./budget.sass";
import { ModuleHeader } from "../../BaseComps/Headers/ModuleHeader/ModuleHeader";

type dataFormat = {
  month: string;
  expenses: {
    [key: string]: number
   };
   revenues: {
    [key: string]: number
   };
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
    <div className="budget">
      <ModuleHeader text="Budget" breadcrumbs={[{text: "Jimmy"}]} action={() => console.log("clicked")}/>
      <div className="budget-overview">
        <div className="budget-overview-header">Monthly Expenses and Revenues</div>
        Click on a month to view a detailed breakdown.
        <div className="budget-overview-table">
          {data.length < 1 ? <Loader /> : <Table data={data}/>}
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
  );
};

Budget.displayName = "Budget";

export { Budget };
