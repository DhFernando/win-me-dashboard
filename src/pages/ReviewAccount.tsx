import React from "react";
import Logo from "../assets/images/logo.png";
import "./../assets/css/ReviewAccount.scss";
import "./../assets/css/Common.scss";
import { Button } from "antd";
import { Input } from "antd";

export default function ReviewAccount() {
  return (
    <div className="outer__container">
      <div className="outer_box">
        <div className="outer_side_full">
          <div className="review_outer_logo">
            <div className="outer_logo">
              <img src={Logo} alt="logo" />
              <h2>WinMe Life</h2>
            </div>
            <p>ID: DE2342</p>
          </div>
          <div className="review_content">
            <div className="review_title">
              <h1>Review Account Details</h1>
            </div>
            <form className="review_form">
              <p>
                Branch Details <span>Basic details about the branch</span>
              </p>
              <Input className="form_input" placeholder="Branch name" />
              <Input className="form_input" placeholder="Branch description" />
              <div className="review_location_row form_input">
                <Input className="location" placeholder="Location" />
                <Input className="map" placeholder="Map location" />
              </div>
              <div className="review_branch_row form_input">
                <Input className="code" placeholder="Branch code" />
                <Input className="type" placeholder="Branch type" />
              </div>
              <div className="review_btn">
                <Button type="primary" className="primary__btn">
                  Next
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
