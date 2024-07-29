import "./App.css";
import "./assets/css/Responsive.scss";
import "./assets/css/ThemeChange.scss";
import Progress from "react-progress-2";
import "react-progress-2/main.css";
import { Switch, Route } from "react-router-dom";
import { ProtectedRoute } from "./ProtectedRoute";
import NotFount from "./errorPage/404";
import { ApolloProvider } from "@apollo/client";
import client from "./GraphQL/ApolloClient";
import { routesApp } from "./routes";
import { socket, SocketContext } from "./socket";
import "./assets/css/Models.scss";


function App() {
  return (
    <ApolloProvider client={client}>
      <div className="App">
        <SocketContext.Provider value={socket}>
          <Progress.Component />
          <Switch>
            {routesApp.map((route, i) =>
              route.auth ? (
                <ProtectedRoute
                  key={i}
                  exact
                  path={route.path}
                  component={route.component}
                />
              ) : (
                <Route
                  key={i}
                  exact
                  path={route.path}
                  component={route.component}
                />
              )
            )}
            <Route path="*" component={NotFount} />
          </Switch>
        </SocketContext.Provider>
      </div>
    </ApolloProvider>
  );
}

export default App;
