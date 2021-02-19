import * as React from "react";
import { Loader, Modal, Button, Notice, Table, TableBody, TableCell, TableHeader, TableRow } from "simp-ui";
import { RiPrinterFill } from "@meronex/icons/ri";
import "../styles/breakdown.sass";
import { AppData, AppDataContext, category, endCategory } from "./AppDataContext";
import { Input } from "../../../simp-ui/dist";

type BreakdownProps = {
  month?: number;
  year?: number;
  parentRef?: HTMLElement;
};

export const Breakdown: React.FC<BreakdownProps> = ({ month, year, parentRef }) => {
  const context = React.useContext(AppDataContext);
  const data = context?.data;
  const dataUpdateFunction = context?.updateAppData;
  const [notice, setNotice] = React.useState({ mounted: false, message: "" });
  const [changes, setChanges] = React.useState<{ [key: string]: string }>({});

  React.useEffect(() => {
    if (notice.mounted) {
      window.setTimeout(() => setNotice({ ...notice, mounted: false }), 4500);
    }
  }, [notice]);

  const setNested = (obj: any, path: string | string[], value: string | number) => {
    if (typeof path === "string") {
      path = path.split(".");
      path.reverse();
    }
    if (path.length > 1) {
      let key = path.pop() as string;
      if (obj[key]) {
        setNested(obj[key], path, value);
      } else {
        throw new Error("Property '" + key + "' not found on object '" + obj);
      }
    } else {
      obj[path[0]] = Number(value);
    }
  };

  const saveChanges = () => {
    let updateExpression = "SET";
    let expressionAttributeNames: { [key: string]: string } = {};
    let expressionAttributeValues: { [key: string]: string } = {};
    Object.keys(changes).forEach((key, i) => {
      let stop = false;
      let updateExpressionAddition = i === 0 ? " " : ", ";
      let attributeValue = "{"
      let closingTagsNeeded = 0
      const attributeNames = key.split(".");
      attributeNames.forEach((name, j) => {
        if (stop){
          attributeValue += '"' + name + '":'
          closingTagsNeeded += 1
        } else {
          updateExpressionAddition += (j === 0 ? "" : ".") + "#" + j + name.replace(" ", "")
          expressionAttributeNames["#" + j + name.replace(" ", "")] = name;
          if (attributeNames[j - 1] === "timeframes"){
            if (!data?.["Totals"].timeframes[name]){
              stop = true
            }
          } else if (attributeNames[j - 2] === "timeframes"){
            if (!data?.["Totals"].timeframes[attributeNames[j - 1]][name]){
              stop = true
            }
          }
        }
      });
      attributeValue += changes[key]
      console.log(closingTagsNeeded)
      if (closingTagsNeeded > 0){
        attributeValue += attributeNames.pop() === "budgeted" ? ', "actual": 0' : ', "budgeted": 0'
      }
      while(closingTagsNeeded > 0){
        attributeValue += "}"
        closingTagsNeeded -= 1
      }
      updateExpressionAddition += " = " + ":" + i;
      updateExpression += updateExpressionAddition
      expressionAttributeValues[":" + i] = JSON.parse(attributeValue)
    });
    console.log("ue", updateExpression)
    console.log("ean", expressionAttributeNames)
    console.log("eav", expressionAttributeValues)
    fetch("https://orees7y5k3.execute-api.us-east-1.amazonaws.com/default/test", {
      method: "POST",
      body: JSON.stringify({
        action: "update",
        payload: {
          Key: { username: "jordanjlatimer@gmail.com" },
          TableName: "chipmunk",
          UpdateExpression: updateExpression,
          ExpressionAttributeNames: expressionAttributeNames,
          ExpressionAttributeValues: expressionAttributeValues,
        },
      }),
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json["result"] === "success") {
          let newData = data;
          Object.keys(changes).forEach(key => {
            setNested(data, key, changes[key]);
          });
          dataUpdateFunction && dataUpdateFunction({ ...newData! });
          setNotice({ mounted: true, message: "Changes saved successfully." });
          setChanges({})
        } else {
          setNotice({ mounted: true, message: "There was an error saving your changes." });
        }
      });
  };

  const generateTableBody = (
    subData: AppData["data"] | category | endCategory,
    indent: number,
    path: string,
    group?: string
  ) => {
    if (subData?.timeframes) {
      if (year && month) {
        path = path + "timeframes." + year + "." + month + ".";
        return ["budgeted", "actual"].map(category => (
          <TableCell padded={false}>
            <Input
              prefix="$"
              stretchy
              blurFunc={() => changes[path + category] === "" && setChanges({ ...changes, [path + category]: "0" })}
              margined={false}
              bordered={false}
              valueValidation={value => {
                return isNaN(Number(value))
                  ? { message: "Value must be a valid number.", invalid: true }
                  : { message: "", invalid: false };
              }}
              changeHighlight={
                changes.hasOwnProperty(path + category) &&
                changes[path + category] !==
                  (subData["timeframes"][year][month]?.[category as "budgeted" | "actual"].toString() || "0")
              }
              onChange={value => setChanges({ ...changes, [path + category]: value })}
              value={
                changes.hasOwnProperty(path + category)
                  ? changes[path + category]
                  : subData["timeframes"][year][month]?.[category as "budgeted" | "actual"].toString() || "0"
              }
            />
          </TableCell>
        ));
      }
    } else {
      if (subData) {
        return Object.keys(subData)
          .filter(key => key !== "username")
          .map(key => {
            if (key === "Totals") {
              if (year && month) {
                return (
                  <TableRow group="total">
                    <TableCell group="total">Totals</TableCell>
                    <TableCell>
                      {(subData as AppData["data"])?.[key]["timeframes"][year][month]?.["budgeted"].toString()}
                    </TableCell>
                    <TableCell>
                      {(subData as AppData["data"])?.[key]["timeframes"][year][month]?.["actual"].toString()}
                    </TableCell>
                  </TableRow>
                );
              }
            }
            group = key === "Incomes" ? "positive" : key === "Expenses" ? "negative" : group;
            const endCategory = (subData as category)[key]["timeframes"];
            return (
              <React.Fragment>
                <TableRow>
                  <TableCell
                    group={group as "positive" | "negative" | "total"}
                    indent={indent}
                    colspan={endCategory ? 1 : 3}
                  >
                    {key}
                  </TableCell>
                  {endCategory && generateTableBody((subData as category)[key], 0, path + key + ".", group)}
                </TableRow>
                {!endCategory && generateTableBody((subData as category)[key], indent + 1, path + key + ".", group)}
              </React.Fragment>
            );
          });
      }
    }
  };

  return (
    <div className="budget-breakdown">
      {notice.mounted ? <Notice text={notice.message} parent={parentRef} /> : null}
      <div className="budget-breakdown-header">
        {"Breakdown - " +
          new Date(year || 0, month || 0).toLocaleDateString("default", { month: "short" }) +
          ", " +
          year}
      </div>
      <div>Here you can edit the month's budget. Click on a cell to change its value.</div>
      <div className="budget-breakdown-actionbar">
        <Button color="green" text="Save Changes" disabled={Object.keys(changes).length < 1} onClick={saveChanges} />
        <Button color="blue" text="Print" icon={<RiPrinterFill />} floatRight />
      </div>
      <div className="budget-breakdown-table">
        {data ? (
          <Table>
            <TableHeader>
              <TableCell header>Category / Subcategory</TableCell>
              <TableCell header>Budgeted</TableCell>
              <TableCell header>Actual</TableCell>
            </TableHeader>
            <TableBody>{generateTableBody(data, 0, "")}</TableBody>
          </Table>
        ) : (
          <Loader />
        )}
      </div>
    </div>
  );
};
