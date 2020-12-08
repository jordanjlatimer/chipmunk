import * as React from "react";
import "../../../styles/table.sass";

const Table: React.FC<{}> = ({ children }) => {
  return <table className="table">{children}</table>;
};

Table.displayName = "Table";

export { Table };
