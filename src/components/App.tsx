import * as React from "react";
import { MenuItem } from "./MenuItem";
import { Budget } from "./Budget";
import "../styles/app.sass";
import { RiCalendarTodoFill, RiHome4Fill, RiSettings5Fill } from "@meronex/icons/ri";
import { ChipmunkIcon } from "./ChipmunkIcon";
import { AppData, AppDataContext } from "./AppDataContext";

export const App: React.FC<{}> = () => {
  const [curMod, setCurMod] = React.useState<"budget" | "home" | "settings">("budget");
  const [data, setData] = React.useState(undefined as AppData["data"]);

  React.useEffect(() => {
    fetch("https://orees7y5k3.execute-api.us-east-1.amazonaws.com/default/test", {
      method: "POST",
      body: JSON.stringify({
        action: "get-all",
        payload: {
          Key: { username: "jordanjlatimer@gmail.com" },
          TableName: "chipmunk",
        },
      }),
    })
      .then(response => response.json())
      .then(json => setData(json["Item"]));
  }, []);

  const modules = {
    budget: <Budget />,
    home: "Home",
    settings: "Settings",
  };

  return (
    <AppDataContext.Provider value={{ data: data, updateAppData: (value: AppData["data"]) => setData(value) }}>
      <div className="menu">
        <ChipmunkIcon />
        <MenuItem action={() => setCurMod("home")} icon={<RiHome4Fill />} label="Home" />
        <MenuItem action={() => setCurMod("budget")} icon={<RiCalendarTodoFill />} label="Budget" />
        <MenuItem action={() => setCurMod("settings")} icon={<RiSettings5Fill />} label="Settings" />
      </div>
      <div className="module-container">{modules[curMod]}</div>
    </AppDataContext.Provider>
  );
};
