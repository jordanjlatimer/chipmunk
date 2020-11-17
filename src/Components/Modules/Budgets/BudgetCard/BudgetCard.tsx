import * as React from "react"
import "./budget-card.sass"

type BudgetCardProps = {
  data: {month: string, expenses: {category: string, amount: number}[], revenues: {category: string, amount: number}[]}
}
const BudgetCard: React.FC<BudgetCardProps> = ({data}) => {
  return(
    <div className="budget-card">
      <div className="budget-card-header">{data.month}</div>
      <div className="budget-card-section positive">
        <div className="budget-card-section-header">Revenues</div>
        {data.revenues.map(revenue => {
          return (
            <div className="budget-card-item">
              <div className="budget-card-item-name">{revenue.category}</div>
              <div className="budget-card-item-amount">${revenue.amount}</div>
            </div>
          )
        })}
      </div>
      <div className="budget-card-section negative">
        <div className="budget-card-section-header">Expenses</div>
        {data.expenses.map(expense => {
          return (
            <div className="budget-card-item">
              <div className="budget-card-item-name">{expense.category}</div>
              <div className="budget-card-item-amount">${expense.amount}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

BudgetCard.displayName = "BudgetCard";

export { BudgetCard }