import * as React from "react";
import { Menu } from "./Menu";
import { Budget } from "./Budget";
import "../styles/app.sass";

export const App: React.FC<any> = (props: any) => {
  const [curMod, setCurMod] = React.useState("budget");

  type modules = {
    [key: string]: React.ReactNode;
  };

  const modules: modules = {
    budget: <Budget />,
    home: "Home",
    settings: "Settings",
  };

  return (
    <>
      <Menu itemAction={setCurMod} />
      <div className="module-container">{modules[curMod]}</div>
    </>
  );
};
