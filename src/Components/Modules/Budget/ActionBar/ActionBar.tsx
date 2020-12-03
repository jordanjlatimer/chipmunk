import * as React from "react"
import "./action-bar.sass"

const ActionBar: React.FC<{}> = () => {
  return (
    <div className="action-bar">
      <div className="action-bar-button">
        Budget an Income
      </div>
      <div className="action-bar-button">
        Budget an Expense
      </div>
    </div>
  )
}

ActionBar.displayName = "ActionBar"

export { ActionBar }