import * as React from "react"
import { BudgetCard } from "./BudgetCard/BudgetCard"
import "./budget.sass"
import { LineGraph, Loader } from "simp-ui"

type dataFormat = {
  month: string
  expenses: {
    category: string
    amount: string
  }[]
  revenues: {
    category: string
    amount: string
  }[]
}

const Budget: React.FC<{}> = () => {
  const [data, setData] = React.useState(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    fetch("https://my.api.mockaroo.com/chipmunk-monthly-expenses-and-revenues.json?key=b1b7fe80")
    .then(response => response.json())
    .then(json => {
      setData(json)
      setLoading(false)
    })
  },[])

  return(
    <>
      <div className="budget-cards">
        <div className="budget-cards-header">2020 - Monthly</div>
        <div className="budget-cards-items">
          {
            loading ?
              <Loader/>
              : data.map(month => <BudgetCard data={month}/>)
          }
        </div>
      </div>
      <div className="budget-table">
        {
          loading ? 
            <Loader/>
            : <LineGraph
                lines={[
                  {
                    label: "Revenues",
                    options: {
                      lineColor: "green",
                      lineWidth: 2,
                      pointFill: "white",
                      pointRadius: 2
                    },
                    data: data.map(month => {
                      return {x: month.month, y: month.revenues.reduce((a, b) => a + b.amount, 0)}
                    })
                  },
                  {
                    label: "Expenses",
                    options: {
                      lineColor: "Red",
                      lineWidth: 2,
                      pointFill: "white",
                      pointRadius: 2
                    },
                    data: data.map(month => {
                      return {x: month.month, y: month.expenses.reduce((a, b) => a + b.amount, 0)}
                    })
                  }
                ]}
                yPrefix="$"
                title="Monthly Expenses and Revenues"
                legend
              />
        }
      </div>
    </>
  )
}

Budget.displayName = "Budget";

export { Budget }