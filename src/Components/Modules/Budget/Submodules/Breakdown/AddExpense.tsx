import * as React from "react"
import { Button, Container, Divider, Dropdown, Input, Modal, TextArea } from "simp-ui"

const AddExpense: React.FC<{}> = () => {
  return (
    <Container header="Add an Expense">
      <Container flex>
        <Dropdown label="Category" options={[{label: "Wages", value: "wages"}, {label: "Gifts", value: "gifts"}, {label: "Dividends", value: "dividends"}]}/>
        <Dropdown label="Sub-Category" options={[{label: "Wages", value: "wages"}, {label: "Gifts", value: "gifts"}, {label: "Dividends", value: "dividends"}]}/>
      </Container>
      <Input label="Amount" prefix="$"/>
      <TextArea label="Note (optional)" width="long"/>
      <Divider margin="large"/>
      <Container flex>
        <Button text="Add" marginRight/>
        <Button text="Cancel" color="red"/>
      </Container>
    </Container>
  )
}

AddExpense.displayName = "AddExpense"

export { AddExpense }