import * as React from "react";
import { Button, Container, Divider, Dropdown, Input, TextArea } from "simp-ui";

type AddExpenseProps = {
  noticeCallback: (value: string) => void;
  modalCallback: () => void;
};

export const AddExpense: React.FC<AddExpenseProps> = ({ noticeCallback, modalCallback }) => {
  return (
    <Container header="Add an Expense">
      <Container flex>
        <Dropdown
          label="Category"
          options={[
            { label: "Wages", value: "wages" },
            { label: "Gifts", value: "gifts" },
            { label: "Dividends", value: "dividends" },
          ]}
        />
        <Dropdown
          label="Sub-Category"
          options={[
            { label: "Wages", value: "wages" },
            { label: "Gifts", value: "gifts" },
            { label: "Dividends", value: "dividends" },
          ]}
        />
      </Container>
      <Input label="Amount" prefix="$" />
      <TextArea label="Note (optional)" width="long" />
      <Divider margin="large" />
      <Container flex>
        <Button
          text="Add"
          marginRight
          onClick={() => {
            noticeCallback("Expense successfully added.");
            modalCallback();
          }}
        />
        <Button text="Cancel" color="red" onClick={modalCallback} />
      </Container>
    </Container>
  );
};
