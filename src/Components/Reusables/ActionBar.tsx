import { RiPrinterFill } from "@meronex/icons/ri"
import * as React from "react"
import "../../styles/action-bar.sass"

const ActionBar: React.FC<{}> = () => {
  return (
    <div className="action-bar">
      <div className="action-bar-button">
        Budget an Income
      </div>
      <div className="action-bar-button negative">
        Budget an Expense
      </div>
      <div className="action-bar-button print">
        <RiPrinterFill/>
        Print
      </div>
    </div>
  )
}

ActionBar.displayName = "ActionBar"

export { ActionBar }