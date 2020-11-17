import * as React from "react"
import { BudgetCard } from "./BudgetCard/BudgetCard"
import "./budgets.sass"
import data from "./mockData.json"

const Budgets: React.FC<{}> = () => {
  return(
    <div className="budget-cards">
      <div className="budget-cards-header">2020</div>
      <div className="budget-cards-items">
        {data.map(month => <BudgetCard data={month}/>)}
      </div>
    </div>
  )
}

Budgets.displayName = "Budgets";

export { Budgets }