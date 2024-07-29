import React, { useState } from "react";
import Logo from "../assets/images/logo.png";
import "./../assets/css/Welcome.scss";
import "./../assets/css/Common.scss";
import { Button, Input, Form, message } from "antd";
import { useMutation } from "@apollo/client";
import Progress from "react-progress-2";
import { ACCEPT_COMPANY_INVITATION } from "../GraphQL/Mutations";

export default function SetPassword(props) {
  let company_name = props.location.state.company_name;
  let email = props.location.state.email;
  const [form] = Form.useForm();
  const [result, setResult] = useState<any>(null);

  const onFinishFailed = () => {
    message.error("Please fill all the details");
  };

  const [acceptCompanyInvitation] = useMutation(ACCEPT_COMPANY_INVITATION, {
    onCompleted: (data) => {
      if (data.acceptCompanyInvitation.success) {
        message.success("Password set successfully");
        props.history.push("/login");
        Progress.hide();
        setResult({ result: "success" });
      } else {
        Progress.hide();
        setResult({ result: "error" });
        message.error(data.acceptCompanyInvitation.message);
      }
    },
    onError: (error) => {
      Progress.hide();
      message.error(error.message);
    },
    fetchPolicy: "no-cache",
  });

  const onFormSubmit = () => {
    form.validateFields().then((values) => {
      console.log(values);
      if (values.password === values.password_confirm) {
        Progress.show();
        acceptCompanyInvitation({
          variables: {
            token: props.match.params.token,
            password: values.password,
          },
          awaitRefetchQueries: true,
        });
      } else {
        setResult({ result: "error" });
        message.error("Password and confirm password should be same");
      }
    });
  };

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
              <h1>Setup Your Account Password</h1>
            </div>
            <div className="welcome_sub_txt">
              <p>
                You company name is{" "}
                <span>{company_name ? company_name : "company name"}</span>
              </p>
              <p>
                You email ID is <span>{email ? email : "Email"}</span>
              </p>
            </div>
            <Form
              form={form}
              onFinish={onFormSubmit}
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
                <Input.Password size="large" placeholder="Password" />
              </Form.Item>

              <Form.Item
                name="password_confirm"
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
                <Input.Password size="large" placeholder="Confirm Password" />
              </Form.Item>
              <Button
                type="primary"
                size="large"
                className="primary__btn full_width"
                htmlType="submit"
              >
                Submit
              </Button>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}
