import * as React from "react";
import { Overview } from "./Overview";
import { Breakdown } from "./Breakdown";
import "../styles/budget.sass";
import { Button } from "simp-ui";
import { RiArrowLeftFill } from "@meronex/icons/ri";

export const Budget: React.FC<{}> = () => {
  const [subMod, setSubMod] = React.useState<{
    name: string;
    month?: number;
    year?: number;
  }>({ name: "overview", month: undefined, year: undefined });
  const ref = React.useRef<HTMLDivElement>(null);

  return (
    <div className="budget" ref={ref}>
      {subMod.name === "overview" && (
        <Overview
          headerAction={(value: { month: number; year: number }) => setSubMod({ ...value, name: "breakdown" })}
        />
      )}
      {subMod.name === "breakdown" && subMod.year && subMod.month && (
        <>
          <Button icon={<RiArrowLeftFill />} text="Back" onClick={() => setSubMod({ ...subMod, name: "overview" })} />
          <Breakdown month={subMod.month} year={subMod.year} parentRef={ref.current || undefined} />
        </>
      )}
    </div>
  );
};
