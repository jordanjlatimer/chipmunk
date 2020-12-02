import * as React from "react";
import "./menu.sass";

type MenuProps = {
  children?: React.ReactNode;
};
const Menu: React.FC<MenuProps> = ({ children }) => {
  return <div className="menu">{children}</div>;
};

Menu.displayName = "Menu";

export { Menu };
