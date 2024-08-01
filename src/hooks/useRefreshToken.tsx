import { useEffect } from "react";
import { useMutation } from "@apollo/client";
import { REFRESH_TOKEN } from "../GraphQL/Mutations"; 
import moment from "moment";
import Progress from "react-progress-2";
import { useHistory } from "react-router-dom";
import { message } from "antd";
import { useStore } from "store/useStore";

// NOTE: This hook is used to refresh the access token when it expires and the user is still logged in to the application.
function useRefreshToken(steps) {
  const history = useHistory();
  const tokenString = localStorage.getItem("z");
  const token = tokenString ? JSON.parse(tokenString) : null;
  const setLogUser = useStore((state) => state.setLogUser);

  const [loginUserWithRefreshToken] = useMutation(REFRESH_TOKEN, {
    onCompleted: (data) => {
      if (data.loginUserWithRefreshToken) {
        const { accessToken, refreshToken } = data.loginUserWithRefreshToken;
        if (accessToken && refreshToken) {
          setLogUser(true, accessToken, refreshToken);
        }
      }
      Progress.hide();
    },
    onError: (error) => {
      localStorage.removeItem("z");
      history.push("/login");
      Progress.hide();
      message.error("Authentication fail. Please try again.");
    },
    fetchPolicy: "no-cache",
  });

  useEffect(() => {
    const setRefreshToken = () => {
      console.log("Checking token .....");
      let between = false;
      if (token) {
        between = moment(token.state.accessToken.expiresAt).isAfter(moment());
        if (!between) {
          console.log("Token expired");
          Progress.show();
          loginUserWithRefreshToken({
            variables: {
              token: token ? token.state.refreshToken.token : "",
            },
          });
        } else {
          console.log("Token still valid");
        }
      }
    };
    setRefreshToken();
    // eslint-disable-next-line
  }, [steps]);
}

export default useRefreshToken;
