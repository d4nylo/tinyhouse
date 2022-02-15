import React, { useState } from "react";
import ReactDOM from "react-dom";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { Affix, Layout } from "antd";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AppHeader, Home, Host, Listing, Listings, Login, NotFound, User } from "./sections";
import { Viewer } from "./lib/types";
import reportWebVitals from "./reportWebVitals";
import "./styles/index.css";

const client = new ApolloClient({
  cache: new InMemoryCache(),
  uri: "/api",
});

const initialViewer: Viewer = {
  id: null,
  avatar: null,
  didRequest: false,
  hasWallet: null,
  token: null,
};

const App = () => {
  const [viewer, setViewer] = useState<Viewer>(initialViewer);

  console.log(viewer);

  return (
    <BrowserRouter>
      <Layout id="app">
        <Affix offsetTop={0} className="app__affix-header">
          <AppHeader viewer={viewer} setViewer={setViewer} />
        </Affix>
        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/host" element={<Host />}></Route>
          <Route path="/listing/:id" element={<Listing />}></Route>
          <Route path="/listings/:location?" element={<Listings title="TinyHouse" />}></Route>
          <Route path="/login" element={<Login setViewer={setViewer} />}></Route>
          <Route path="/user/:id" element={<User />}></Route>
          <Route path="*" element={<NotFound />}></Route>
        </Routes>
      </Layout>
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
