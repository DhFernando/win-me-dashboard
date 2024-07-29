import {
  HomeOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { Avatar, Breadcrumb, Dropdown, Menu, message } from "antd";
import React from "react";
import Progress from "react-progress-2";
import { Link, useHistory } from "react-router-dom";
import "../../assets/css/Header.scss";
import Logo from "../../assets/images/logo.png";
import client from "../../GraphQL/ApolloClient";
import { REVOKE_REFRESH_TOKEN } from "../../GraphQL/Mutations";
import { useBreadcrumbStore, useStore } from "../../store";
import Notification from "./Notification";

function Header(props) {
  const history = useHistory();
  const setSettingData = useStore((state) => state.setSettingData);
  const activeSideMenu = useStore((state) => state.activeSideMenu);
  const refreshToken = useStore((state) => state.refreshToken);
  const profileData = useStore((state) => state.profileData);
  const breadcrumb = useBreadcrumbStore((state) => state.breadcrumb);
  const setActiveRoute = useStore((state) => state.setActiveRoute);

  const logout = () => {
    Progress.show();
    if (refreshToken) {
      revokeRefreshToken({
        variables: {
          token: refreshToken.token,
        },
      });
    }
  };

  const [revokeRefreshToken] = useMutation(REVOKE_REFRESH_TOKEN, {
    onCompleted: (data) => {
      if (data.revokeRefreshToken) {
        message.success("Logged Out Successfully");
        client.resetStore();
        // localStorage.removeItem("z");
        localStorage.removeItem("breadCrumb");
        Progress.hide();
        history.push("/login");
      } else {
        message.error(data.revokeRefreshToken.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const homeRoot = () => {
    setActiveRoute("dashboard");
  };

  const profileNav = () => {
    setActiveRoute("settings");
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={profileNav}>
        <Link to="/settings/account/user-details">Profile</Link>
      </Menu.Item>
      <Menu.Item onClick={profileNav}>
        <Link to="/settings">Settings</Link>
      </Menu.Item>
      <Menu.Item onClick={logout}>
        <div>Logout</div>
      </Menu.Item>
    </Menu>
  );
  return (
    <div className="Header">
      <div className="Header_left">
        <div
          onClick={() => setSettingData(!activeSideMenu)}
          className="toggle-menu-btn"
        >
          {activeSideMenu ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        </div>
        <div className="Header_main">
          {profileData.length !== 0 && (
            <div className="Header_main_top">
              <div className="Header_main_top_right">
                <p>{breadcrumb.length !== 0 ? breadcrumb[0].title : "Title"}</p>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link to="/" className="link" onClick={() => homeRoot()}>
                      <HomeOutlined className="bb_home" />
                    </Link>
                  </Breadcrumb.Item>
                  {breadcrumb.map((item, index) => (
                    <Breadcrumb.Item>
                      <Link to={item.url} className="link">
                        <span className="bb_other">{item.name}</span>
                      </Link>
                    </Breadcrumb.Item>
                  ))}
                </Breadcrumb>
              </div>
            </div>
          )}
        </div>
      </div>
      <div className="Header_right">
        {profileData.length !== 0 && profileData.role !== "SUPER_ADMIN" && (
          <Notification />
        )}
        <Dropdown
          overlay={menu}
          trigger={["click"]}
          placement="bottomLeft"
          arrow
        >
          {profileData.length !== 0 ? (
            //
            profileData.avatarUrl ? (
              <Avatar src={profileData.avatarUrl} />
            ) : (
              <Avatar className="avatar_hd">
                {profileData.firstName.charAt(0) +
                  profileData.lastName.charAt(0)}
              </Avatar>
            )
          ) : (
            <Avatar src={Logo} />
          )}
        </Dropdown>
      </div>
    </div>
  );
}

export default Header;
