import { useState, useEffect } from "react";
import { Input, Layout } from "antd";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { MenuItems } from "./components";
import { Viewer } from "../../lib/types";
import { displayErrorMessage } from "../../lib/utils";

import imgLogo from "./assets/tinyhouse-logo.png";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Header } = Layout;
const { Search } = Input;

export const AppHeader = ({ viewer, setViewer }: Props) => {
  let { pathname } = useLocation();

  let navigate = useNavigate();

  const [search, setSearch] = useState("");

  useEffect(() => {
    if (pathname.includes("/listings")) {
      // Ex.: "/listings/toronto" => ["", "listings", "toronto"]
      const pathnameSubStrings = pathname.split("/");

      if (pathnameSubStrings.length === 3) {
        // Ex.: "san%20francisco" => "san francisco"
        const fixedLocationString = decodeURIComponent(pathnameSubStrings[2]);

        setSearch(fixedLocationString);
        return;
      }
    } else {
      setSearch("");
      return;
    }
  }, [pathname]);

  const onSearch = (value: string) => {
    const trimmedValue = value.trim();

    if (trimmedValue) {
      navigate(`/listings/${trimmedValue}`);
    } else {
      displayErrorMessage("Please enter a valid search!");
    }
  };

  return (
    <Header className="app-header">
      <div className="app-header__logo-search-section">
        <div className="app-header__logo">
          <Link to="/">
            <img src={imgLogo} alt="App logo" />
          </Link>
        </div>
        <div className="app-header__search-input">
          <Search
            placeholder="Search 'San Fransisco'"
            enterButton
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
            onSearch={onSearch}
          />
        </div>
      </div>
      <div className="app-header__menu-section">
        <MenuItems viewer={viewer} setViewer={setViewer} />
      </div>
    </Header>
  );
};
