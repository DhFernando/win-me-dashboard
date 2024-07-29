import { setContext } from "@apollo/client/link/context";
import {
  ApolloClient,
  createHttpLink,
  from,
  fromPromise,
  InMemoryCache,
} from "@apollo/client";
import { onError } from "@apollo/client/link/error";
import { REFRESH_TOKEN } from "./Mutations";
import Progress from "react-progress-2";
import { notification } from "antd";

let isRefreshing = false;
// Explicitly define the type of pendingRequests
let pendingRequests: Array<() => void> = [];
const tokenString = localStorage.getItem("z");
const token = tokenString ? JSON.parse(tokenString) : null;

const resolvePendingRequests = () => {
  pendingRequests.forEach((callback) => callback());
  pendingRequests = [];
  window.location.reload();
};

const openNotificationGQL = (type, messages, extensions) => {
  Progress.hide();
  console.log(extensions.code);
  if (extensions.code === "BAD_USER_INPUT") {
    notification[type]({
      message: messages ? messages : "Validation Error",
      description: "Please check your input and try again.",
    });
  } else if (extensions.code === "GRAPHQL_VALIDATION_FAILED") {
    notification[type]({
      message: messages,
      description: "Please login and try again.",
    });
  }
};

const errorLink = onError(
  ({ graphQLErrors, networkError, operation, forward }) => {
    if (graphQLErrors) {
      for (let err of graphQLErrors) {
        switch (err?.extensions?.code) {
          case "UNAUTHENTICATED":
            let forward$;

            if (!isRefreshing) {
              isRefreshing = true;

              forward$ = fromPromise(
                client
                  .mutate({
                    mutation: REFRESH_TOKEN,
                    variables: {
                      token: token ? token.state.refreshToken.token : null,
                    },
                    fetchPolicy: "no-cache",
                  })
                  .then((data) => {
                    const tokenString = localStorage.getItem("z");
                    const accessToke = tokenString ? JSON.parse(tokenString) : null;
                    accessToke.state.accessToken =
                      data.data.loginUserWithRefreshToken.accessToken;
                    localStorage.setItem("z", JSON.stringify(accessToke));
                    resolvePendingRequests();
                    return true;
                  })
                  .then(() => {
                    resolvePendingRequests();
                    return true;
                  })
                  .catch(() => {
                    pendingRequests = [];
                    return false;
                  })
                  .finally(() => {
                    isRefreshing = false;
                  })
              );
            } else {
              forward$ = fromPromise(
                new Promise<void>((resolve) => {
                  pendingRequests.push(() => resolve());
                })
              );
            }

            return forward$.flatMap(() => forward(operation));
          default:
            openNotificationGQL("error", err.message, err.extensions);
        }
      }
    }

    if (networkError) console.log(`[Network error]: ${networkError}`);
  }
);

const httpLink = createHttpLink({
  uri: `${process.env.REACT_APP_API_URL}/graphql`,
});

const authLink = setContext(async (operation, { headers }) => {
  const tokenString = localStorage.getItem("z");
  const token = tokenString ? JSON.parse(tokenString) : null;
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token.state.accessToken.token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    addTypename: false,
  }),
  defaultOptions: {
    mutate: { errorPolicy: "ignore" },
  },
});

export default client;
