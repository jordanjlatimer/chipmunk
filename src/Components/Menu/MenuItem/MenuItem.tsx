import * as React from "react"
import "./menu-item.sass"

type MenuItemProps = {
  children?: React.ReactNode
}
const MenuItem: React.FC<MenuItemProps> = ({children}) => {
  return(
    <div className="menu-item">
      {children}
    </div>
  )
}

MenuItem.displayName = "MenuItem";

export { MenuItem }