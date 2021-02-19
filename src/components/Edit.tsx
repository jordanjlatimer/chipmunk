import * as React from "react";
import { Button, Container, Divider, Dropdown, Input, RadioInput, TextArea } from "simp-ui";
import { AppDataContext } from "./AppDataContext";

type EditProps = {
  month: number;
  year: number;
  noticeCallback: (value: string) => void;
  modalCallback: () => void;
};

export const Edit: React.FC<EditProps> = ({ month, year, noticeCallback, modalCallback }) => {
  const data = React.useContext(AppDataContext)?.data;
  const [form, setForm] = React.useState<{
    category?: "incomes" | "expenses";
    kind?: "actual" | "budgeted";
    subCategory?: { value: string; label: string };
    subCategory2?: { value: string; label: string };
    amount?: string;
    note?: string;
  }>({});

  const submitForm = () => {
    fetch("https://orees7y5k3.execute-api.us-east-1.amazonaws.com/default/test", {
      method: "POST",
      body: JSON.stringify({
        action: "update",
        payload: {
          Key: { username: "jordanjlatimer@gmail.com" },
          TableName: "chipmunk",
          UpdateExpression: "SET timeframes.#a.#b.#c.#d.#e.#f = :a",
          ExpressionAttributeNames: {
            "#a": year,
            "#b": month,
            "#c": form.kind,
            "#d": form.category,
            "#e": form.subCategory?.value,
            "#f": "amount",
          },
          ExpressionAttributeValues: {
            ":a": form.amount,
          },
        },
      }),
    })
      .then(response => response.json())
      .then(json => console.log(json));
    return true;
  };

  return (
    <Container header="Edit an amount">
      <Container flex>
        <RadioInput
          horizontal
          label="Kind"
          segmented
          options={[
            { label: "Actual", value: "actual" },
            { label: "Budgeted", value: "budgeted" },
          ]}
          onChange={(value: string) => setForm({ ...form, kind: value as "actual" | "budgeted" })}
        />
        <RadioInput
          horizontal
          label="Group"
          segmented
          options={[
            { label: "Income", value: "incomes" },
            { label: "Expense", value: "expenses" },
          ]}
          onChange={(value: string) =>
            setForm({
              ...form,
              category: value as "incomes" | "expenses",
              subCategory: undefined,
              subCategory2: undefined,
            })
          }
        />
      </Container>
      <Container flex>
        <Dropdown
          label="Category"
          disabled={!(form.category && data?.categories[form.category])}
          options={
            form.category &&
            data?.categories[form.category] &&
            Object.keys(data?.categories[form.category]).map(key => {
              return { label: key, value: key };
            })
          }
          value={form.subCategory && [form.subCategory]}
          onChange={(value: { label: string; value: string }) =>
            setForm({ ...form, subCategory: value, subCategory2: undefined })
          }
        />
        <Dropdown
          label="Sub-Category"
          disabled={
            !(
              form.category &&
              form.subCategory &&
              data?.categories[form.category] &&
              data?.categories[form.category][form.subCategory.value]
            )
          }
          options={
            (form.category &&
              form.subCategory &&
              data?.categories[form.category][form.subCategory.value] &&
              Object.keys(data.categories[form.category][form.subCategory.value]!).map(key => {
                return { label: key, value: key };
              })) ||
            undefined
          }
          value={form.subCategory2 && [form.subCategory2]}
          onChange={(value: { label: string; value: string }) => setForm({ ...form, subCategory2: value })}
        />
      </Container>
      <Container flex>
        <div>Current Amount: </div>
        <Input
          label="New Amount"
          prefix="$"
          changeValidation={(value: string) => !isNaN(value)}
          onChange={(value: string) => setForm({ ...form, amount: value })}
        />
      </Container>
      <Container flex>
        <TextArea label="New Note" width="long" onChange={(value: string) => setForm({ ...form, note: value })} />
      </Container>
      <Divider margin="large" />
      <Container flex>
        <Button
          text="Submit"
          marginRight
          onClick={() => {
            submitForm() && (noticeCallback("Value updated successfully."), modalCallback());
          }}
        />
        <Button text="Cancel" color="red" onClick={modalCallback} />
      </Container>
    </Container>
  );
};
