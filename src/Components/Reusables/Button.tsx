import * as React from "react"
import "../../styles/button.sass"

type ButtonProps = {
  text: string
  color?: "green" | "red" | "blue"
  icon?: React.ReactNode
  marginRight?: boolean
  floatRight?: boolean
  onClick?: () => void
}

const Button: React.FC<ButtonProps> = ({text, color = "green", icon, marginRight, floatRight, onClick}) => {
  return(
    <div className={"button" + (color ? " " + color : "") + (marginRight ? " m-right" : "") + (floatRight ? " f-right" : "")} onClick={onClick}>
      {icon ? icon : null}
      {text}
    </div>
  )
}

Button.displayName = "Button"

export { Button }