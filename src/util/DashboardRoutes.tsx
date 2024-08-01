import React, { useEffect } from "react";
import "../assets/css/Dashboard.scss";
import SideMenu from "../components/SideBar/SideMenu";
import { Switch, Route } from "react-router-dom";
import Header from "../components/DashBoardWidgets/Header"; 
import { routes } from "../routes";
import { useMediaQuery } from "react-responsive";
import { useStore } from "store/useStore";


function DashboardRoutes(props) {
  const activeSideMenu = useStore((state) => state.activeSideMenu);
  const setSettingData = useStore((state) => state.setSettingData);
  const isMobileDevice = useMediaQuery({ query: "(max-width: 600px)" });

  useEffect(() => {
    if (isMobileDevice) {
      setSettingData(true);
    }
    // eslint-disable-next-line
  }, [isMobileDevice]);

  return (
    <div>
      <SideMenu />
      <div className={`container_main ${activeSideMenu ? "inactive" : ""}`}>
        <Header />
        <Switch>
          {routes.map((route, i) => (
            <Route
              key={i}
              exact
              path={route.path}
              render={(props) => (
                // pass the sub-routes down to keep nesting
                <route.component exact {...props} routes={route.routes} />
              )}
            />
          ))}
        </Switch>
      </div>
    </div>
  );
}

export default DashboardRoutes;
