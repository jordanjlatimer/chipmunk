import * as React from "react";
import { MenuItem } from "./MenuItem";
import "../styles/menu.sass";
import { ChipmunkIcon } from "./ChipmunkIcon";

type MenuProps = {
  itemAction: (name: string) => void;
};

export const Menu: React.FC<MenuProps> = ({ itemAction }) => {
  return (
    <div className="menu">
      <ChipmunkIcon />
      <MenuItem action={() => itemAction("home")} icon={""} label="Home" />
      <MenuItem action={() => itemAction("budget")} icon={""} label="Budget" />
      <MenuItem action={() => itemAction("settings")} icon={""} label="Settings" />
    </div>
  );
};
