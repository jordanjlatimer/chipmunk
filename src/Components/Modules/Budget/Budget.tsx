import * as React from "react"
import { BudgetCard } from "./BudgetCard/BudgetCard"
import "./budget.sass"
import data from "./mockData.json"

const Budget: React.FC<{}> = () => {
  return(
    <>
      <div className="budget-cards">
        <div className="budget-cards-header">2020 - Monthly</div>
        <div className="budget-cards-items">
          {data.map(month => <BudgetCard data={month}/>)}
        </div>
      </div>
    </>
  )
}

Budget.displayName = "Budget";

export { Budget }