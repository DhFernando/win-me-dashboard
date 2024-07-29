import React from "react";
import SideBanner from "../assets/images/logo-side.jpg";
import Logo from "../assets/images/logo.png";
import "./../assets/css/Login.scss";
import "./../assets/css/Common.scss";
import { Input } from "antd";
import { Button } from "antd";

export default function CompanyLogin() {
  return (
    <div className="outer__container">
      <div className="outer_box">
        <div className="outer_side_banner">
          <img src={SideBanner} alt="banner" />
        </div>
        <div className="outer_side_content">
          <div className="outer_logo">
            <img src={Logo} alt="logo" />
            <h2>WinMe Life</h2>
          </div>
          <div className="content">
            <div className="login_title">
              <h1>Company Login</h1>
              <p>Login to the dashboard</p>
            </div>
            <form>
              <Input
                type="text"
                className="form_input"
                placeholder="Email Address"
              />
              <Input.Password placeholder="password" className="form_input" />
              <Button type="primary" className="primary__btn full_width">
                Login
              </Button>
            </form>
            <p className="forget_link">Forgot password</p>
          </div>
        </div>
      </div>
    </div>
  );
}
