import * as React from "react";
import { Overview } from "./Overview";
import { Breakdown } from "./Breakdown";
import "../styles/budget.sass";
import { Button } from "simp-ui";
import { RiArrowLeftFill } from "@meronex/icons/ri";

export const Budget: React.FC<{}> = () => {
  const [subMod, setSubMod] = React.useState<{
    name: string;
    month: number | undefined;
    year: number | undefined;
  }>({ name: "overview", month: undefined, year: undefined });

  return (
    <div className="budget">
      {subMod.name === "overview" && (
        <Overview
          headerAction={(value: { month: number; year: number }) => setSubMod({ ...value, name: "breakdown" })}
        />
      )}
      {subMod.name === "breakdown" && (
        <>
          <Button icon={<RiArrowLeftFill />} text="Back" onClick={() => setSubMod({ ...subMod, name: "overview" })} />
          <Breakdown month={subMod.month || 1} year={subMod.year || 2020} />
        </>
      )}
    </div>
  );
};
