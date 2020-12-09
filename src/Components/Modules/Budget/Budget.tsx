import * as React from "react";
import { ModuleHeader } from "../../Reusables/ModuleHeader";
import { Overview } from "./Submodules/Overview";
import { Breakdown } from "./Submodules/Breakdown/Breakdown";
import "../../../styles/budget.sass";
import { Notice } from "simp-ui";

type dataFormat = {
  month: string;
  expenses: {
    [key: string]: number;
  };
  incomes: {
    [key: string]: number;
  };
}[];

const Budget: React.FC<{}> = () => {
  const [subMod, setSubMod] = React.useState<{
    name: string;
    month: string;
    year: number | undefined;
  }>({ name: "breakdown", month: "Dec", year: 2020 });
  const [notice, setNotice] = React.useState({mount: false, message: ""})

  React.useEffect(() => {
    if (notice.mount){
      window.setTimeout(() => setNotice({...notice, mount: false}), 4500)
    }
  }, [notice])

  return (
    <div className="budget">
      {
        notice.mount ?
          <Notice text={notice.message}/>
          :
          null
      }
      <ModuleHeader
        text="Budget"
        action={
          subMod.name === "overview" ? undefined : () => setSubMod({ name: "overview", month: "", year: undefined })
        }
        breadcrumbs={
          subMod.name === "breakdown" ? 
          [{ text: subMod.month + ", " + subMod.year }] 
          :
          undefined
        }
      />
      {subMod.name === "overview" && (
        <Overview
          headerAction={(value: { month: string; year: number }) => setSubMod({ ...value, name: "breakdown" })}
        />
      )}
      {
        subMod.name === "breakdown" && 
        <Breakdown 
          noticeCallback={(value: string) => setNotice({mount: true, message: value})}
          month={subMod.month} 
          year={2020}
        />
      }
    </div>
  );
};

Budget.displayName = "Budget";

export { Budget };
