import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import reportWebVitals from "./reportWebVitals";
import { Home, Host, Listing, Listings, NotFound, User } from "./sections";
import "./styles/index.css";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
});

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />}></Route>
        <Route path="/host" element={<Host />}></Route>
        <Route path="/listing/:id" element={<Listing />}></Route>
        <Route path="/listings/:location?" element={<Listings title="TinyHouse" />}></Route>
        <Route path="/user/:id" element={<User />}></Route>
        <Route path="*" element={<NotFound />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

ReactDOM.render(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <App />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
