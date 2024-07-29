import React, { useEffect } from "react";
import logo from "../../assets/images/logo.png";
import "../../assets/css/MenuSideBar.scss";
import MenuItem from "./MenuItem";
import { menuItems } from "./MenuItemRoutes";
import { useStore } from "../../store";

const SideMenu = () => {
  const activeSideMenu = useStore((state) => state.activeSideMenu);
  const profileData = useStore((state) => state.profileData);

  const removeActiveClassFromSubMenu = () => {
    document.querySelectorAll(".sub-menu").forEach((el) => {
      el.classList.remove("active");
    });
  };

  useEffect(() => {
    let menuItems = document.querySelectorAll(".menu-item");
    menuItems.forEach((el) => {
      el.addEventListener("click", (e) => {
        const next = el.nextElementSibling;
        removeActiveClassFromSubMenu();
        menuItems.forEach((el) => el.classList.remove("active"));
        el.classList.toggle("active");
        if (next !== null) {
          next.classList.toggle("active");
        }
      });
    });
  }, []);

  return (
    <div className={`side-menu ${activeSideMenu ? "inactive" : ""}`}>
      {profileData.length !== 0 && (
        <div className="top-section">
          <div className="logo">
            <img
              src={
                profileData?.companyBranchRoles?.length !== 0
                  ? profileData?.companyBranchRoles[0]?.company.logoUrl
                  : logo
              }
              alt="logo"
            />
            {profileData?.companyBranchRoles?.length !== 0 ? (
              <span>
                {profileData?.companyBranchRoles[0]?.company.name} -{" "}
                {profileData?.companyBranchRoles[0]?.companyBranch.name}
              </span>
            ) : (
              <span>WinMe Life</span>
            )}
          </div>
        </div>
      )}

      <div className="main-menu">
        <ul>
          {menuItems.map(
            (menuItem, index) =>
              menuItem.privilege.includes(profileData.role) && (
                <MenuItem
                  key={index}
                  name={menuItem.name}
                  exact={menuItem.exact}
                  to={menuItem.to}
                  subMenus={menuItem.subMenus || []}
                  iconClassName={menuItem.iconClassName}
                  route_key={menuItem.route_key}
                />
              )
          )}
        </ul>
      </div>
      <div className="side-menu-footer">
        <div className="avatar">
          <img src={logo} alt="user" />
        </div>
        <div className="user-info">
          <h5>WinMe Life</h5>
          <p>version 1.0</p>
        </div>
      </div>
    </div>
  );
};

export default SideMenu;
