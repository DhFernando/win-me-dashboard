import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import "./../assets/css/Common.scss";
import { Button, Form, message } from "antd";
import { Input } from "antd";
import { useHistory, Link } from "react-router-dom";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client";
import { RESET_PASSWORD } from "../GraphQL/Mutations";

export default function SetNewPassword(props) {
  const sessionId = props.match.params.token;
  const [form] = Form.useForm();
  const history = useHistory();
  const [result, setResult] = useState<any>(null);

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  const userLogin = () => {
    form.validateFields().then((values) => {
      Progress.show();
      resetPassword({
        variables: {
          ...values,
          sessionId,
        },
      });
    });
  };

  const [resetPassword] = useMutation(RESET_PASSWORD, {
    onCompleted: (data) => {
      if (data.resetPassword.__typename === "PasswordResetSuccess") {
        message.success("Password changed successfully");
        Progress.hide();
        setResult({ result: "success" });
        history.push("/login");
      } else {
        message.error(data.resetPassword.message);
        Progress.hide();
        setResult({ result: "error" });
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  return (
    <div className="outer__container">
      <div className="outer_box2">
        <div className="outer_side_full">
          <div className="outer_logo">
            <img src={Logo} alt="logo" />
            <h2>WinMe Life</h2>
          </div>
          <div className="center_content">
            <div className="login_title">
              <h1>Set New Password</h1>
              <p>Enter your new password</p>
            </div>
            <Form
              autoComplete="off"
              form={form}
              onFinish={userLogin}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="password"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please input your new password!",
                  },
                  {
                    ...(result && {
                      hasFeedback: true,
                      help:
                        result.result === "success"
                          ? "Password changed successfully"
                          : "Password Mismatch! Please try again",
                      validateStatus:
                        result.result === "success" ? "success" : "error",
                    }),
                  },
                ]}
              >
                <Input
                  type="password"
                  size="large"
                  placeholder="New Password"
                />
              </Form.Item>
              <Form.Item
                name="confirmPassword"
                hasFeedback
                rules={[
                  {
                    required: true,
                    message: "Please confirm your new password!",
                  },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("password") === value) {
                        return Promise.resolve();
                      } else {
                        return Promise.reject("Password does not match!");
                      }
                    },
                  }),
                ]}
              >
                <Input
                  type="password"
                  size="large"
                  placeholder="Confirm Password"
                />
              </Form.Item>
              <Button
                type="primary"
                size="large"
                className="primary__btn full_width"
                htmlType="submit"
              >
                Set New Password
              </Button>
            </Form>
            <Link to="/login" className="link back_link">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
