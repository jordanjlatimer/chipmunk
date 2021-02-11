import * as React from "react";
import { Button, Container, Divider, Dropdown, Input, TextArea } from "simp-ui";
import { AppDataContext } from "./AppDataContext";

type AddExpenseProps = {
  noticeCallback: (value: string) => void;
  modalCallback: () => void;
};

export const AddExpense: React.FC<AddExpenseProps> = ({ noticeCallback, modalCallback }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [form, setForm] = React.useState<{ category?: string; subCategory?: string; amount?: string; note?: string }>(
    {}
  );

  const submitForm = () => {
    fetch("https://orees7y5k3.execute-api.us-east-1.amazonaws.com/default/test", {
      method: "POST",
      body: JSON.stringify({
        action: "get-all",
        payload: {
          Key: { username: "jordanjlatimer@gmail.com" },
          TableName: "chipmunk",
          UpdateExpression: "SET ",
        },
      }),
    })
      .then(response => response.json())
      .then(json => setData(json["Item"]));
  };

  return (
    <Container header="Add an Expense">
      <Container flex>
        <Dropdown
          label="Category"
          options={
            data?.categories.expenses
              ? Object.keys(data?.categories.expenses).map(key => {
                  return { label: key, value: key };
                })
              : undefined
          }
          onChange={(value: { label: string; value: string }) =>
            setForm({ ...form, category: value.value, subCategory: undefined })
          }
        />
        <Dropdown
          label="Sub-Category"
          disabled={
            form.category
              ? data?.categories.expenses
                ? data?.categories.expenses[form.category].length < 1
                : true
              : true
          }
          options={
            form.category
              ? data?.categories.expenses
                ? data?.categories.expenses[form.category].map(key => {
                    return { label: key, value: key };
                  })
                : undefined
              : undefined
          }
          onChange={(value: { label: string; value: string }) => setForm({ ...form, subCategory: value.value })}
        />
      </Container>
      <Input label="Amount" prefix="$" onChange={(value: string) => setForm({ ...form, amount: value })} />
      <TextArea width="long" onChange={(value: string) => setForm({ ...form, note: value })} />
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
