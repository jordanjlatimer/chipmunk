import * as React from "react"
import "../../../styles/table-cell.sass"

type TableCellProps = {
  group?: "positive" | "negative" | "total"
  indent?: 1 | 2
  colspan?: number
  header?: boolean,
  clickable?: boolean,
  onClick?: () => void
}

const TableCell: React.FC<TableCellProps> = ({group, indent, colspan, header, clickable, onClick, children}) => {
  return(
    <td 
      className={"table-cell" + 
        (group ? " " + group : "") + 
        (indent ? " indent-" + indent : "") +
        (header ? "-header" : "") +
        (clickable ? " clickable" : "")
      } 
      colSpan={colspan}
      onClick={onClick ? () => onClick() : undefined}
    >
      {children}
    </td>
  )
}

TableCell.displayName = "TableCell"

export { TableCell }