import * as React from "react";
import { Menu } from "./Components/Menu/Menu/Menu";

const App: React.FC<any> = (props: any) => {
  return (
    <Menu>
      Hello
    </Menu>
  );
};

App.displayName = "App";

export { App };
