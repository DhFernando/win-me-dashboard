import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../../assets/css/Dashboard.scss";
import setting3 from "../../assets/images/setting3.png";
import { useBreadCrumb } from "../../hooks/useBreadCrumb";
export default function AccountSetting() {
  const location = useLocation();
  useBreadCrumb("Account Settings", location.pathname, "", "add");

  return (
    <div className="dashboard">
      <ul className="setting_box">
        <li>
          <Link to="/settings/account/user-details">
            <div className="setting_box_content">
              <img src={setting3} alt="" />
              <div className="setting_box_title">
                <h3>User Details</h3>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
