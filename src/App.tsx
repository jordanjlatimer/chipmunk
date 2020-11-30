import * as React from "react";
import { Menu } from "./Components/Menu/Menu";
import { MenuItem } from "./Components/Menu/MenuItem/MenuItem";
import { RiCalendarTodoFill, RiHome4Line } from "@meronex/icons/ri"
import { Module } from "./Components/Module/Module";
import { Budget } from "./Components/Modules/Budget/Budget";

const App: React.FC<any> = (props: any) => {
  const [curMod, setCurMod] = React.useState("home")

  type modules = {
    [key: string]: {header: string, component: React.ReactNode}
  }

  const modules: modules = {
    budget: {
      header: "Budget",
      component: <Budget/>
    },
    home: {
      header: "Home",
      component: "Home Stuff"
    }
  }

  return (
    <>
      <Menu>
        <MenuItem onClick={() => setCurMod("home")}>
          <RiHome4Line/>
          Home
        </MenuItem>
        <MenuItem onClick={() => setCurMod("budget")}>
          <RiCalendarTodoFill/>
          Budget
        </MenuItem>
      </Menu>
      <Module header={modules[curMod].header}>
        {modules[curMod].component}
      </Module>
    </>
  );
};

App.displayName = "App";

export { App };
