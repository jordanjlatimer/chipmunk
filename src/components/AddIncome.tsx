import * as React from "react";

import { Button, Container, Divider, Dropdown, Input, Loader, TextArea } from "simp-ui";

type AddIncomeProps = {
  noticeCallback: (value: string) => void;
  modalCallback: () => void;
};

export const AddIncome: React.FC<AddIncomeProps> = ({ noticeCallback, modalCallback }) => {
  return (
    <>
      <Container header="Add an Income">
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
              noticeCallback("Income successfully added.");
              modalCallback();
            }}
          />
          <Button text="Cancel" color="red" onClick={modalCallback} />
        </Container>
      </Container>
    </>
  );
};
