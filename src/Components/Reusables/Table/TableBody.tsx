import * as React from "react";

const TableBody: React.FC<{}> = ({ children }) => {
  return <tbody>{children}</tbody>;
};

TableBody.displayName = "TableBody";

export { TableBody };
