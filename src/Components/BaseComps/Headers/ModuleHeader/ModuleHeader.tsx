import { RiArrowRightSFill } from "@meronex/icons/ri"
import * as React from "react"
import "./module-header.sass"

type ModuleHeaderProps = {
  text: string
  action?: () => void
  breadcrumbs?: {
    text: string,
    action?: () => void
  }[]
  borderBottom?: boolean
}

const ModuleHeader: React.FC<ModuleHeaderProps> = ({text, action, borderBottom = true, breadcrumbs }) => {
  return (
    <div className={"module-header" + (borderBottom ? " border-bottom" : "")}>
      <span 
        onClick={action ? () => action() : undefined}
        className={"module-header-main" + (action ? " clickable" : "")}
        key="text"
      >
        {text}
      </span>
      {breadcrumbs?.map(breadcrumb => {
        const action = breadcrumb.action
        return(
          <span 
            onClick={action ? () => action() : undefined}
            className={"module-header-breadcrumb" + (action ? " clickable" : "")}
            key={breadcrumb.text}
          >
            {<RiArrowRightSFill/>}
            {breadcrumb.text}
          </span>
        )
      })}
    </div>
  )
}

ModuleHeader.displayName = "ModuleHeader"

export { ModuleHeader }