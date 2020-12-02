import * as React from "react";
import "./menu-item.sass";

type MenuItemProps = {
  children?: React.ReactNode;
  onClick?: () => void;
};
const MenuItem: React.FC<MenuItemProps> = ({ children, onClick }) => {
  return (
    <div className="menu-item" onClick={onClick}>
      {children}
    </div>
  );
};

MenuItem.displayName = "MenuItem";

export { MenuItem };
