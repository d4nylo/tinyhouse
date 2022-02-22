import { HomeOutlined, LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Avatar, Button, Menu } from "antd";
import { Link } from "react-router-dom";
import { LOG_OUT } from "../../../../lib/graphql/mutations";
import { LogOut as LogOutData } from "../../../../lib/graphql/mutations/LogOut/__generated__/LogOut";
import { Viewer } from "../../../../lib/types";
import { displaySuccessNotification } from "../../../../lib/utils";

interface Props {
  viewer: Viewer;
  setViewer: (viewer: Viewer) => void;
}

const { Item, SubMenu } = Menu;

export const MenuItems = ({ viewer, setViewer }: Props) => {
  const [logOut] = useMutation<LogOutData>(LOG_OUT, {
    onCompleted: (data) => {
      if (data && data.logOut) {
        setViewer(data.logOut);
        sessionStorage.removeItem("token");
        displaySuccessNotification("You've successfully logged out!");
      }
    },
  });

  const handleLogOut = () => {
    logOut();
  };

  const subMenuLogin =
    viewer.id && viewer.avatar ? (
      <SubMenu key="" title={<Avatar src={viewer.avatar} crossOrigin="anonymous"></Avatar>}>
        <Item key={`/user/${viewer.id}`} icon={<UserOutlined />}>
          <Link to={`/user/${viewer.id}`}>Profile</Link>
        </Item>
        <Item key="/logout" icon={<LogoutOutlined />} onClick={handleLogOut}>
          Log out
        </Item>
      </SubMenu>
    ) : (
      <Item key="/login">
        <Link to="/login">
          <Button type="primary">Sign In</Button>
        </Link>
      </Item>
    );

  return (
    <Menu mode="horizontal" selectable={false} className="menu" disabledOverflow={true}>
      <Item key="/host" icon={<HomeOutlined />}>
        <Link to="/host">Host</Link>
      </Item>
      {subMenuLogin}
    </Menu>
  );
};
