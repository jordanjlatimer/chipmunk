import * as React from "react";

const TableHeader: React.FC<{}> = ({ children }) => {
  return (
    <thead>
      <tr>{children}</tr>
    </thead>
  );
};

TableHeader.displayName = "TableHeader";

export { TableHeader };
