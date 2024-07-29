import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../assets/css/Dashboard.scss";
import Setting1 from "../assets/images/setting1.png";
import Setting2 from "../assets/images/setting2.png";
import { useBreadCrumb } from "../hooks/useBreadCrumb";
export default function Settings() {
  const location = useLocation();
  useBreadCrumb("Settings", location.pathname, "Settings");

  return (
    <div className="dashboard">
      <ul className="setting_box">
        <li>
          <Link to="/settings/account">
            <div className="setting_box_content">
              <img src={Setting1} alt="" />
              <div className="setting_box_title">
                <h3>Account Settings</h3>
              </div>
            </div>
          </Link>
        </li>
        <li>        
          <Link to="/settings">
            <div className="setting_box_content">
              <img src={Setting2} alt="" />
              <div className="setting_box_title">
                <h3>System Settings</h3>
              </div>
            </div>
          </Link>
        </li>
      </ul>
    </div>
  );
}
