import * as React from "react";
import { ModuleHeader } from "../../Reusables/ModuleHeader";
import { Overview } from "./Submodules/Overview";
import { Breakdown } from "./Submodules/Breakdown";
import "../../../styles/budget.sass";
import { AddRevenue } from "./Submodules/AddRevenue";

type dataFormat = {
  month: string;
  expenses: {
    [key: string]: number;
  };
  revenues: {
    [key: string]: number;
  };
}[];

const Budget: React.FC<{}> = () => {
  const [subMod, setSubMod] = React.useState<{
    name: string;
    month: string;
    year: number | undefined;
  }>({ name: "add-revenue", month: "Dec", year: 2020 });

  return (
    <div className="budget">
      <ModuleHeader
        text="Budget"
        action={
          subMod.name === "overview" ? undefined : () => setSubMod({ name: "overview", month: "", year: undefined })
        }
        breadcrumbs={
          subMod.name === "breakdown" ? 
          [{ text: subMod.month + ", " + subMod.year }] 
          : 
          subMod.name === "add-expense" ?
          [{text: subMod.month + ", " + subMod.year, action: () => setSubMod({...subMod, name: "breakdown"})}, {text: "Budget an Expense"}]
          :
          subMod.name === "add-revenue" ?
          [{text: subMod.month + ", " + subMod.year, action: () => setSubMod({...subMod, name: "breakdown"})}, {text: "Budget a Revenue"}]
          :
          undefined
        }
      />
      {subMod.name === "overview" && (
        <Overview
          headerAction={(value: { month: string; year: number }) => setSubMod({ ...value, name: "breakdown" })}
        />
      )}
      {subMod.name === "breakdown" && <Breakdown month={subMod.month} year={2020} buttonAction={(value: string) => setSubMod({...subMod, name: value})}/>}
      {subMod.name === "add-revenue" && <AddRevenue/>}
      {subMod.name === "add-expense" && "Budget an Expense"}
    </div>
  );
};

Budget.displayName = "Budget";

export { Budget };
