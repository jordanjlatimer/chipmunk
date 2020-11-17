import * as React from "react"
import "./module.sass"

type ModuleProps = {
  children?: React.ReactNode
  header: string
}
const Module: React.FC<ModuleProps> = ({children, header}) => {
  return(
    <div className="module">
      <div className="module-header">{header}</div>
      {children}
    </div>
  )
}

Module.displayName = "Module";

export { Module }