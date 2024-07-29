import React, { useEffect } from "react";
import Logo from "../assets/images/logo.png";
import "./../assets/css/Welcome.scss";
import "./../assets/css/Common.scss";
import useCompanyInvitationByToken from "../hooks/useCompanyInvitationByToken";
import { Button, message } from "antd";

export default function WelcomeInvitation(props) {
  const queryParams = new URLSearchParams(props.location.search);

  const userDetails = useCompanyInvitationByToken(queryParams.get("token"));

  const formSubmit = () => {
    // Get the token from query params
    const token = queryParams.get("token") || "";
  
    // Safely extract company name and email
    const companyName = userDetails?.companyName || "";
    const email = userDetails?.invitedUser?.email || "";
  
    // Redirect with the extracted information
    props.history.push({
      pathname: `/set-password/${token}`,
      state: {
        company_name: companyName,
        email: email,
      },
    });
  };
  

  useEffect(() => {
    const tokenExpired = () => {
      if (userDetails.message === "Invitation expired") {
        props.history.push("/");
        message.error(userDetails.message);
      }
    };
    tokenExpired();
    // eslint-disable-next-line
  }, [userDetails]);

  return (
    <div className="outer__container">
      <div className="outer_box">
        <div className="outer_side_banner"></div>
        <div className="outer_side_content">
          <div className="outer_logo">
            <img src={Logo} alt="logo" />
            <h2>WinMe Life</h2>
          </div>
          <div className="content">
            <div className="welcome_title">
              <h1>
                Hello{" "}
                {userDetails.length !== 0
                  ? userDetails.invitedUser
                    ? userDetails.invitedUser.name
                    : ""
                  : ""}
                !
              </h1>
            </div>
            <div className="welcome_sub_txt">
              <p>
                You company name is{" "}
                <span>
                  {userDetails.length !== 0
                    ? userDetails.companyName
                      ? userDetails.companyName
                      : ""
                    : ""}
                </span>
              </p>
              <p>
                You email ID is{" "}
                <span>
                  {userDetails.length !== 0
                    ? userDetails.invitedUser
                      ? userDetails.invitedUser.email
                      : ""
                    : ""}
                </span>
              </p>
            </div>
            <div className="welcome_sub_txt">
              <p>
                Complete your account by creating a master password and
                reviewing user details
              </p>
            </div>
            <form>
              {userDetails.length !== 0 && userDetails.invitedUser ? (
                userDetails.invitedUser.passwordSetupRequired ? (
                  <Button
                    type="primary"
                    onClick={() => formSubmit()}
                    className="primary__btn full_width"
                  >
                    Let's Start
                  </Button>
                ) : (
                  <Button
                    type="primary"
                    onClick={() => formSubmit()}
                    className="primary__btn full_width"
                  >
                    Let's Start
                  </Button>
                )
              ) : (
                ""
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
