import * as React from "react";

type TableRowProps = {
  bold?: boolean;
};

const TableRow: React.FC<TableRowProps> = ({ children, bold }) => {
  return <tr className={bold ? "table-row-bold" : ""}>{children}</tr>;
};

TableRow.displayName = "TableRow";

export { TableRow };
