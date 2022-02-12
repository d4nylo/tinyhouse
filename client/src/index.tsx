import React from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import reportWebVitals from "./reportWebVitals";
import { Listings } from "./sections";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Listings title="TinyHouse Listings" />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
