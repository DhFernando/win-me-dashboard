import React from "react";
import Logo from "../assets/images/logo.png";
import "./../assets/css/Common.scss";
import { Button, Form, message } from "antd";
import { Input } from "antd";
import Progress from "react-progress-2";
import { useMutation } from "@apollo/client";
import { REQUEST_PASSWORD_RESET_OTP } from "../GraphQL/Mutations";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [form] = Form.useForm();
  const history = useHistory();

  const userLogin = () => {
    form.validateFields().then((values) => {
      Progress.show();
      requestPasswordResetOtp({
        variables: {
          ...values,
        },
      });
    });
  };

  const [requestPasswordResetOtp] = useMutation(REQUEST_PASSWORD_RESET_OTP, {
    onCompleted: (data) => {
      if (data.requestPasswordResetOtp.__typename === "PasswordResetRequest") {
        message.success("OTP sent successfully to your email");
        history.push(
          `/code-verification/${data.requestPasswordResetOtp.otpSession.token}`
        );
        Progress.hide();
      } else {
        message.error(data.requestPasswordResetOtp.message);
        Progress.hide();
      }
    },
    onError: (error) => {
      message.error(error.message);
      Progress.hide();
    },
    fetchPolicy: "no-cache",
  });

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };
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
              <h1>Forgot Password</h1>
              <p>Enter email address and mobile number of company admin</p>
            </div>
            <Form
              autoComplete="off"
              form={form}
              onFinish={userLogin}
              onFinishFailed={onFinishFailed}
            >
              <Form.Item
                name="login"
                rules={[
                  { required: true, message: "Email cannot be empty!" },
                  {
                    type: "email",
                    message: "The input is not valid E-mail!",
                  },
                ]}
              >
                <Input size="large" placeholder="Email address" />
              </Form.Item>
              <Button
                type="primary"
                size="large"
                className="primary__btn full_width"
                htmlType="submit"
              >
                Reset
              </Button>
            </Form>
            <Link to="/login" className="link back_link" >Back to Login</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
