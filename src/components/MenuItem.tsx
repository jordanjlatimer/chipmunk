import * as React from "react";
import "../styles/menu-item.sass";

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  action: () => void;
};

export const MenuItem: React.FC<MenuItemProps> = ({ icon, label, action }) => (
  <div className="menu-item" onClick={action}>
    {icon}
    <div className="menu-item-label">{label}</div>
  </div>
);
