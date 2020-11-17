import * as React from "react";
import { Menu } from "./Components/Menu/Menu";
import { MenuItem } from "./Components/Menu/MenuItem/MenuItem";
import { RiCalendarTodoFill, RiHome4Line } from "@meronex/icons/ri"
import { Module } from "./Components/Module/Module";
import { Budgets } from "./Components/Modules/Budgets/Budgets";

const App: React.FC<any> = (props: any) => {
  const [curMod, setCurMod] = React.useState("home")

  return (
    <>
      <Menu>
        <MenuItem>
          <RiHome4Line/>
          Home
        </MenuItem>
        <MenuItem>
          <RiCalendarTodoFill/>
          Budgets
        </MenuItem>
      </Menu>
      <Module header="Budgets">
        <Budgets/>
      </Module>
    </>
  );
};

App.displayName = "App";

export { App };
