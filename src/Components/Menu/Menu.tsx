import * as React from "react";
import { MenuItem } from "./MenuItem";
import { RiCalendarTodoFill, RiHome4Fill, RiSettings5Fill } from "@meronex/icons/ri";
import "../../styles/menu.sass";

type MenuProps = {
  itemAction: (name: string) => void;
};

const Menu: React.FC<MenuProps> = ({ itemAction }) => {
  return (
    <div className="menu">
      <MenuItem action={() => itemAction("home")} icon={<RiHome4Fill />} label="Home" />
      <MenuItem action={() => itemAction("budget")} icon={<RiCalendarTodoFill />} label="Budget" />
      <MenuItem action={() => itemAction("settings")} icon={<RiSettings5Fill />} label="Settings" />
    </div>
  );
};

Menu.displayName = "Menu";

export { Menu };
