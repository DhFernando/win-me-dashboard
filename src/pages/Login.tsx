import { useMutation } from "@apollo/client";
import { Button, Form, Input, message } from "antd";
import React, { useState } from "react";
import Progress from "react-progress-2";
import { Link, useHistory } from "react-router-dom";
import Logo from "../assets/images/logo.png";
import Auth from "../Auth";
import client from "../GraphQL/ApolloClient";
import { USER_LOGIN } from "../GraphQL/Mutations"; 
import "./../assets/css/Common.scss";
import "./../assets/css/Login.scss";
import { useStore } from "store/useStore";
import { GraphQLError } from "types/GraphQLTypes";

export default function Login() {
  const [form] = Form.useForm();
  const history = useHistory();
  const setLogUser = useStore((state) => state.setLogUser);
  const setActiveRoute = useStore((state) => state.setActiveRoute);
  const [postData, setPostData] = useState<any>({});

  const [loginUserWithPassword] = useMutation(USER_LOGIN);

  const userLogin = async () => {
    Progress.show();
    await loginUserWithPassword({
      variables: {
        ...postData,
        fcmToken: "admin-token"
      },
    }).then((res) => {
      console.log(res)
      if (res.data) {
        const { accessToken, refreshToken } = res.data.loginUserWithPassword;
        if (accessToken && refreshToken) {
          setLogUser(true, accessToken, refreshToken);
          setActiveRoute("dashboard");
          client.resetStore();
          setTimeout(() => {
            Auth.login(() => {
              history.push("/");
              // window.location.reload();
            });
          }, 1000);
        } else {
          if(res.data.loginUserWithPassword.__typename === GraphQLError.InvalidLoginError){
            message.error(res.data.loginUserWithPassword.message)
          }else{
            message.error("Invalid Credentials");
          } 
        }
      }
      Progress.hide();
    });
  };

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  return (
    <div className="outer__container">
      <div className="outer_box">
        <div className="outer_side_banner">
          {/* <img src={SideBanner} alt="banner" /> */}
        </div>
        <div className="outer_side_content">
          <div className="outer_logo">
            <img src={Logo} alt="logo" />
            <h2>WinMe Life</h2>
          </div>
          <div className="content">
            <div className="login_title">
              <h1>Login</h1>
              <p>Login to the Dashboard</p>
            </div>
            <Form
              autoComplete="off"
              form={form}
              onFinish={userLogin}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Username cannot be empty!" },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input
                  type="text"
                  size="large"
                  placeholder="Email Address"
                  onChange={(e) =>
                    setPostData({ ...postData, login: e.target.value })
                  }
                  value={postData.login}
                />
              </Form.Item>
              <Form.Item
                name="password"
                rules={[
                  { required: true, message: "Password cannot be empty!" },
                ]}
              >
                <Input.Password
                  size="large"
                  placeholder="password"
                  onChange={(e) =>
                    setPostData({ ...postData, password: e.target.value })
                  }
                  value={postData.password}
                />
              </Form.Item>
              <Link to="/forgot-password" className="link forget_link">
                Forgot Password?
              </Link>
              <Button
                type="primary"
                size="large"
                className="primary__btn full_width"
                htmlType="submit"
              >
                Login
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
