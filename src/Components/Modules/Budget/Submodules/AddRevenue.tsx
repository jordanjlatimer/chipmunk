import * as React from "react"
import { Dropdown, Input, TextArea } from "simp-ui"

const AddRevenue: React.FC<{}> = () => {
  return (
    <div className="budget-add-revenue">
      <Dropdown label="Category" options={[{label: "Wages", value: "wages"}, {label: "Gifts", value: "gifts"}, {label: "Dividends", value: "dividends"}]}/>
      <Dropdown label="Sub-Category" options={[{label: "Wages", value: "wages"}, {label: "Gifts", value: "gifts"}, {label: "Dividends", value: "dividends"}]}/>
      <Input label="Amount" placeholder="Enter a value..." valueValidation={(value) => {return {invalid: true, message: "You must do the following:"}}}/>
      <TextArea label="Note (optional)" width="long"/>
    </div>
  )
}

AddRevenue.displayName = "AddRevenue"

export { AddRevenue }